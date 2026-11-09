// Sem dependências: usado pelo robô e pelos testes.

/** Instagram e site que vieram numa mensagem (link colado ou @). */
export function acharLinks(texto: string): { instagram?: string; site?: string; analise?: string } {
  const out: { instagram?: string; site?: string; analise?: string } = {};
  const ig = texto.match(/instagram\.com\/([A-Za-z0-9._]{2,30})/i)?.[1] ?? texto.match(/(?:^|\s)@([A-Za-z0-9._]{2,30})\b/)?.[1];
  if (ig && !["p", "reel", "stories", "explore"].includes(ig.toLowerCase())) out.instagram = ig.replace(/\.$/, "");
  const analise = texto.match(/analise\.supporta\.com\.br\/([a-z0-9-]{2,60})/i)?.[1];
  if (analise) out.analise = analise.toLowerCase();
  for (const m of texto.matchAll(/(?:https?:\/\/)?(?:www\.)?([a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:com|net|org|adv|med|odo|arq|eng|io|app|site|online|store|br)(?:\.br)?)(?:\/\S*)?/gi)) {
    const d = m[1].toLowerCase();
    if (/instagram\.com|facebook\.com|wa\.me|whatsapp\.com|linktr\.ee|supporta\.com\.br|gmail\.com|hotmail\.com|outlook\.com|yahoo\.com/.test(d)) continue;
    if (texto.slice(Math.max(0, (m.index ?? 0) - 1), m.index).includes("@")) continue; // e-mail
    out.site = d;
    break;
  }
  return out;
}
