import { contractState } from "@/lib/autoatendimento";
import { tryDb } from "@/lib/db";
import { sendEmail } from "@/lib/email/send";
import { noticeEmail } from "@/lib/email/templates";
import { getPaymentProvider } from "@/lib/payments";
import type { Assinatura } from "@/lib/repo";
import { mensagemAvulsa } from "./fluxo";

// Renovação anual (endereço R$45 e, se houver, domínio R$75): o Asaas já gera a cobrança da assinatura;
// aqui a Supporta avisa no WhatsApp e por e-mail 15 dias e 3 dias antes, com o link para pagar.

const AVISOS = [15, 3];
const DIA = 86_400_000;
const hojeSP = () => new Date(Date.now() - 3 * 3600_000).toISOString().slice(0, 10);
const dataBR = (iso: string) => iso.split("-").reverse().join("/");

type Linha = Assinatura & { avisos_renovacao: string[]; slug: string | null; dominio_site: string | null };

export async function avisarRenovacoes() {
  const rows = (await tryDb("renovacoes", (sql) => sql<Linha[]>`
    select a.*, s.slug, s.dominio as dominio_site from assinaturas a join sites s on s.id = a.site_id
    where a.status = 'ativa' and a.cancelar_em is null and a.provedor_cliente_id is not null`)) ?? [];
  const provider = getPaymentProvider();
  const enviados: string[] = [];
  for (const a of rows) {
    const { paidUntil, renovacao } = await contractState(a);
    const vence = new Date(new Date(`${paidUntil}T12:00:00Z`).getTime() + DIA).toISOString().slice(0, 10); // dia seguinte ao fim do período pago
    const dias = Math.round((new Date(`${vence}T12:00:00Z`).getTime() - new Date(`${hojeSP()}T12:00:00Z`).getTime()) / DIA);
    const aviso = AVISOS.find((d) => dias <= d && dias > 0 && !a.avisos_renovacao.includes(`${vence}:${d}`) && !(d === 15 && dias <= 3));
    if (!aviso) continue;
    const faturas = provider && provider.name === a.provedor ? await provider.listInvoices(a.provedor_cliente_id!).catch(() => []) : [];
    const fatura = faturas.find((f) => f.status === "PENDING" && f.url && Math.abs(new Date(f.dueDate).getTime() - new Date(vence).getTime()) < 40 * DIA);
    const endereco = a.dominio_site ? a.dominio_site : `${a.slug}.supporta.com.br`;
    const nome = a.responsavel.split(" ")[0];
    const pagar = fatura?.url ? `Link para pagar (Pix, boleto ou cartão): ${fatura.url}` : "O link para pagar (Pix, boleto ou cartão) chega no seu e-mail.";
    const texto = [
      aviso === 15
        ? `Oi ${nome}! Matheus da Supporta aqui. O site da ${a.empresa} (${endereco}) completa 1 ano no dia ${dataBR(vence)}.`
        : `Oi ${nome}! Lembrete rápido: a renovação do site da ${a.empresa} (${endereco}) vence em ${dias} dia${dias > 1 ? "s" : ""}, no dia ${dataBR(vence)}.`,
      `A renovação é R$ ${renovacao} e mantém o site no ar por mais 1 ano, com hospedagem e SSL${a.dominio_proprio ? ", e o seu domínio próprio" : ""}. ${pagar}`,
      "Se não quiser renovar, é só me avisar aqui.",
    ];
    // Marca antes de mandar: nunca repete o mesmo aviso.
    await tryDb("marcarAvisoRenovacao", (sql) => sql`update assinaturas set avisos_renovacao = array_append(avisos_renovacao, ${`${vence}:${aviso}`}) where id = ${a.id}`);
    if (a.whatsapp) await mensagemAvulsa(`55${a.whatsapp.replace(/\D/g, "").replace(/^55/, "")}`, texto).catch((err) => console.error("[renovacao] whatsapp:", (err as Error).message));
    if (a.email?.includes("@")) {
      await sendEmail({
        to: a.email,
        ...noticeEmail(aviso === 15 ? "Seu site completa 1 ano" : "Lembrete: renovação do seu site", texto.slice(0, 2), undefined, fatura?.url ? { label: "Pagar a renovação", href: fatura.url } : undefined),
      }).catch(() => {});
    }
    enviados.push(a.empresa);
  }
  return enviados;
}
