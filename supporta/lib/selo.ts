import { semLenis } from "./sem-lenis";
import { site } from "@/lib/site";

export type Dono = { nome: string; cnpj?: string | null };

const esc = (t: string) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** 40283248000121 > 40.283.248/0001-21. Qualquer outra coisa (CPF, vazio) não aparece. */
export function formatarCnpj(v?: string | null) {
  const d = (v ?? "").replace(/\D/g, "");
  return d.length === 14 ? `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}` : null;
}

/**
 * Rodapé igual em todo site que sai daqui: o copyright do DONO do site (com o CNPJ dele, se tiver)
 * e, centralizado embaixo, o Selo de Qualidade da Supporta. Sem dono (vitrine), vale a Supporta.
 */
export function rodapeSupporta(dono?: Dono): string {
  const ano = new Date().getFullYear();
  const nome = dono?.nome ?? site.razaoSocial;
  const cnpj = dono ? formatarCnpj(dono.cnpj) : site.cnpj;
  const legal = `Copyright © ${ano} ${esc(nome)}. Todos os direitos reservados.${cnpj ? ` CNPJ nº ${cnpj}` : ""}`;
  return `<footer class="rodape-agencia" data-secao="selo-supporta">
  <div class="ra-wrap">
    <p class="ra-legal">${legal}</p>
    <a href="https://supporta.com.br/?origem=selo" target="_blank" rel="noopener" aria-label="Selo de qualidade Supporta"><img src="https://supporta.com.br/selo/selo-supporta.webp" alt="Selo de qualidade Supporta" width="140" height="56" loading="lazy"></a>
  </div>
  <style>
    .rodape-agencia{background:#fff;border-top:1px solid #0000000f;padding:24px}
    .ra-wrap{max-width:1200px;margin:0 auto;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center}
    .ra-legal{margin:0;font:400 12px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#8a8f98;letter-spacing:.01em}
    .rodape-agencia img{width:140px;height:auto;display:block}
  </style>
</footer>`;
}

/**
 * Troca qualquer rodapé de agência antigo e o crédito "Site feito com Supporta" pelo rodapé com o selo.
 * Também tira o Lenis (rolagem suave): nos sites já gerados ele só roda se a biblioteca carregar, e no celular a rolagem fica esquisita.
 */
export function comSelo(html: string, dono?: Dono): string {
  const limpo = semLenis(html)
    .replace(/<footer class="rodape-agencia"[\s\S]*?<\/footer>\s*/gi, "")
    .replace(/<p data-secao="credito-supporta"[\s\S]*?<\/p>\s*/gi, "");
  const rodape = rodapeSupporta(dono);
  return /<\/body>/i.test(limpo) ? limpo.replace(/<\/body>/i, `${rodape}\n</body>`) : `${limpo}\n${rodape}`;
}

/** Dono a partir do site gravado: nome da empresa e o CNPJ informado no pagamento (CPF não aparece). */
export function donoDoSite(s: { empresa: string; respostas: Record<string, unknown> }): Dono {
  return { nome: s.empresa, cnpj: typeof s.respostas?.cnpj === "string" ? s.respostas.cnpj : null };
}
