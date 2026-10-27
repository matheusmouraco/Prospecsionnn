/**
 * Painel de controle (o que fica no computador do operador).
 *
 * E a fonte de verdade da sessao: guarda o roteiro, aplica os comandos e
 * publica o estado. A tela de leitura so reflete.
 */
import { Sync, posicaoEm, reancorar } from "./sync.js";
import { SUPABASE_URL, SUPABASE_KEY } from "./config.js";
import { icone } from "./icons.js";
import { qrSVG } from "./qr.js";
import * as loja from "./store.js";
import * as perfis from "./perfis.js";

const PASSO_PULO = 320; // pixels por toque nos botoes de avancar/voltar
const ESPELHO_ALTURA_MAX = 400; // altura maxima do espelho dentro do painel

export function montarPainel(raiz, id) {
    const roteiro = loja.obter(id);
    if (!roteiro) {
        raiz.innerHTML = `<div class="envelope"><div class="vazio">
      <p>Este roteiro nao existe mais neste navegador.</p>
      <a class="btn btn-principal" href="#/">Voltar para a lista</a></div></div>`;
        return () => {};
    }

    let estado = { ...roteiro };
    const enderecoLeitura = `${location.origin}${location.pathname}#/p/${id}`;

    // Tamanho da tela do apresentador. Ate ele conectar, usamos um celular
    // tipico para o espelho ja ter algo plausivel para mostrar.
    let telaLeitura = { largura: 390, altura: 844, estimada: true };

    raiz.innerHTML = `
  <div class="envelope">
    <div class="topo">
      <a class="btn btn-fantasma btn-icone" href="#/" title="Voltar">${icone("arrow-left", 20)}</a>
      <div class="crescer">
        <input class="campo" id="titulo" value="" style="border-color:transparent;background:transparent;padding-left:0;font-size:19px;font-weight:600;height:32px" />
        <div style="font-size:12.5px;color:var(--texto-3);padding-left:1px" id="resumo"></div>
      </div>
      <a class="btn" href="${enderecoLeitura}" target="_blank" rel="noopener">
        ${icone("monitor-play", 18)} Abrir teleprompter
      </a>
    </div>

    <div class="painel">
      <div>
        <div class="bloco">
          <div class="rotulo">
            <span>Roteiro</span>
            <span id="contagem"></span>
          </div>
          <textarea class="editor" id="texto" placeholder="Cole ou escreva o texto aqui. Ele aparece na tela de leitura enquanto voce digita."></textarea>
        </div>

        <div class="bloco" style="margin-top:18px">
          <div class="transporte">
            <button class="tecla" id="inicio" title="Voltar ao inicio">${icone("rewind", 22)}</button>
            <button class="tecla" id="voltar" title="Voltar um trecho">${icone("caret-double-up", 22)}</button>
            <button class="tecla tecla-mestra" id="tocar" data-tocando="0" title="Reproduzir ou pausar (barra de espaco)"></button>
            <button class="tecla" id="avancar" title="Avancar um trecho">${icone("caret-double-down", 22)}</button>
          </div>

          <div class="controle">
            <div class="cabeca"><span>Velocidade</span><span class="valor" id="v-velocidade"></span></div>
            <input type="range" id="velocidade" min="20" max="400" step="5" />
          </div>
          <div class="controle" style="margin-bottom:6px">
            <div class="cabeca"><span>Leitura do apresentador</span><span class="valor" id="v-progresso">0%</span></div>
            <div class="trilha"><span id="progresso"></span></div>
          </div>
        </div>

        <div class="bloco" style="margin-top:18px">
          <div class="rotulo"><span>Aparencia da leitura</span></div>
          <div class="controle">
            <div class="cabeca"><span>Tamanho da letra</span><span class="valor" id="v-fonte"></span></div>
            <input type="range" id="fonte" min="28" max="140" step="2" />
          </div>
          <div class="controle">
            <div class="cabeca"><span>Espaco entre linhas</span><span class="valor" id="v-entrelinha"></span></div>
            <input type="range" id="entrelinha" min="1.1" max="2.4" step="0.1" />
          </div>
          <div class="controle" style="margin-bottom:8px">
            <div class="cabeca"><span>Margem lateral</span><span class="valor" id="v-margem"></span></div>
            <input type="range" id="margem" min="0" max="30" step="1" />
          </div>

          <div class="opcao">
            <span class="nome">${icone("text-align-center", 18)} Centralizar o texto</span>
            <button class="chave" id="centralizado" role="switch" aria-checked="false" aria-label="Centralizar o texto"></button>
          </div>
          <div class="opcao">
            <span class="nome">${icone("eye", 18)} Linha guia de leitura</span>
            <button class="chave" id="guia" role="switch" aria-checked="false" aria-label="Linha guia de leitura"></button>
          </div>
          <div class="opcao">
            <span class="nome">${icone("flip-horizontal", 18)} Espelhar na horizontal</span>
            <button class="chave" id="espelhoH" role="switch" aria-checked="false" aria-label="Espelhar na horizontal"></button>
          </div>
          <div class="opcao">
            <span class="nome">${icone("flip-vertical", 18)} Espelhar na vertical</span>
            <button class="chave" id="espelhoV" role="switch" aria-checked="false" aria-label="Espelhar na vertical"></button>
          </div>
        </div>
      </div>

      <div>
        <div class="bloco">
          <div class="rotulo">
            <span>O que ele esta vendo</span>
            <span id="espelho-info"></span>
          </div>
          <div class="espelho-caixa" id="espelho-caixa">
            <div class="espelho-tela" id="espelho-tela">
              <div class="espelho-guia" id="espelho-guia"></div>
              <div class="espelho-fita" id="espelho-fita"></div>
            </div>
          </div>
        </div>

        <div class="bloco" style="margin-top:18px">
          <div class="rotulo">
            <span>Perfis de leitura</span>
            <button class="btn btn-fantasma" id="salvar-perfil" style="height:30px;padding:0 10px;font-size:13px">
              ${icone("plus", 15)} Salvar atual
            </button>
          </div>
          <div id="lista-perfis"></div>
        </div>

        <div class="bloco" style="margin-top:18px">
          <div class="rotulo"><span>Tela de leitura</span></div>
          <div class="conexao" id="conexao"></div>
          <div class="endereco" style="margin-top:12px">
            <code id="endereco">${enderecoLeitura}</code>
            <button class="btn btn-icone" id="copiar" title="Copiar endereco">${icone("copy", 18)}</button>
          </div>
          <div class="qr" id="qr"></div>
          <p style="font-size:12.5px;color:var(--texto-3);text-align:center;margin:12px 0 0">
            Aponte a camera do celular para abrir a tela de leitura.
          </p>
        </div>
      </div>
    </div>
  </div>

  <dialog id="dlg-perfil">
    <h2 id="dlg-perfil-titulo">Salvar perfil</h2>
    <input class="campo" id="dlg-perfil-nome" placeholder="Nome, por exemplo: Carla, leitura rapida" />
    <p style="font-size:12.5px;color:var(--texto-3);margin:10px 0 0" id="dlg-perfil-resumo"></p>
    <div class="dialogo-acoes">
      <button class="btn" id="dlg-perfil-cancelar">Cancelar</button>
      <button class="btn btn-principal" id="dlg-perfil-ok">Salvar</button>
    </div>
  </dialog>`;

    const $ = (s) => raiz.querySelector(s);
    const elTitulo = $("#titulo");
    const elTexto = $("#texto");
    const elTocar = $("#tocar");
    const elConexao = $("#conexao");
    const elProgresso = $("#progresso");
    const elVProgresso = $("#v-progresso");

    // --------------------------------------------------------------- conexao

    const sync = new Sync({
        sala: id,
        papel: "controle",
        url: SUPABASE_URL,
        chave: SUPABASE_KEY,
        aoReceber: (recebido, origem) => {
            // Alguem entrou na sala: manda o estado completo para sincronizar.
            if (origem === "pedido-de-estado") publicar();
        },
        // Toque na tela do celular pede play/pause; a decisao acontece aqui.
        aoComando: (acao) => {
            if (acao === "alternar") alternarReproducao();
        },
        // A tela de leitura informou seu tamanho real.
        aoMedirTela: (medidas) => {
            if (!medidas?.largura || !medidas?.altura) return;
            telaLeitura = { ...medidas, estimada: false };
            ajustarEspelho();
        },
        aoMudarStatus: desenharConexao,
    });

    function publicar() {
        sync.publicarEstado(estado);
    }

    /** Altera o estado, salva no navegador e avisa a tela de leitura. */
    function mudar(campos, { reancora = false } = {}) {
        if (reancora) reancorar(estado, sync.agora());
        Object.assign(estado, campos);
        publicar();
        agendarSalvamento();
        ajustarEspelho();
        desenharPerfis();
    }

    let salvarTimer = null;
    function agendarSalvamento() {
        clearTimeout(salvarTimer);
        salvarTimer = setTimeout(() => loja.salvar(estado), 400);
    }

    // ------------------------------------------------------------ transporte

    function alternarReproducao() {
        // Reancora antes de inverter, para nao dar salto na posicao.
        reancorar(estado, sync.agora());
        estado.tocando = !estado.tocando;
        publicar();
        agendarSalvamento();
        desenharTransporte();
    }

    function pular(px) {
        const t = sync.agora();
        const destino = Math.max(0, posicaoEm(estado, t) + px);
        reancorar(estado, t, destino);
        publicar();
    }

    function voltarAoInicio() {
        reancorar(estado, sync.agora(), 0);
        publicar();
    }

    $("#tocar").addEventListener("click", alternarReproducao);
    $("#avancar").addEventListener("click", () => pular(PASSO_PULO));
    $("#voltar").addEventListener("click", () => pular(-PASSO_PULO));
    $("#inicio").addEventListener("click", voltarAoInicio);

    // ---------------------------------------------------------------- campos

    elTitulo.addEventListener("input", () => {
        estado.titulo = elTitulo.value;
        agendarSalvamento();
    });

    elTexto.addEventListener("input", () => {
        estado.texto = elTexto.value;
        desenharResumo();
        publicar();
        agendarSalvamento();
        ajustarEspelho();
    });

    function ligarDeslizante(campo, formatar, reancora = false) {
        const el = $(`#${campo}`);
        const rotulo = $(`#v-${campo}`);
        el.addEventListener("input", () => {
            const valor = parseFloat(el.value);
            rotulo.textContent = formatar(valor);
            // Velocidade precisa reancorar: a formula muda a partir de agora,
            // senao o texto salta para tras ou para frente.
            mudar({ [campo]: valor }, { reancora });
        });
    }

    ligarDeslizante("velocidade", (v) => `${v} px/s`, true);
    ligarDeslizante("fonte", (v) => `${v} px`);
    ligarDeslizante("entrelinha", (v) => v.toFixed(1));
    ligarDeslizante("margem", (v) => `${v}%`);

    function ligarChave(campo) {
        const el = $(`#${campo}`);
        el.addEventListener("click", () => {
            const novo = el.getAttribute("aria-checked") !== "true";
            el.setAttribute("aria-checked", String(novo));
            mudar({ [campo]: novo });
        });
    }
    ["centralizado", "guia", "espelhoH", "espelhoV"].forEach(ligarChave);

    $("#copiar").addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(enderecoLeitura);
            const b = $("#copiar");
            b.innerHTML = icone("check", 18);
            setTimeout(() => (b.innerHTML = icone("copy", 18)), 1400);
        } catch {
            /* alguns navegadores bloqueiam sem gesto direto */
        }
    });

    // Barra de espaco controla o play, exceto enquanto escreve o roteiro.
    function aoTeclar(e) {
        const escrevendo = e.target === elTexto || e.target === elTitulo || e.target.tagName === "INPUT";
        if (escrevendo) return;
        if (e.code === "Space") {
            e.preventDefault();
            alternarReproducao();
        } else if (e.code === "ArrowDown") {
            e.preventDefault();
            pular(PASSO_PULO / 2);
        } else if (e.code === "ArrowUp") {
            e.preventDefault();
            pular(-PASSO_PULO / 2);
        } else if (e.code === "Home") {
            e.preventDefault();
            voltarAoInicio();
        }
    }
    window.addEventListener("keydown", aoTeclar);

    // ------------------------------------------------------------- perfis

    const dlgPerfil = $("#dlg-perfil");
    let perfilEmEdicao = null; // id quando estiver regravando

    function abrirDialogoPerfil(idExistente = null) {
        perfilEmEdicao = idExistente;
        const p = idExistente ? perfis.obter(idExistente) : null;
        $("#dlg-perfil-titulo").textContent = p ? "Regravar perfil" : "Salvar perfil";
        $("#dlg-perfil-nome").value = p ? p.nome : "";
        $("#dlg-perfil-resumo").textContent = resumoDosAjustes(estado);
        $("#dlg-perfil-ok").textContent = p ? "Regravar" : "Salvar";
        dlgPerfil.showModal();
        $("#dlg-perfil-nome").focus();
    }

    function resumoDosAjustes(e) {
        const partes = [`${e.velocidade} px/s`, `letra ${e.fonte} px`, `entrelinha ${e.entrelinha.toFixed(1)}`];
        if (e.centralizado) partes.push("centralizado");
        if (e.espelhoH) partes.push("espelho horizontal");
        if (e.espelhoV) partes.push("espelho vertical");
        return partes.join(", ");
    }

    $("#salvar-perfil").addEventListener("click", () => abrirDialogoPerfil());
    $("#dlg-perfil-cancelar").addEventListener("click", () => dlgPerfil.close());

    function confirmarPerfil() {
        const nome = $("#dlg-perfil-nome").value.trim();
        if (!nome) return $("#dlg-perfil-nome").focus();
        if (perfilEmEdicao) {
            perfis.renomear(perfilEmEdicao, nome);
            perfis.atualizarDoEstado(perfilEmEdicao, estado);
        } else {
            perfis.criarDoEstado(nome, estado);
        }
        dlgPerfil.close();
        desenharPerfis();
    }
    $("#dlg-perfil-ok").addEventListener("click", confirmarPerfil);
    $("#dlg-perfil-nome").addEventListener("keydown", (e) => {
        if (e.key === "Enter") confirmarPerfil();
    });

    function aplicarPerfil(idPerfil) {
        const p = perfis.obter(idPerfil);
        if (!p) return;
        // Reancora porque a velocidade pode mudar: sem isso o texto saltaria.
        mudar(perfis.ajustesDe(p), { reancora: true });
        desenharValores();
    }

    function desenharPerfis() {
        const lista = perfis.listar();
        const alvo = $("#lista-perfis");
        if (!alvo) return;

        if (lista.length === 0) {
            alvo.innerHTML = `<p style="color:var(--texto-3);font-size:13.5px;margin:2px 0 0">
        Ajuste a velocidade e a letra do jeito que este apresentador le, depois
        salve como perfil. Da proxima vez e um clique.</p>`;
            return;
        }

        alvo.innerHTML = `<div class="perfis">${lista
            .map((p) => {
                const ativo = perfis.combina(p, estado);
                return `<div class="perfil ${ativo ? "perfil-ativo" : ""}">
          <button class="perfil-aplicar" data-aplicar="${p.id}" title="Aplicar este perfil">
            <span class="perfil-nome">${escapar(p.nome)}${ativo ? ` ${icone("check", 14)}` : ""}</span>
            <span class="perfil-meta">${p.velocidade} px/s, letra ${p.fonte} px</span>
          </button>
          <button class="btn btn-icone btn-fantasma" data-regravar="${p.id}" title="Regravar com os ajustes atuais">${icone("pencil-simple", 15)}</button>
          <button class="btn btn-icone btn-fantasma btn-perigo" data-apagar-perfil="${p.id}" title="Apagar perfil">${icone("trash", 15)}</button>
        </div>`;
            })
            .join("")}</div>`;

        alvo.querySelectorAll("[data-aplicar]").forEach((b) =>
            b.addEventListener("click", () => aplicarPerfil(b.getAttribute("data-aplicar")))
        );
        alvo.querySelectorAll("[data-regravar]").forEach((b) =>
            b.addEventListener("click", () => abrirDialogoPerfil(b.getAttribute("data-regravar")))
        );
        alvo.querySelectorAll("[data-apagar-perfil]").forEach((b) =>
            b.addEventListener("click", () => {
                const alvoId = b.getAttribute("data-apagar-perfil");
                const p = perfis.obter(alvoId);
                if (p && confirm(`Apagar o perfil "${p.nome}"?`)) {
                    perfis.remover(alvoId);
                    desenharPerfis();
                }
            })
        );
    }

    // ------------------------------------------------------------- espelho

    const espCaixa = $("#espelho-caixa");
    const espTela = $("#espelho-tela");
    const espFita = $("#espelho-fita");
    const espGuia = $("#espelho-guia");

    /**
     * Reproduz a tela do apresentador em tamanho real e depois encolhe tudo
     * com um scale. Renderizar no tamanho real e o unico jeito de as linhas
     * quebrarem exatamente nos mesmos pontos que na tela dele.
     *
     * O espelhamento NAO e aplicado aqui de proposito: espelhar serve para o
     * vidro do teleprompter reverter a imagem, entao o que a pessoa de fato
     * le e o texto normal. E isso que o operador precisa acompanhar.
     */
    function ajustarEspelho() {
        // Mede a propria caixa, nao o bloco pai: o bloco inclui o padding
        // interno, e usar essa largura maior fazia telas em formato paisagem
        // transbordarem para fora do quadro. O laco de realimentacao do
        // ResizeObserver e evitado la embaixo, comparando a largura.
        const larguraDisponivel = espCaixa.clientWidth || Math.round(espCaixa.getBoundingClientRect().width);
        const { largura, altura } = telaLeitura;
        if (!larguraDisponivel || !largura || !altura) return; // sem layout ainda

        espTela.style.width = `${largura}px`;
        espTela.style.height = `${altura}px`;

        const escala = Math.min(larguraDisponivel / largura, ESPELHO_ALTURA_MAX / altura);
        espTela.style.transform = `scale(${escala})`;
        espCaixa.style.height = `${Math.round(altura * escala)}px`;

        espFita.style.fontFamily = "var(--fonte-leitura)";
        espFita.style.fontSize = `${estado.fonte}px`;
        espFita.style.lineHeight = String(estado.entrelinha);
        espFita.style.textAlign = estado.centralizado ? "center" : "left";
        espFita.style.paddingLeft = `${estado.margem}%`;
        espFita.style.paddingRight = `${estado.margem}%`;
        espFita.style.paddingTop = `${Math.round(altura * 0.38)}px`;
        espFita.style.paddingBottom = `${Math.round(altura * 0.72)}px`;
        if (espFita.textContent !== estado.texto) {
            espFita.textContent = estado.texto || "Sem texto no roteiro.";
        }

        espGuia.hidden = !estado.guia;
        espGuia.style.top = "38%";

        $("#espelho-info").textContent = telaLeitura.estimada
            ? "tamanho estimado"
            : `${largura} x ${altura}`;
    }

    // Desenha o espelho no mesmo ritmo da tela de leitura, usando a mesma
    // formula. Nao depende de receber nada pela rede.
    let rafEspelho;
    let pintadoEspelho = null;
    function quadroEspelho() {
        rafEspelho = requestAnimationFrame(quadroEspelho);
        const y = Math.max(0, posicaoEm(estado, sync.agora()));
        const arred = Math.round(y * 100) / 100;
        if (arred !== pintadoEspelho) {
            pintadoEspelho = arred;
            espFita.style.transform = `translate3d(0, ${-arred}px, 0)`;
        }
    }
    rafEspelho = requestAnimationFrame(quadroEspelho);

    // Observa o bloco pai (que este codigo nao altera) e so reage quando a
    // largura muda de fato, para nao realimentar o observador.
    let ultimaLargura = 0;
    const observadorCaixa = new ResizeObserver((entradas) => {
        const l = Math.round(entradas[0]?.contentRect?.width || 0);
        if (l === ultimaLargura) return;
        ultimaLargura = l;
        ajustarEspelho();
    });
    if (espCaixa.parentElement) observadorCaixa.observe(espCaixa.parentElement);

    // A fonte do roteiro muda as medidas ao terminar de carregar.
    document.fonts?.ready?.then(() => ajustarEspelho());

    // ---------------------------------------------------------------- desenho

    function desenharTransporte() {
        elTocar.dataset.tocando = estado.tocando ? "1" : "0";
        elTocar.innerHTML = estado.tocando ? icone("pause", 30) : icone("play", 30);
    }

    function desenharConexao(info = {}) {
        const pares = info.pares ?? 0;
        let estadoPisca = "erro";
        let texto = "Conectando ao canal";
        if (info.conectado && pares > 0) {
            estadoPisca = "ativo";
            texto = pares === 1 ? "Tela de leitura conectada" : `${pares} telas de leitura conectadas`;
        } else if (info.conectado) {
            estadoPisca = "ligado";
            texto = "Pronto, abra o link no celular";
        }
        elConexao.innerHTML = `<span class="pisca" data-estado="${estadoPisca}"></span>${texto}`;
    }

    function desenharResumo() {
        const seg = loja.duracaoFalada(estado.texto);
        $("#resumo").textContent = `${loja.formatarDuracao(seg)} de fala estimados`;
        $("#contagem").textContent = `${estado.texto.length} caracteres`;
    }

    function desenharValores() {
        elTitulo.value = estado.titulo;
        elTexto.value = estado.texto;
        $("#velocidade").value = estado.velocidade;
        $("#v-velocidade").textContent = `${estado.velocidade} px/s`;
        $("#fonte").value = estado.fonte;
        $("#v-fonte").textContent = `${estado.fonte} px`;
        $("#entrelinha").value = estado.entrelinha;
        $("#v-entrelinha").textContent = estado.entrelinha.toFixed(1);
        $("#margem").value = estado.margem;
        $("#v-margem").textContent = `${estado.margem}%`;
        for (const campo of ["centralizado", "guia", "espelhoH", "espelhoV"]) {
            $(`#${campo}`).setAttribute("aria-checked", String(!!estado[campo]));
        }
        desenharTransporte();
        desenharResumo();
    }

    try {
        $("#qr").innerHTML = qrSVG(enderecoLeitura, 168);
    } catch {
        $("#qr").remove();
    }

    desenharValores();
    desenharPerfis();
    ajustarEspelho();
    desenharConexao({ conectado: false, pares: 0 });

    // Progresso: derivado da mesma formula, agora medindo com a largura real
    // da tela do apresentador (o espelho ja renderiza exatamente isso).
    let ultimoPct = -1;
    const relogioProgresso = setInterval(() => {
        const limite = Math.max(1, espFita.scrollHeight - telaLeitura.altura);
        const pos = posicaoEm(estado, sync.agora());
        const pct = Math.max(0, Math.min(100, (pos / limite) * 100));
        if (Math.abs(pct - ultimoPct) < 0.4) return;
        ultimoPct = pct;
        elProgresso.style.width = `${pct}%`;
        elVProgresso.textContent = `${Math.round(pct)}%`;
    }, 250);

    return function desmontar() {
        clearInterval(relogioProgresso);
        clearTimeout(salvarTimer);
        cancelAnimationFrame(rafEspelho);
        observadorCaixa.disconnect();
        window.removeEventListener("keydown", aoTeclar);
        loja.salvar(estado);
        sync.fechar();
    };
}

function escapar(s) {
    const d = document.createElement("div");
    d.textContent = s ?? "";
    return d.innerHTML;
}
