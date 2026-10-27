import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { adminBriefing } from "@/lib/admin";
import { signedDownloadUrl } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Briefing | Supporta", robots: { index: false, follow: false } };

const label: Record<string, string> = {
  nomeFantasia: "Nome", slogan: "Slogan", historia: "História", diferenciais: "Diferenciais", servicos: "Serviços", publico: "Público", tom: "Tom",
  perguntas: "Perguntas dos clientes", endereco: "Endereço", cidade: "Cidade", horario: "Horário", telefone: "Telefone", whatsapp: "WhatsApp",
  instagram: "Instagram", mapa: "Google Maps", temDominio: "Já tem domínio", dominio: "Domínio", cores: "Cores", referencias: "Referências", observacoes: "Observações",
};

function show(v: unknown): string {
  if (Array.isArray(v)) return v.map((x) => (typeof x === "object" && x ? `${(x as { nome: string }).nome}${(x as { descricao?: string }).descricao ? `: ${(x as { descricao: string }).descricao}` : ""}` : String(x))).join("\n");
  return String(v ?? "");
}

export default async function BriefingAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const b = await adminBriefing((await params).id);
  if (!b) notFound();
  const files = await Promise.all(b.arquivos.map(async (a) => ({ ...a, url: await signedDownloadUrl(a.path) })));
  return (
    <section className="container-site max-w-4xl py-12">
      <Link href="/admin" className="link text-sm">← Painel</Link>
      <h1 className="mt-4 text-4xl tracking-[-0.05em]">{b.empresa}</h1>
      <p className="mt-2 text-graphite">Plano {b.plano} · {b.email} · {b.whatsapp}</p>
      <dl className="mt-8 divide-y divide-line rounded-2xl border border-line bg-white">
        {Object.entries(b.respostas).filter(([, v]) => show(v).trim()).map(([k, v]) => (
          <div key={k} className="grid gap-1 p-4 md:grid-cols-[200px_1fr]">
            <dt className="text-sm text-graphite">{label[k] ?? k}</dt>
            <dd className="whitespace-pre-line">{show(v)}</dd>
          </div>
        ))}
      </dl>
      <h2 className="mt-10 text-2xl tracking-[-0.04em]">Arquivos</h2>
      <ul className="mt-3 space-y-2">
        {files.length ? files.map((f) => <li key={f.path}>{f.kind}: {f.url ? <a href={f.url} className="link" target="_blank" rel="noopener">{f.nome}</a> : f.nome}</li>) : <li className="text-graphite">Nenhum arquivo enviado.</li>}
      </ul>
    </section>
  );
}
