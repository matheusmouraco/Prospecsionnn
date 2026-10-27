"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin, updateClientConfig } from "@/lib/admin";
import { sendEmail } from "@/lib/email/send";
import { adjustmentEmail } from "@/lib/email/templates";
import { runCitationsFor } from "@/lib/monitor/citations";
import { getClient, setAdjustmentStatus, type Ajuste } from "@/lib/repo";

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
