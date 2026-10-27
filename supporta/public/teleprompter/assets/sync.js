/**
 * Motor de sincronizacao do PrompterSync.
 *
 * A ideia central: NAO transmitir a posicao do texto. Transmitir a formula do
 * movimento. Cada tela calcula a posicao sozinha, 60 vezes por segundo:
 *
 *     posicao(t) = ancoraPos + velocidade * (t - ancoraEm)
 *
 * So mandamos mensagem quando algo muda de verdade (play, pause, velocidade,
 * pulo). Entre um comando e outro as telas rolam em sincronia sem trocar nada.
 * Por isso a latencia da rede deixa de afetar a fluidez: 30ms de atraso movem
 * o inicio do comando, nao a suavidade da rolagem.
 *
 * Para a formula bater nos dois aparelhos, os relogios precisam concordar.
 * Isso e resolvido com um handshake tipo NTP (ping/pong) que mede o desvio
 * entre os relogios e o compensa.
 *
 * Transporte em duas camadas:
 *   1. BroadcastChannel  - outra aba do mesmo navegador, custo zero.
 *   2. Supabase Realtime - qualquer outro aparelho, WebSocket em Sao Paulo.
 * As duas rodam juntas; vale a mensagem que chegar primeiro.
 */

const PROTO = 1;
const HEARTBEAT_MS = 25000;
const RECONNECT_BASE_MS = 700;
const RECONNECT_MAX_MS = 8000;
const CLOCK_SAMPLES = 8;
const CLOCK_REFRESH_MS = 30000;

const now = () => Date.now();

function randomId(bytes = 8) {
    // Ver a nota em store.js: `crypto` nao existe fora de contexto seguro.
    if (globalThis.crypto?.getRandomValues) {
        const a = new Uint8Array(bytes);
        crypto.getRandomValues(a);
        return Array.from(a, (b) => b.toString(36).padStart(2, "0")).join("").slice(0, 12);
    }
    return (Math.random().toString(36) + Math.random().toString(36)).replace(/0\./g, "").slice(0, 12);
}

/** Estado inicial de uma sessao. */
export function estadoInicial(extra = {}) {
    return {
        titulo: "Sem titulo",
        texto: "",
        // aparencia
        fonte: 64,
        entrelinha: 1.5,
        margem: 12,
        espelhoH: false,
        espelhoV: false,
        centralizado: false,
        guia: true,
        // movimento (o que de fato sincroniza)
        tocando: false,
        velocidade: 90,
        ancoraPos: 0,
        ancoraEm: 0,
        ...extra,
    };
}

/** Posicao derivada do estado, no instante `t` do relogio compartilhado. */
export function posicaoEm(estado, t) {
    if (!estado.tocando) return estado.ancoraPos;
    return estado.ancoraPos + (estado.velocidade * (t - estado.ancoraEm)) / 1000;
}

/**
 * Reancora o movimento no instante `t`, preservando a posicao atual.
 * Chamado sempre que play/pause/velocidade/pulo mudam, para que a formula
 * continue valendo a partir dali.
 */
export function reancorar(estado, t, novaPos = null) {
    const pos = novaPos === null ? posicaoEm(estado, t) : novaPos;
    estado.ancoraPos = pos;
    estado.ancoraEm = t;
    return estado;
}

export class Sync {
    /**
     * @param {object} opts
     * @param {string} opts.sala        id da sala (vem da URL)
     * @param {string} opts.papel       "controle" ou "leitura"
     * @param {string} opts.url         URL do projeto Supabase
     * @param {string} opts.chave       chave publica (anon)
     * @param {(estado, origem) => void} opts.aoReceber
     * @param {(info) => void} opts.aoMudarStatus
     */
    constructor({ sala, papel, url, chave, aoReceber, aoMudarStatus, aoComando, aoMedirTela }) {
        this.sala = sala;
        this.papel = papel;
        this.url = url;
        this.chave = chave;
        this.aoReceber = aoReceber || (() => {});
        this.aoMudarStatus = aoMudarStatus || (() => {});
        this.aoComando = aoComando || (() => {});
        this.aoMedirTela = aoMedirTela || (() => {});

        this.id = randomId();
        this.topico = `realtime:prompter:${sala}`;

        this.ws = null;
        this.ref = 0;
        this.conectado = false;
        this.tentativas = 0;
        this.heartbeat = null;
        this.reconectarTimer = null;
        this.fechado = false;

        // Desvio entre o relogio local e o relogio de referencia (o do controle).
        this.desvio = 0;
        this.desvioMedido = false;
        this.amostras = [];
        this.pingsAbertos = new Map();
        this.clockTimer = null;

        this.canalLocal = null;
        this.pares = new Set();
        this.recebeuEstado = false;
        this.tentativasOla = 0;
        this.olaTimer = null;

        this._abrirCanalLocal();
        this._conectar();
        // Pede o estado ja pelo canal local, sem esperar a rede: se o painel
        // estiver em outra aba da mesma maquina, a resposta e instantanea.
        if (this.papel === "leitura") this._apresentar();
    }

    /**
     * Anuncia a chegada e pede o estado atual. Insiste com espera crescente ate
     * receber, porque o painel pode ainda estar carregando quando esta tela abre.
     */
    _apresentar() {
        clearTimeout(this.olaTimer);
        if (this.fechado || this.recebeuEstado) return;
        this.enviar({ tipo: "ola", papel: this.papel });
        const espera = Math.min(400 * 2 ** this.tentativasOla++, 5000);
        this.olaTimer = setTimeout(() => this._apresentar(), espera);
    }

    /** Relogio compartilhado: local + desvio medido. */
    agora() {
        return now() + this.desvio;
    }

    get pronto() {
        return this.conectado;
    }

    // ---------------------------------------------------------------- canal local

    _abrirCanalLocal() {
        if (typeof BroadcastChannel === "undefined") return;
        try {
            this.canalLocal = new BroadcastChannel(`prompter:${this.sala}`);
            this.canalLocal.onmessage = (e) => this._receber(e.data, "local");
        } catch {
            this.canalLocal = null;
        }
    }

    // ---------------------------------------------------------------- websocket

    _conectar() {
        if (this.fechado) return;
        const endereco = `${this.url.replace(/^http/, "ws")}/realtime/v1/websocket?apikey=${encodeURIComponent(
            this.chave
        )}&vsn=1.0.0`;

        let ws;
        try {
            ws = new WebSocket(endereco);
        } catch {
            return this._agendarReconexao();
        }
        this.ws = ws;

        ws.onopen = () => {
            this.tentativas = 0;
            this._enviarBruto({
                topic: this.topico,
                event: "phx_join",
                payload: {
                    config: {
                        broadcast: { self: false, ack: false },
                        presence: { key: this.id },
                        private: false,
                    },
                },
                ref: this._proxRef(),
            });
        };

        ws.onmessage = (ev) => {
            let msg;
            try {
                msg = JSON.parse(ev.data);
            } catch {
                return;
            }
            this._tratarPhoenix(msg);
        };

        ws.onerror = () => {
            /* onclose cuida da reconexao */
        };

        ws.onclose = () => {
            const estavaConectado = this.conectado;
            this.conectado = false;
            clearInterval(this.heartbeat);
            this.heartbeat = null;
            if (estavaConectado) this._status();
            this._agendarReconexao();
        };
    }

    _tratarPhoenix(msg) {
        if (msg.event === "phx_reply" && msg.payload?.status === "ok" && !this.conectado) {
            this.conectado = true;
            this._status();
            this.heartbeat = setInterval(() => {
                this._enviarBruto({ topic: "phoenix", event: "heartbeat", payload: {}, ref: this._proxRef() });
            }, HEARTBEAT_MS);
            // Ao entrar na rede, se apresenta de novo: agora alcanca tambem
            // quem esta em outro aparelho, nao so as abas locais.
            this.tentativasOla = 0;
            if (this.papel === "leitura") this._apresentar();
            else this.enviar({ tipo: "ola", papel: this.papel });
            this._medirRelogio();
            if (!this.clockTimer) {
                this.clockTimer = setInterval(() => this._medirRelogio(), CLOCK_REFRESH_MS);
            }
            return;
        }
        if (msg.event === "broadcast" && msg.payload?.event === "msg") {
            this._receber(msg.payload.payload, "rede");
        }
    }

    _agendarReconexao() {
        if (this.fechado || this.reconectarTimer) return;
        const espera = Math.min(RECONNECT_BASE_MS * 2 ** this.tentativas++, RECONNECT_MAX_MS);
        this.reconectarTimer = setTimeout(() => {
            this.reconectarTimer = null;
            this._conectar();
        }, espera);
    }

    _proxRef() {
        return String(++this.ref);
    }

    _enviarBruto(obj) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(obj));
            return true;
        }
        return false;
    }

    // ---------------------------------------------------------------- envio

    /** Publica uma mensagem nos dois canais. */
    enviar(dados) {
        const pacote = { v: PROTO, de: this.id, ...dados };
        this.canalLocal?.postMessage(pacote);
        this._enviarBruto({
            topic: this.topico,
            event: "broadcast",
            payload: { type: "broadcast", event: "msg", payload: pacote },
            ref: this._proxRef(),
        });
    }

    /** Envia o estado completo (usado pelo controle). */
    publicarEstado(estado) {
        this.enviar({ tipo: "estado", estado });
    }

    // ---------------------------------------------------------------- recepcao

    _receber(pacote, origem) {
        if (!pacote || pacote.v !== PROTO || pacote.de === this.id) return;

        switch (pacote.tipo) {
            case "ola":
                this.pares.add(pacote.de);
                this._status();
                // Quem controla responde com o estado completo para quem chegou.
                if (this.papel === "controle") this.aoReceber(null, "pedido-de-estado");
                break;

            case "estado":
                this.pares.add(pacote.de);
                this.recebeuEstado = true;
                clearTimeout(this.olaTimer); // chegou, pode parar de insistir
                this.aoReceber(pacote.estado, origem);
                this._status();
                break;

            case "ping":
                // Responde carimbando o proprio relogio.
                this.enviar({ tipo: "pong", para: pacote.de, t0: pacote.t0, t1: now() });
                break;

            case "pong":
                if (pacote.para === this.id) this._registrarPong(pacote);
                break;

            case "comando":
                // A tela de leitura pode pedir play/pause tocando nela; quem
                // decide e sempre o painel, para nao existirem duas verdades.
                if (this.papel === "controle") this.aoComando(pacote.acao);
                break;

            case "tela":
                // Dimensoes reais da tela de leitura. O painel precisa delas
                // para reproduzir a mesma quebra de linha no espelho.
                this.pares.add(pacote.de);
                if (this.papel === "controle") this.aoMedirTela(pacote.medidas);
                break;

            case "saiu":
                this.pares.delete(pacote.de);
                this._status();
                break;

            default:
                break;
        }
    }

    _status() {
        this.aoMudarStatus({
            conectado: this.conectado,
            pares: this.pares.size,
            desvio: this.desvio,
            relogioPronto: this.desvioMedido,
        });
    }

    // ---------------------------------------------------------------- relogio

    /**
     * Handshake tipo NTP. Manda varios pings; para cada resposta calcula
     *   desvio = t1 - (t0 + rtt/2)
     * e fica com a mediana das amostras de menor ida-e-volta, que sao as menos
     * contaminadas por congestionamento.
     *
     * Quem controla e a referencia: seu desvio e sempre zero.
     */
    _medirRelogio() {
        if (this.papel === "controle") {
            this.desvio = 0;
            this.desvioMedido = true;
            return;
        }
        this.amostras = [];
        let enviados = 0;
        const disparar = () => {
            if (enviados++ >= CLOCK_SAMPLES || this.fechado) return;
            const t0 = now();
            const marca = `${t0}:${enviados}`;
            this.pingsAbertos.set(marca, t0);
            this.enviar({ tipo: "ping", t0: marca });
            setTimeout(disparar, 120);
        };
        disparar();
    }

    _registrarPong(pacote) {
        const t0 = this.pingsAbertos.get(pacote.t0);
        if (t0 === undefined) return;
        this.pingsAbertos.delete(pacote.t0);

        const t2 = now();
        const rtt = t2 - t0;
        const desvio = pacote.t1 - (t0 + rtt / 2);
        this.amostras.push({ rtt, desvio });

        // Usa a metade mais rapida das amostras e tira a mediana do desvio.
        const ordenadas = [...this.amostras].sort((a, b) => a.rtt - b.rtt);
        const boas = ordenadas.slice(0, Math.max(1, Math.ceil(ordenadas.length / 2)));
        const desvios = boas.map((x) => x.desvio).sort((a, b) => a - b);
        this.desvio = desvios[Math.floor(desvios.length / 2)];
        this.desvioMedido = true;
        this._status();
    }

    // ---------------------------------------------------------------- fim

    fechar() {
        this.fechado = true;
        try {
            this.enviar({ tipo: "saiu" });
        } catch {
            /* ignora */
        }
        clearInterval(this.heartbeat);
        clearInterval(this.clockTimer);
        clearTimeout(this.reconectarTimer);
        clearTimeout(this.olaTimer);
        this.canalLocal?.close();
        try {
            this.ws?.close();
        } catch {
            /* ignora */
        }
    }
}
