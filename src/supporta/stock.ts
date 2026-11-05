import { createRequire } from 'node:module';
import type { Respostas } from './db.js';

// Banco de imagens da v1: fotos do Unsplash já conferidas, com descrição, para a IA nunca inventar um link que quebra.
const require = createRequire(import.meta.url);
const CATALOGO = require('./stock-catalog.json') as Record<string, { id: string; alt: string }[]>;

const POR_RAMO: Record<string, string[]> = {
  odontologia: ['odontologia', 'clinica-medica'],
  saude: ['clinica-medica', 'odontologia'],
  psicologia: ['clinica-medica', 'coworking'],
  estetica: ['clinica-medica', 'floricultura'],
  academia: ['academia', 'academia-fitness'],
  advocacia: ['contabilidade', 'contador', 'coworking'],
  contabilidade: ['contador', 'contabilidade', 'coworking'],
  arquitetura: ['arquitetura', 'arquitetura-autoral', 'construtora-premium'],
  construcao: ['construcao', 'construtora-premium'],
  restaurante: ['restaurante', 'cafeteria', 'cervejaria'],
  comercio: ['floricultura', 'grafica', 'cafeteria'],
  servicos: ['assistencia-tecnica', 'construcao', 'coworking'],
  tecnologia: ['coworking', 'estudio-design', 'assistencia-tecnica'],
  educacao: ['coworking', 'eventos', 'estudio-design'],
  pet: ['veterinaria', 'hotel-pet'],
};
const GERAL = ['coworking', 'estudio-design', 'eventos'];
const MAXIMO = 24;

export interface FotoBanco { url: string; descricao: string }
export const urlDaFoto = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

/** Fotos do ramo, sempre as mesmas para o mesmo site: a home e as páginas internas usam a mesma lista. */
export function fotosDoBanco(r: Pick<Respostas, 'ramo'>, semente: string): FotoBanco[] {
  const vistas = new Set<string>();
  const fotos = (POR_RAMO[r.ramo] ?? GERAL).flatMap((modelo) => CATALOGO[modelo] ?? []).filter((f) => !vistas.has(f.id) && vistas.add(f.id));
  // Embaralha pela semente, para dois clientes do mesmo ramo não receberem as mesmas fotos na mesma ordem.
  let h = [...semente].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  for (let i = fotos.length - 1; i > 0; i--) {
    h = (h * 1664525 + 1013904223) >>> 0;
    const j = h % (i + 1);
    [fotos[i], fotos[j]] = [fotos[j]!, fotos[i]!];
  }
  return fotos.slice(0, MAXIMO).map((f) => ({ url: urlDaFoto(f.id), descricao: f.alt }));
}
