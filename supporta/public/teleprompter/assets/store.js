/**
 * Armazenamento dos roteiros no proprio navegador.
 *
 * Os textos nunca saem do aparelho: vao direto para a tela de leitura pelo
 * canal de tempo real. Nada e gravado em servidor.
 */
import { estadoInicial } from "./sync.js";

const CHAVE = "promptersync:roteiros:v1";

function ler() {
    try {
        const bruto = localStorage.getItem(CHAVE);
        const lista = bruto ? JSON.parse(bruto) : [];
        return Array.isArray(lista) ? lista : [];
    } catch {
        return [];
    }
}

function gravar(lista) {
    try {
        localStorage.setItem(CHAVE, JSON.stringify(lista));
        return true;
    } catch {
        return false; // cota cheia ou modo privativo
    }
}

export function novoId() {
    // `crypto` so existe em contexto seguro (HTTPS ou localhost). Sem o
    // fallback, abrir o site em HTTP quebraria na criacao do primeiro roteiro.
    if (globalThis.crypto?.getRandomValues) {
        const a = new Uint8Array(8);
        crypto.getRandomValues(a);
        return Array.from(a, (b) => b.toString(36).padStart(2, "0")).join("").slice(0, 10);
    }
    return (Math.random().toString(36) + Math.random().toString(36)).replace(/0\./g, "").slice(0, 10);
}

export function listar() {
    return ler().sort((a, b) => (b.alteradoEm || 0) - (a.alteradoEm || 0));
}

export function obter(id) {
    return ler().find((r) => r.id === id) || null;
}

export function criar(titulo) {
    const roteiro = {
        id: novoId(),
        criadoEm: Date.now(),
        alteradoEm: Date.now(),
        ...estadoInicial({ titulo: titulo || "Sem titulo" }),
    };
    const lista = ler();
    lista.push(roteiro);
    gravar(lista);
    return roteiro;
}

export function salvar(roteiro) {
    const lista = ler();
    const i = lista.findIndex((r) => r.id === roteiro.id);
    const atualizado = { ...roteiro, alteradoEm: Date.now() };
    if (i >= 0) lista[i] = atualizado;
    else lista.push(atualizado);
    return gravar(lista) ? atualizado : null;
}

export function remover(id) {
    gravar(ler().filter((r) => r.id !== id));
}

/** Estimativa de duracao da fala, em segundos (ritmo padrao de locucao). */
export function duracaoFalada(texto, palavrasPorMinuto = 145) {
    const palavras = texto.trim() ? texto.trim().split(/\s+/).length : 0;
    return Math.round((palavras / palavrasPorMinuto) * 60);
}

export function formatarDuracao(segundos) {
    const m = Math.floor(segundos / 60);
    const s = segundos % 60;
    return m > 0 ? `${m} min ${String(s).padStart(2, "0")} s` : `${s} s`;
}
