import { site } from "@/lib/site";

/**
 * Rodapé com o Selo de Qualidade da Supporta, igual em todo site que sai daqui
 * (vitrine, prévia e site publicado). Troca qualquer rodapé de agência antigo (Matilab).
 */
export function rodapeSupporta(): string {
  const ano = new Date().getFullYear();
  const legal = `Copyright © ${ano} ${site.razaoSocial}. Todos os direitos reservados. CNPJ nº ${site.cnpj}`;
  return `<footer class="rodape-agencia" data-secao="selo-supporta">
  <div class="ra-wrap">
    <p class="ra-legal">${legal}</p>
    <a href="https://supporta.com.br/?origem=selo" target="_blank" rel="noopener"><img src="https://supporta.com.br/selo/selo-supporta.webp" alt="Selo de qualidade Supporta" width="140" height="56" loading="lazy"></a>
  </div>
  <style>
    .rodape-agencia{background:#fff;border-top:1px solid #0000000f;padding:22px 24px}
    .ra-wrap{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:20px}
    .ra-legal{margin:0;font:400 12px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#8a8f98;letter-spacing:.01em}
    .rodape-agencia img{width:140px;height:auto;display:block;flex-shrink:0}
    @media (max-width:640px){.ra-wrap{flex-direction:column-reverse;text-align:center;gap:14px}}
  </style>
</footer>`;
}

export function comSelo(html: string): string {
  const limpo = html.replace(/<footer class="rodape-agencia"[\s\S]*?<\/footer>\s*/gi, "");
  return /<\/body>/i.test(limpo) ? limpo.replace(/<\/body>/i, `${rodapeSupporta()}\n</body>`) : `${limpo}\n${rodapeSupporta()}`;
}
