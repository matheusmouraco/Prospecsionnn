"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin, updateClientConfig } from "@/lib/admin";
import { sendEmail } from "@/lib/email/send";
import { adjustmentEmail, stageEmail } from "@/lib/email/templates";
import { runCitationsFor } from "@/lib/monitor/citations";
import { finishRequest, getClient, setAdjustmentStatus, setStage, type Ajuste, type Etapa } from "@/lib/repo";

export async function setAdjustment(formData: FormData) {
  await assertAdmin();
  const status = String(formData.get("status")) as Ajuste["status"];
  if (!["aberto", "em_andamento", "feito"].includes(status)) return;
  const ajuste = await setAdjustmentStatus(String(formData.get("id")), status);
  if (ajuste && status === "feito") {
    const client = await getClient(ajuste.cliente_id);
    if (client) await sendEmail({ to: client.email, ...adjustmentEmail(client.nome, ajuste.descricao, "feito") });
  }
  revalidatePath("/admin");
}

const lines = (v: FormDataEntryValue | null) => String(v ?? "").split(/\n|,/).map((s) => s.trim()).filter(Boolean);

export async function saveClient(formData: FormData) {
  await assertAdmin();
  await updateClientConfig(String(formData.get("id")), {
    nomes: lines(formData.get("nomes")).slice(0, 10),
    perguntas: String(formData.get("perguntas") ?? "").split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 5),
    plausible: String(formData.get("plausible") ?? "").trim() || null,
    site: String(formData.get("site") ?? "").trim() || null,
    ativo: formData.get("ativo") === "on",
  });
  revalidatePath("/admin");
}

export async function runCitationsNow(formData: FormData) {
  await assertAdmin();
  const client = await getClient(String(formData.get("id")));
  if (client) await runCitationsFor(client);
  revalidatePath("/admin");
}

const etapas: Etapa[] = ["briefing", "producao", "previa", "revisao", "aprovado", "publicado"];
const url = (v: FormDataEntryValue | null) => {
  const s = String(v ?? "").trim();
  return s ? (/^https?:\/\//.test(s) ? s : `https://${s}`) : null;
};

/** Muda a etapa do site. Prévia e publicado avisam o cliente por e-mail. */
export async function setStageAction(formData: FormData) {
  await assertAdmin();
  const etapa = String(formData.get("etapa")) as Etapa;
  if (!etapas.includes(etapa)) return;
  const before = await getClient(String(formData.get("id")));
  if (!before) return;
  const client = await setStage(before.id, etapa, { previaUrl: url(formData.get("previa")), siteUrl: url(formData.get("site")) });
  if (client && (etapa === "previa" || etapa === "publicado") && before.etapa !== etapa) {
    await sendEmail({ to: client.email, ...stageEmail(client.nome, etapa, client.site_url) });
  }
  revalidatePath("/admin");
}

export async function finishRequestAction(formData: FormData) {
  await assertAdmin();
  await finishRequest(String(formData.get("id")));
  revalidatePath("/admin");
}

// ---------- painel de vendas (robô de WhatsApp) ----------

export async function salvarInvestimento(formData: FormData) {
  await assertAdmin();
  const mes = String(formData.get("mes") ?? "");
  const valor = Number(String(formData.get("valor") ?? "").replace(/\./g, "").replace(",", "."));
  if (!/^\d{4}-\d{2}$/.test(mes) || !(valor >= 0)) return;
  const { adicionarInvestimento } = await import("@/lib/admin-vendas");
  await adicionarInvestimento({ mes, canal: String(formData.get("canal") || "Tráfego pago").slice(0, 60), valor, obs: String(formData.get("obs") || "").slice(0, 200) || null });
  revalidatePath("/admin");
}

export async function apagarInvestimento(formData: FormData) {
  await assertAdmin();
  const { removerInvestimento } = await import("@/lib/admin-vendas");
  await removerInvestimento(Number(formData.get("id")));
  revalidatePath("/admin");
}

/** Botão de um clique do painel: assumir (robô para) ou devolver ao robô. */
export async function alternarRobo(formData: FormData) {
  await assertAdmin();
  const telefone = String(formData.get("telefone") ?? "").replace(/\D/g, "");
  if (!telefone) return;
  const { assumirConversa, devolverNaEtapaGuardada } = await import("@/lib/admin-vendas");
  if (formData.get("acao") === "assumir") await assumirConversa(telefone);
  else await devolverNaEtapaGuardada(telefone);
  revalidatePath("/admin");
  revalidatePath(`/admin/conversa/${telefone}`);
}

export async function devolverConversa(formData: FormData) {
  await assertAdmin();
  const etapa = String(formData.get("etapa"));
  if (!["inicio", "prospeccao", "negocio", "servicos", "fotos", "confirmacao", "previa", "dados", "pagamento", "pago"].includes(etapa)) return;
  const { devolverAoRobo } = await import("@/lib/admin-vendas");
  const telefone = String(formData.get("telefone"));
  await devolverAoRobo(telefone, etapa);
  revalidatePath(`/admin/conversa/${telefone}`);
  revalidatePath("/admin");
}
