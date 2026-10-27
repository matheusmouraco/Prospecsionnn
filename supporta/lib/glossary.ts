export type Term = { slug: string; term: string; definition: string };

// Definições curtas, em linguagem de dono de negócio. Primeira frase responde direto (AEO).
export const glossary: Term[] = [
  { slug: "aeo", term: "AEO", definition: "Answer Engine Optimization: preparar o conteúdo para virar a resposta direta de uma pergunta, como os trechos em destaque do Google e as respostas por voz." },
  { slug: "core-web-vitals", term: "Core Web Vitals", definition: "Três medidas do Google sobre a experiência no site: quanto demora para o conteúdo principal aparecer (LCP), quanto a página pula enquanto carrega (CLS) e quanto demora para responder a um toque (INP)." },
  { slug: "cls", term: "CLS", definition: "Cumulative Layout Shift: mede quanto os elementos da página mudam de lugar enquanto ela carrega. O bom é ficar abaixo de 0,1." },
  { slug: "dados-estruturados", term: "Dados estruturados", definition: "Informações escritas num formato padrão (schema.org) que robôs entendem sem interpretar o texto: nome da empresa, endereço, horário, serviços, preços e perguntas frequentes." },
  { slug: "dominio", term: "Domínio", definition: "O endereço do site, como suaempresa.com.br. Os domínios .com.br são registrados no Registro.br e renovados todo ano." },
  { slug: "geo", term: "GEO", definition: "Generative Engine Optimization: fazer o site ser usado como fonte por IAs generativas como ChatGPT, Gemini e Perplexity." },
  { slug: "google-meu-negocio", term: "Google Meu Negócio", definition: "O perfil gratuito da empresa no Google (hoje chamado Perfil da Empresa no Google), que aparece no Maps e na busca local com endereço, horário, fotos e avaliações." },
  { slug: "hospedagem", term: "Hospedagem", definition: "O servidor onde os arquivos do site ficam guardados e são entregues a quem visita. Influencia diretamente a velocidade." },
  { slug: "json-ld", term: "JSON-LD", definition: "O formato mais usado para colocar dados estruturados num site. Fica invisível para quem visita e é lido pelo Google e pelas IAs." },
  { slug: "lcp", term: "LCP", definition: "Largest Contentful Paint: o tempo até o maior conteúdo da tela (geralmente o título ou a foto principal) aparecer. O bom é abaixo de 2,5 segundos." },
  { slug: "llms-txt", term: "llms.txt", definition: "Arquivo de texto na raiz do site que resume a empresa e aponta as páginas mais importantes, como um guia de leitura para as IAs." },
  { slug: "meta-description", term: "Meta description", definition: "O resumo da página que aparece abaixo do título nos resultados do Google. O ideal é ter até 155 caracteres e convidar para o clique." },
  { slug: "pagespeed", term: "PageSpeed Insights", definition: "Ferramenta gratuita do Google que dá notas de 0 a 100 para desempenho, acessibilidade, boas práticas e SEO de uma página, no celular e no computador." },
  { slug: "robots-txt", term: "robots.txt", definition: "Arquivo na raiz do site que diz quais robôs podem ler quais páginas. Se bloquear robôs como GPTBot ou ClaudeBot, as IAs não leem o site." },
  { slug: "seo", term: "SEO", definition: "Search Engine Optimization: o conjunto de cuidados que fazem um site aparecer bem posicionado no Google." },
  { slug: "sitemap", term: "Sitemap", definition: "Arquivo (sitemap.xml) com a lista das páginas do site, que ajuda o Google a encontrar e atualizar todas elas." },
  { slug: "ssl", term: "SSL (HTTPS)", definition: "O certificado que cria o cadeado do navegador e criptografa a conexão. Sem ele, o navegador avisa que o site não é seguro." },
];
