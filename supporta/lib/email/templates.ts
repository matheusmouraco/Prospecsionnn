import { absoluteUrl, site, whatsappUrl } from "@/lib/site";

// Templates de e-mail no visual Camadas, em HTML de tabela (compatível com Gmail e Outlook).

export const esc = (v: unknown) =>
  String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const C = { ink: "#0B0B0F", paper: "#F5F5F2", pink: "#FF3D71", graphite: "#5C5C66", line: "#E4E4DE", ok: "#0F7B3F", warn: "#B45309", bad: "#C81E3A" };
const font = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;";

export const p = (text: string) => `<p style="margin:0 0 14px;${font}font-size:16px;line-height:1.6;color:${C.graphite}">${esc(text)}</p>`;
export const h2 = (text: string) => `<h2 style="margin:28px 0 12px;${font}font-size:20px;line-height:1.2;color:${C.ink}">${esc(text)}</h2>`;
export const button = (label: string, href: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0"><tr><td style="background:${C.ink};border-radius:999px"><a href="${esc(href)}" style="display:inline-block;padding:14px 26px;${font}font-size:15px;font-weight:600;color:${C.paper};text-decoration:none">${esc(label)}</a></td></tr></table>`;

const bar = (w: number, color: string, ml: number) =>
  `<div style="width:${w}px;height:6px;border-radius:6px;background:${color};margin:0 0 4px ${ml}px"></div>`;

export function layout(title: string, body: string, preheader = "") {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(title)}</title></head>
<body style="margin:0;background:${C.paper}">
<span style="display:none;max-height:0;overflow:hidden">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper}"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px">
<tr><td style="padding:0 0 20px"><table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="vertical-align:middle;padding-right:8px">${bar(20, C.ink, 8)}${bar(23, C.pink, 3)}${bar(20, C.ink, 0)}</td>
<td style="vertical-align:middle;${font}font-size:20px;font-weight:700;letter-spacing:-0.5px;color:${C.ink}">supporta</td></tr></table></td></tr>
<tr><td style="background:#FFFFFF;border:1px solid ${C.line};border-radius:24px;padding:32px">
<h1 style="margin:0 0 18px;${font}font-size:26px;line-height:1.15;letter-spacing:-0.5px;color:${C.ink}">${esc(title)}</h1>
${body}
</td></tr>
<tr><td style="padding:20px 8px;${font}font-size:12px;line-height:1.6;color:${C.graphite}">
${esc(site.signature)}<br>${esc(site.razaoSocial)} · CNPJ ${esc(site.cnpj)} · <a href="${absoluteUrl("/privacidade")}" style="color:${C.graphite}">Privacidade</a>
</td></tr></table></td></tr></table></body></html>`;
}

const scoreColor = (v: number) => (v >= 90 ? C.ok : v >= 50 ? C.warn : C.bad);

type Report = {
  url: string;
  scores: { performance: number; accessibility: number; bestPractices: number; seo: number } | null;
  checks: { label: string; ok: boolean; detail: string }[];
  recommendations: { title: string; text: string }[];
};

export function diagnosticEmail(report: Report) {
  const host = report.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const scores = report.scores
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 4px"><tr>${(
        [
          ["Desempenho", report.scores.performance],
          ["Acessibilidade", report.scores.accessibility],
          ["Boas práticas", report.scores.bestPractices],
          ["SEO", report.scores.seo],
        ] as const
      )
        .map(
          ([label, v]) =>
            `<td align="center" style="padding:6px"><div style="${font}font-size:30px;font-weight:700;color:${scoreColor(v)}">${v}</div><div style="${font}font-size:12px;color:${C.graphite}">${label}</div></td>`,
        )
        .join("")}</tr></table>`
    : p("O PageSpeed do Google não respondeu no momento do teste. As checagens abaixo foram feitas normalmente.");
  const checks = report.checks
    .map(
      (c) =>
        `<tr><td style="padding:8px 0;border-top:1px solid ${C.line};${font}font-size:14px;color:${C.ink}"><strong style="color:${c.ok ? C.ok : C.bad}">${c.ok ? "OK" : "Atenção"}</strong> · ${esc(c.label)}<br><span style="color:${C.graphite}">${esc(c.detail)}</span></td></tr>`,
    )
    .join("");
  const recs = report.recommendations
    .map((r, i) => `<p style="margin:0 0 12px;${font}font-size:15px;line-height:1.55;color:${C.graphite}"><strong style="color:${C.ink}">${i + 1}. ${esc(r.title)}</strong><br>${esc(r.text)}</p>`)
    .join("");
  const html = layout(
    `Relatório do ${host}`,
    `${p("Aqui está o diagnóstico do seu site no celular, com as notas do PageSpeed do Google e o que checamos para o Google e as IAs.")}
${h2("Notas no celular")}${scores}
${h2("Pronto pro Google e pras IAs?")}<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${checks}</table>
${h2("3 recomendações")}${recs}
${button("Ver como a Supporta resolve", absoluteUrl("/planos"))}
${p(`Prefere conversar? Responda este e-mail ou chame no WhatsApp: ${whatsappUrl(`Oi! Recebi o diagnóstico do ${host}.`)}`)}`,
    `Notas do seu site e 3 recomendações`,
  );
  const text = [
    `Relatório do ${host}`,
    report.scores ? `Desempenho ${report.scores.performance} · Acessibilidade ${report.scores.accessibility} · Boas práticas ${report.scores.bestPractices} · SEO ${report.scores.seo}` : "",
    ...report.checks.map((c) => `${c.ok ? "OK" : "Atenção"}: ${c.label}. ${c.detail}`),
    "Recomendações:",
    ...report.recommendations.map((r, i) => `${i + 1}. ${r.title}: ${r.text}`),
    `Planos: ${absoluteUrl("/planos")}`,
  ].filter(Boolean);
  return { subject: `Diagnóstico do ${host}`, html, text: text.join("\n") };
}

export function welcomeEmail({ nome, plano, prazo, briefingUrl }: { nome: string; plano: string; prazo: number; briefingUrl: string }) {
  const body = `${p(`Oi, ${nome}. Pagamento confirmado: o plano ${plano} da Supporta está ativo.`)}
${p(`O próximo passo é o briefing completo. Leva uns 10 minutos e é por ele que você manda logo, fotos e as informações da empresa. O site fica pronto em até ${prazo} dias úteis depois do briefing.`)}
${button("Preencher o briefing", briefingUrl)}
${p(`Na sua área do cliente você acompanha o andamento e pede ajustes: ${absoluteUrl("/cliente")}`)}`;
  return {
    subject: "Assinatura confirmada. Agora é o briefing",
    html: layout("Bem-vindo à Supporta", body, "Pagamento confirmado e próximo passo"),
    text: `Oi, ${nome}. Pagamento confirmado: plano ${plano} ativo.\nPreencha o briefing (10 minutos): ${briefingUrl}\nO site fica pronto em até ${prazo} dias úteis depois do briefing.\nÁrea do cliente: ${absoluteUrl("/cliente")}`,
  };
}

export function paymentRefusedEmail(nome: string) {
  const msg = `Oi, ${nome}. A cobrança da sua assinatura Supporta não foi aprovada pelo cartão. Vamos tentar de novo nos próximos dias. Se quiser trocar o cartão ou tirar uma dúvida, é só responder este e-mail ou chamar no WhatsApp.`;
  return {
    subject: "Cobrança não aprovada",
    html: layout("Não conseguimos cobrar no cartão", `${p(msg)}${button("Falar no WhatsApp", whatsappUrl("Oi! Minha cobrança da Supporta não foi aprovada."))}`),
    text: msg,
  };
}

export function loginEmail(url: string) {
  return {
    subject: "Seu link de acesso à área do cliente",
    html: layout(
      "Acesse a sua área do cliente",
      `${p("Clique no botão para entrar. O link vale por 20 minutos.")}${button("Entrar na área do cliente", url)}${p("Se não foi você que pediu, pode ignorar este e-mail.")}`,
    ),
    text: `Entre na área do cliente (link válido por 20 minutos): ${url}`,
  };
}

export function briefingReceivedEmail(nome: string, prazo: number) {
  const msg = `Oi, ${nome}. Recebemos o seu briefing. A primeira versão do site chega em até ${prazo} dias úteis para você aprovar. Se lembrar de algo, é só responder este e-mail.`;
  return { subject: "Briefing recebido", html: layout("Briefing recebido", `${p(msg)}${button("Ver minha área do cliente", absoluteUrl("/cliente"))}`), text: msg };
}

export function adjustmentEmail(nome: string, descricao: string, status: "recebido" | "feito") {
  const title = status === "recebido" ? "Pedido de ajuste recebido" : "Ajuste feito";
  const msg = status === "recebido" ? `Oi, ${nome}. Recebemos o seu pedido de ajuste e já está na fila.` : `Oi, ${nome}. O ajuste que você pediu já está no ar.`;
  return {
    subject: title,
    html: layout(title, `${p(msg)}<blockquote style="margin:0 0 16px;padding:12px 16px;border-left:4px solid ${C.pink};${font}font-size:15px;color:${C.ink}">${esc(descricao)}</blockquote>${button("Ver na área do cliente", absoluteUrl("/cliente"))}`),
    text: `${msg}\n\n${descricao}`,
  };
}

export type VisitsData = {
  mes: string;
  visitantes: number;
  visitas: number;
  paginas: number;
  anterior: { visitantes: number } | null;
  fontes: { nome: string; visitantes: number }[];
  topPaginas: { pagina: string; visitantes: number }[];
};

const fmt = (n: number) => n.toLocaleString("pt-BR");
const mesLabel = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

export function visitsEmail(nome: string, d: VisitsData) {
  const diff = d.anterior && d.anterior.visitantes > 0 ? Math.round(((d.visitantes - d.anterior.visitantes) / d.anterior.visitantes) * 100) : null;
  const trend = diff === null ? "" : `${diff >= 0 ? "+" : ""}${diff}% em relação ao mês anterior`;
  const rows = (items: { a: string; b: number }[]) =>
    items.map((i) => `<tr><td style="padding:7px 0;border-top:1px solid ${C.line};${font}font-size:14px;color:${C.ink}">${esc(i.a)}</td><td align="right" style="padding:7px 0;border-top:1px solid ${C.line};${font}font-size:14px;color:${C.ink}">${fmt(i.b)}</td></tr>`).join("");
  const body = `${p(`Oi, ${nome}. Estes são os números do seu site em ${mesLabel(d.mes)}.`)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="padding:6px"><div style="${font}font-size:30px;font-weight:700;color:${C.ink}">${fmt(d.visitantes)}</div><div style="${font}font-size:12px;color:${C.graphite}">pessoas</div></td>
<td style="padding:6px"><div style="${font}font-size:30px;font-weight:700;color:${C.ink}">${fmt(d.visitas)}</div><div style="${font}font-size:12px;color:${C.graphite}">visitas</div></td>
<td style="padding:6px"><div style="${font}font-size:30px;font-weight:700;color:${C.ink}">${fmt(d.paginas)}</div><div style="${font}font-size:12px;color:${C.graphite}">páginas vistas</div></td></tr></table>
${trend ? p(trend) : ""}
${h2("De onde vieram")}<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows(d.fontes.map((f) => ({ a: f.nome, b: f.visitantes })))}</table>
${h2("Páginas mais vistas")}<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows(d.topPaginas.map((f) => ({ a: f.pagina, b: f.visitantes })))}</table>
${button("Ver na área do cliente", absoluteUrl("/cliente"))}`;
  return {
    subject: `Relatório de visitas: ${mesLabel(d.mes)}`,
    html: layout("Relatório mensal de visitas", body, `${fmt(d.visitantes)} pessoas visitaram o seu site`),
    text: `Relatório de ${mesLabel(d.mes)}: ${fmt(d.visitantes)} pessoas, ${fmt(d.visitas)} visitas, ${fmt(d.paginas)} páginas vistas. ${trend}`,
  };
}

export type CitationRow = { motor: string; pergunta: string; citado: boolean; erro: string | null };

export function citationsEmail(nome: string, mes: string, rows: CitationRow[]) {
  const valid = rows.filter((r) => !r.erro);
  const hits = valid.filter((r) => r.citado).length;
  const table = rows
    .map(
      (r) =>
        `<tr><td style="padding:8px 0;border-top:1px solid ${C.line};${font}font-size:14px;color:${C.ink}">${esc(r.pergunta)}<br><span style="color:${C.graphite}">${esc(r.motor)}</span></td><td align="right" style="padding:8px 0;border-top:1px solid ${C.line};${font}font-size:14px;font-weight:700;color:${r.erro ? C.graphite : r.citado ? C.ok : C.bad}">${r.erro ? "não rodou" : r.citado ? "citou" : "não citou"}</td></tr>`,
    )
    .join("");
  const body = `${p(`Oi, ${nome}. Em ${mesLabel(mes)} fizemos ${valid.length} perguntas sobre o seu segmento ao ChatGPT, ao Gemini e ao Perplexity. A sua empresa apareceu em ${hits}.`)}
${p("As respostas das IAs mudam de um dia para o outro, então o que vale é a tendência ao longo dos meses.")}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${table}</table>
${button("Ver detalhes na área do cliente", absoluteUrl("/cliente"))}`;
  return {
    subject: `Citações nas IAs: ${hits} de ${valid.length} em ${mesLabel(mes)}`,
    html: layout("Monitoramento de citações nas IAs", body, `Sua empresa apareceu em ${hits} de ${valid.length} respostas`),
    text: `${mesLabel(mes)}: citada em ${hits} de ${valid.length} respostas.\n${rows.map((r) => `${r.motor} | ${r.pergunta} | ${r.erro ? "não rodou" : r.citado ? "citou" : "não citou"}`).join("\n")}`,
  };
}
