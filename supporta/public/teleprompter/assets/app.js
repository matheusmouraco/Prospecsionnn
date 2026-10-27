/**
 * Roteador e tela inicial.
 *
 * Usa rotas por hash (#/...) de proposito: assim o app funciona em qualquer
 * hospedagem estatica, sem precisar configurar regras de reescrita no servidor.
 */
import { icone } from "./icons.js";
import * as loja from "./store.js";
import { montarPainel } from "./painel.js";
import { montarLeitura } from "./leitura.js";

const raiz = document.getElementById("app");
let desmontarAtual = null;

function rota() {
    const h = location.hash.replace(/^#/, "");
    const partes = h.split("/").filter(Boolean);
    if (partes[0] === "c" && partes[1]) return { tela: "painel", id: partes[1] };
    if (partes[0] === "p" && partes[1]) return { tela: "leitura", id: partes[1] };
    return { tela: "inicio" };
}

function navegar() {
    if (desmontarAtual) {
        try {
            desmontarAtual();
        } catch {
            /* segue */
        }
        desmontarAtual = null;
    }
    const { tela, id } = rota();
    document.body.dataset.tela = tela;

    if (tela === "painel") {
        document.title = "Painel de controle | PrompterSync";
        desmontarAtual = montarPainel(raiz, id);
    } else if (tela === "leitura") {
        document.title = "Teleprompter";
        desmontarAtual = montarLeitura(raiz, id);
    } else {
        document.title = "PrompterSync";
        desmontarAtual = montarInicio(raiz);
    }
}

// ------------------------------------------------------------------- inicio

/**
 * Sem HTTPS o navegador bloqueia recursos que este app usa: manter a tela
 * acesa durante a gravacao e copiar o link. Melhor dizer isso na cara do que
 * deixar a pessoa achando que o app esta com defeito.
 */
function avisoDeConexao() {
    if (window.isSecureContext) return "";
    return `<div class="aviso" style="margin-bottom:22px">
      ${icone("warning-circle", 18)}
      <span>Este site foi aberto sem HTTPS. A tela do celular vai apagar sozinha
      durante a gravacao e o botao de copiar link nao funciona. Ative o SSL
      gratuito no painel da hospedagem e acesse pelo endereco com https.</span>
    </div>`;
}

function montarInicio(raiz) {
    function desenhar() {
        const roteiros = loja.listar();

        raiz.innerHTML = `
    <div class="envelope">
      <div class="topo">
        <span class="marca"><span class="glifo">${icone("monitor-play", 18)}</span> PrompterSync</span>
      </div>

      ${avisoDeConexao()}

      <div class="abertura">
        <h1>Seus roteiros</h1>
        <p>Escreva no computador, leia no celular. As duas telas ficam sincronizadas
           mesmo com a internet lenta, porque a rolagem e calculada nos dois lados
           em vez de ser transmitida.</p>
      </div>

      <div class="barra-secao">
        <h2>Roteiros</h2>
        <span class="crescer"></span>
        <button class="btn btn-principal" id="novo">${icone("plus", 18)} Novo roteiro</button>
      </div>

      ${
          roteiros.length === 0
              ? `<div class="vazio">
               <p>Nenhum roteiro ainda.</p>
               <button class="btn btn-principal" id="novo-vazio">${icone("plus", 18)} Criar o primeiro</button>
             </div>`
              : `<div class="grade-roteiros">${roteiros.map(cartao).join("")}</div>`
      }
    </div>

    <dialog id="dlg">
      <h2>Novo roteiro</h2>
      <input class="campo" id="dlg-titulo" placeholder="Nome do roteiro, por exemplo: Episodio 12" />
      <div class="dialogo-acoes">
        <button class="btn" id="dlg-cancelar">Cancelar</button>
        <button class="btn btn-principal" id="dlg-criar">Criar</button>
      </div>
    </dialog>`;

        const dlg = raiz.querySelector("#dlg");
        const campo = raiz.querySelector("#dlg-titulo");

        const abrir = () => {
            campo.value = "";
            dlg.showModal();
            campo.focus();
        };
        raiz.querySelector("#novo")?.addEventListener("click", abrir);
        raiz.querySelector("#novo-vazio")?.addEventListener("click", abrir);
        raiz.querySelector("#dlg-cancelar").addEventListener("click", () => dlg.close());

        const criar = () => {
            const titulo = campo.value.trim();
            if (!titulo) return campo.focus();
            const novo = loja.criar(titulo);
            dlg.close();
            location.hash = `#/c/${novo.id}`;
        };
        raiz.querySelector("#dlg-criar").addEventListener("click", criar);
        campo.addEventListener("keydown", (e) => {
            if (e.key === "Enter") criar();
        });

        raiz.querySelectorAll("[data-apagar]").forEach((b) => {
            b.addEventListener("click", () => {
                const alvo = b.getAttribute("data-apagar");
                const r = loja.obter(alvo);
                if (!r) return;
                if (confirm(`Apagar o roteiro "${r.titulo}"? Isso nao pode ser desfeito.`)) {
                    loja.remover(alvo);
                    desenhar();
                }
            });
        });
    }

    function cartao(r) {
        const seg = loja.duracaoFalada(r.texto);
        return `
    <div class="cartao">
      <h3>${escapar(r.titulo)}</h3>
      <div class="meta">
        <span>${r.texto.trim() ? loja.formatarDuracao(seg) : "vazio"}</span>
        <span>${r.texto.length} caracteres</span>
      </div>
      <div class="acoes">
        <a class="btn btn-principal" href="#/c/${r.id}">${icone("pencil-simple", 17)} Abrir painel</a>
        <a class="btn" href="#/p/${r.id}" target="_blank" rel="noopener" title="Abrir a tela de leitura">${icone("monitor-play", 17)}</a>
        <span class="crescer"></span>
        <button class="btn btn-icone btn-perigo" data-apagar="${r.id}" title="Apagar roteiro">${icone("trash", 17)}</button>
      </div>
    </div>`;
    }

    desenhar();
    return () => {};
}

function escapar(s) {
    const d = document.createElement("div");
    d.textContent = s ?? "";
    return d.innerHTML;
}

window.addEventListener("hashchange", navegar);
navegar();
