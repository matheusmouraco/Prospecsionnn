import type { Check } from "./checks";
import type { PsiResult } from "./psi";

type Rec = { title: string; text: string; weight: number };
export type Recommendation = { title: string; text: string };

/** Monta as 3 recomendações mais importantes a partir do que foi medido. Nada é suposto. */
export function recommendations(psi: PsiResult | null, checks: Check[]): Recommendation[] {
  const failed = new Set(checks.filter((c) => !c.ok).map((c) => c.id));
  const recs: Rec[] = [];

  if (psi && psi.scores.performance < 90) {
    const lcp = psi.lcpSeconds ? ` O conteúdo principal leva ${psi.lcpSeconds.toString().replace(".", ",")}s para aparecer no celular.` : "";
    recs.push({
      title: "Deixar o site mais rápido no celular",
      text: `A nota de desempenho no celular é ${psi.scores.performance}.${lcp} Imagens otimizadas, menos scripts e boa hospedagem resolvem a maior parte.`,
      weight: psi.scores.performance < 50 ? 100 : 70,
    });
  }
  if (failed.has("robots")) recs.push({ title: "Liberar os robôs das IAs", text: "O robots.txt impede ou não orienta robôs como GPTBot e ClaudeBot. Sem ler o site, a IA não tem como indicar você.", weight: 90 });
  if (failed.has("title") || failed.has("description"))
    recs.push({ title: "Corrigir título e descrição", text: "São o que aparece no Google antes do clique. Precisam dizer o que você faz e onde atende, no tamanho certo.", weight: 85 });
  if (failed.has("jsonld")) recs.push({ title: "Adicionar dados estruturados", text: "Com schema.org em JSON-LD, Google e IAs confirmam nome, endereço, horário e serviços sem adivinhar.", weight: 80 });
  if (failed.has("https")) recs.push({ title: "Ativar o HTTPS", text: "Sem o cadeado, o navegador avisa que o site não é seguro e muita gente desiste ali.", weight: 95 });
  if (failed.has("llms")) recs.push({ title: "Publicar um llms.txt", text: "Um resumo oficial da empresa na raiz do site ajuda as IAs a entenderem quem você é e o que oferece.", weight: 60 });
  if (psi && psi.scores.seo < 90) recs.push({ title: "Ajustar o SEO básico", text: `A nota de SEO é ${psi.scores.seo}. Itens como links sem texto e imagens sem descrição atrapalham o Google.`, weight: 65 });
  if (psi && psi.scores.accessibility < 90)
    recs.push({ title: "Melhorar a acessibilidade", text: `A nota de acessibilidade é ${psi.scores.accessibility}. Contraste e textos alternativos ajudam pessoas e também os robôs das IAs.`, weight: 50 });

  const fallback: Rec[] = [
    { title: "Publicar conteúdo que responde perguntas", text: "Artigos e perguntas frequentes com as dúvidas reais dos seus clientes aumentam a chance de ser citado pelas IAs.", weight: 10 },
    { title: "Cuidar do Google Meu Negócio", text: "Perfil completo, fotos atuais e avaliações respondidas reforçam a sua presença local.", weight: 9 },
    { title: "Monitorar as citações nas IAs", text: "Acompanhar todo mês se ChatGPT, Gemini e Perplexity citam a sua empresa mostra o que está funcionando.", weight: 8 },
  ];
  return [...recs, ...fallback]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map(({ title, text }) => ({ title, text }));
}
