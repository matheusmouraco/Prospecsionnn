import type { Metadata } from "next";
import { LoginForm } from "@/components/cliente/LoginForm";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Entrar na área do cliente | Supporta",
  description: "Acesse a área do cliente Supporta: peça ajustes, veja faturas e os relatórios do seu site.",
  path: "/cliente/entrar",
  noindex: true,
});

export default function EntrarPage() {
  return (
    <section aria-labelledby="page-title" className="pb-24 pt-12 md:pt-20">
      <div className="container-site max-w-3xl">
        <SectionLabel>Área do cliente</SectionLabel>
        <h1 id="page-title" className="mt-4 text-[clamp(2.25rem,6vw,4rem)] leading-[1] tracking-[-0.055em]">Entrar</h1>
        <p className="mt-5 text-lg text-graphite">Peça ajustes, acompanhe o andamento e veja faturas e relatórios.</p>
        <div className="mt-10">
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
