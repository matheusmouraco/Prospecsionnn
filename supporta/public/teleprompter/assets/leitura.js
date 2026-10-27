/**
 * Tela de leitura (o teleprompter em si).
 *
 * Nao guarda estado em variaveis reativas nem re-renderiza durante a rolagem.
 * A cada quadro ela apenas calcula a posicao pela formula e escreve um
 * transform. Isso mantem a rolagem em 60 fps mesmo com roteiros longos.
 */
import { Sync, posicaoEm, estadoInicial } from "./sync.js";
import { SUPABASE_URL, SUPABASE_KEY } from "./config.js";
import { icone } from "./icons.js";

export function montarLeitura(raiz, sala) {
    raiz.innerHTML = `
    <div class="leitura" id="palco">
      <div class="selo" id="selo"></div>
      <div class="guia" id="guia" hidden></div>
      <div class="janela" id="janela">
        <div class="fita" id="fita"></div>
      </div>
      <div class="cortina" id="cortina">
        <div>
          ${icone("broadcast", 34)}
          <h2>Esperando o painel de controle</h2>
          <p>Abra esta mesma sessao no computador e o roteiro aparece aqui automaticamente.</p>
        </div>
      </div>
    </div>`;

    const palco = raiz.querySelector("#palco");
    const janela = raiz.querySelector("#janela");
    const fita = raiz.querySelector("#fita");
    const guia = raiz.querySelector("#guia");
    const selo = raiz.querySelector("#selo");
    const cortina = raiz.querySelector("#cortina");

    let estado = estadoInicial();
    let recebeu = false;
    let limite = 0;
    let ajusteLocal = 0; // deslocamento manual feito aqui, sem mexer na sessao
    let pintado = null;
    let ocultarSeloEm = 0;

    const sync = new Sync({
        sala,
        papel: "leitura",
        url: SUPABASE_URL,
        chave: SUPABASE_KEY,
        aoReceber: (novo) => {
            if (!novo) return;
            const trocouTexto = novo.texto !== estado.texto;
            estado = novo;
            if (!recebeu) {
                recebeu = true;
                cortina.hidden = true;
                reportarTela(); // o painel ja pode montar o espelho fiel
            }
            aplicarAparencia();
            if (trocouTexto) medir();
            desenharSelo();
        },
        aoMudarStatus: () => desenharSelo(),
    });

    // ------------------------------------------------------------- aparencia

    function aplicarAparencia() {
        fita.style.fontSize = `${estado.fonte}px`;
        fita.style.lineHeight = String(estado.entrelinha);
        fita.style.textAlign = estado.centralizado ? "center" : "left";
        fita.style.paddingLeft = `${estado.margem}%`;
        fita.style.paddingRight = `${estado.margem}%`;
        fita.style.fontFamily = "var(--fonte-leitura)";
        if (fita.textContent !== estado.texto) {
            fita.textContent = estado.texto || "Sem texto no roteiro.";
        }

        // O espelhamento vai na janela inteira, nao no texto: assim a direcao
        // da rolagem se inverte junto com a imagem, que e o comportamento certo
        // no vidro do teleprompter.
        const t = `${estado.espelhoH ? "scaleX(-1) " : ""}${estado.espelhoV ? "scaleY(-1)" : ""}`.trim();
        janela.style.transform = t || "none";

        guia.hidden = !estado.guia;
        guia.style.top = "";
        guia.style.bottom = "";
        if (estado.espelhoV) guia.style.bottom = "38%";
        else guia.style.top = "38%";
    }

    function medir() {
        // Espaco antes e depois para o texto comecar na linha guia e poder
        // terminar de passar por ela.
        fita.style.paddingTop = `${Math.round(janela.clientHeight * 0.38)}px`;
        fita.style.paddingBottom = `${Math.round(janela.clientHeight * 0.72)}px`;
        limite = Math.max(0, fita.scrollHeight - janela.clientHeight);
    }

    /**
     * Informa ao painel o tamanho real desta tela. Sem isso o espelho do
     * painel quebraria as linhas em posicoes diferentes e mostraria algo que
     * o apresentador nao esta vendo.
     */
    let ultimasMedidas = "";
    function reportarTela() {
        const medidas = {
            largura: janela.clientWidth,
            altura: janela.clientHeight,
            densidade: Math.round((window.devicePixelRatio || 1) * 100) / 100,
        };
        const assinatura = `${medidas.largura}x${medidas.altura}`;
        if (assinatura === ultimasMedidas) return;
        ultimasMedidas = assinatura;
        sync.enviar({ tipo: "tela", medidas });
    }

    /**
     * Remede tudo e avisa o painel.
     *
     * No celular a altura util muda o tempo todo: a barra de endereco do
     * navegador aparece e some conforme a pessoa toca na tela, e girar o
     * aparelho troca largura por altura. O ResizeObserver sozinho nao e
     * confiavel nesses casos (no iOS ele frequentemente nao dispara para
     * elementos ancorados na viewport), por isso escutamos tambem o
     * visualViewport, o resize da janela e a mudanca de orientacao.
     */
    let remedirAgendado = null;
    function remedir() {
        clearTimeout(remedirAgendado);
        remedirAgendado = setTimeout(() => {
            medir();
            reportarTela();
        }, 60);
    }

    const observador = new ResizeObserver(remedir);
    observador.observe(janela);
    observador.observe(fita);

    window.addEventListener("resize", remedir);
    window.addEventListener("orientationchange", remedir);
    window.visualViewport?.addEventListener("resize", remedir);

    // Enquanto a fonte do roteiro nao termina de carregar, o texto e medido com
    // as metricas erradas. Remede assim que ela fica pronta.
    document.fonts?.ready?.then(remedir);

    // --------------------------------------------------------------- selo

    function desenharSelo() {
        const conectado = sync.pronto;
        let texto;
        let estadoPisca;
        if (!conectado) {
            texto = "Reconectando";
            estadoPisca = "erro";
        } else if (!recebeu) {
            texto = "Conectado, esperando o roteiro";
            estadoPisca = "ligado";
        } else if (estado.tocando) {
            texto = "Rolando";
            estadoPisca = "ativo";
        } else {
            texto = "Pausado, toque para iniciar";
            estadoPisca = "ligado";
        }
        selo.innerHTML = `<span class="pisca" data-estado="${estadoPisca}"></span>${texto}`;
        selo.dataset.oculto = "0";
        ocultarSeloEm = estado.tocando ? performance.now() + 2600 : 0;
    }

    // ------------------------------------------------------- laco de desenho

    let raf;
    function quadro(agoraLocal) {
        raf = requestAnimationFrame(quadro);

        const t = Date.now() + sync.desvio; // relogio compartilhado
        let y = posicaoEm(estado, t) + ajusteLocal;
        if (y < 0) y = 0;
        else if (y > limite) y = limite;

        const arred = Math.round(y * 100) / 100;
        if (arred !== pintado) {
            pintado = arred;
            fita.style.transform = `translate3d(0, ${-arred}px, 0)`;
        }

        if (ocultarSeloEm && agoraLocal > ocultarSeloEm) {
            selo.dataset.oculto = "1";
            ocultarSeloEm = 0;
        }
    }
    raf = requestAnimationFrame(quadro);

    // ------------------------------------------------------------- comandos

    /** Pede ao painel para alternar play. A tela de leitura nao decide sozinha. */
    function alternar() {
        sync.enviar({ tipo: "comando", acao: "alternar" });
        desenharSelo();
    }

    palco.addEventListener("click", alternar);

    palco.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            e.preventDefault();
            alternar();
        }
    });

    // Ajuste fino local: quem le pode corrigir o enquadramento sem atrapalhar
    // o painel. Nao mexe na sessao, so nesta tela.
    janela.addEventListener(
        "wheel",
        (e) => {
            e.preventDefault();
            ajusteLocal += e.deltaY * (estado.espelhoV ? -1 : 1);
        },
        { passive: false }
    );

    let toqueY = null;
    palco.addEventListener(
        "touchstart",
        (e) => {
            toqueY = e.touches[0].clientY;
        },
        { passive: true }
    );
    palco.addEventListener(
        "touchmove",
        (e) => {
            if (toqueY === null) return;
            const y = e.touches[0].clientY;
            ajusteLocal += (toqueY - y) * (estado.espelhoV ? -1 : 1);
            toqueY = y;
        },
        { passive: true }
    );
    palco.addEventListener("touchend", () => {
        toqueY = null;
    });

    // Mantem a tela acesa durante a gravacao.
    let travaTela = null;
    async function pedirTrava() {
        try {
            if ("wakeLock" in navigator) travaTela = await navigator.wakeLock.request("screen");
        } catch {
            /* nem todo navegador tem, seguimos sem */
        }
    }
    const aoVoltar = () => {
        if (document.visibilityState === "visible") pedirTrava();
    };
    pedirTrava();
    document.addEventListener("visibilitychange", aoVoltar);

    aplicarAparencia();
    medir();
    desenharSelo();

    return function desmontar() {
        cancelAnimationFrame(raf);
        clearTimeout(remedirAgendado);
        observador.disconnect();
        window.removeEventListener("resize", remedir);
        window.removeEventListener("orientationchange", remedir);
        window.visualViewport?.removeEventListener("resize", remedir);
        document.removeEventListener("visibilitychange", aoVoltar);
        travaTela?.release?.();
        sync.fechar();
    };
}
