/**
 * Perfis de leitura.
 *
 * Cada apresentador le de um jeito: mais rapido, letra maior, mais espaco
 * entre linhas. Um perfil guarda esse conjunto de ajustes com um nome para
 * ser aplicado com um clique, sem mexer no roteiro.
 *
 * Perfis sao independentes dos roteiros: o mesmo cliente pode ter varios
 * roteiros, e o mesmo roteiro pode ser lido por pessoas diferentes.
 */

const CHAVE = "promptersync:perfis:v1";

/** Campos que um perfil controla. O texto e o titulo nunca entram aqui. */
export const CAMPOS = [
    "velocidade",
    "fonte",
    "entrelinha",
    "margem",
    "centralizado",
    "guia",
    "espelhoH",
    "espelhoV",
];

function ler() {
    try {
        const lista = JSON.parse(localStorage.getItem(CHAVE) || "[]");
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
        return false;
    }
}

function novoId() {
    if (globalThis.crypto?.getRandomValues) {
        const a = new Uint8Array(6);
        crypto.getRandomValues(a);
        return Array.from(a, (b) => b.toString(36)).join("").slice(0, 8);
    }
    return Math.random().toString(36).slice(2, 10);
}

export function listar() {
    return ler().sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

export function obter(id) {
    return ler().find((p) => p.id === id) || null;
}

/** Cria um perfil a partir do estado atual da sessao. */
export function criarDoEstado(nome, estado) {
    const perfil = { id: novoId(), nome: nome.trim() || "Sem nome", criadoEm: Date.now() };
    for (const campo of CAMPOS) perfil[campo] = estado[campo];
    const lista = ler();
    lista.push(perfil);
    return gravar(lista) ? perfil : null;
}

/** Regrava um perfil existente com os ajustes atuais. */
export function atualizarDoEstado(id, estado) {
    const lista = ler();
    const i = lista.findIndex((p) => p.id === id);
    if (i < 0) return null;
    for (const campo of CAMPOS) lista[i][campo] = estado[campo];
    lista[i].alteradoEm = Date.now();
    return gravar(lista) ? lista[i] : null;
}

export function renomear(id, nome) {
    const lista = ler();
    const p = lista.find((x) => x.id === id);
    if (!p) return null;
    p.nome = nome.trim() || p.nome;
    return gravar(lista) ? p : null;
}

export function remover(id) {
    gravar(ler().filter((p) => p.id !== id));
}

/** Só os campos do perfil, prontos para aplicar na sessao. */
export function ajustesDe(perfil) {
    const ajustes = {};
    for (const campo of CAMPOS) {
        if (perfil[campo] !== undefined) ajustes[campo] = perfil[campo];
    }
    return ajustes;
}

/** Diz se o estado atual corresponde exatamente a um perfil. */
export function combina(perfil, estado) {
    return CAMPOS.every((campo) => perfil[campo] === estado[campo]);
}
