import type { Metadata } from "next";
import { BriefingForm } from "@/components/briefing/BriefingForm";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Briefing do seu site | Supporta",
  description: "Briefing completo do seu site Supporta: informações da empresa, serviços, contato, logo e fotos. Leva uns 10 minutos.",
  path: "/briefing",
  noindex: true,
});

export default function BriefingPage() {
  return (
    <section aria-labelledby="page-title" className="pb-24 pt-10 md:pt-16">
      <div className="container-site max-w-4xl">
        <SectionLabel>Briefing · 10 minutos</SectionLabel>
        <h1 id="page-title" className="mt-4 text-[clamp(2.25rem,6vw,4rem)] leading-[1] tracking-[-0.055em]">
          Conte sobre a sua empresa
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-graphite">
          Não precisa caprichar no texto: a gente escreve. O importante é a informação estar certa. Campos vazios a gente completa com você pelo WhatsApp.
        </p>
        <div className="mt-10">
          <BriefingForm />
        </div>
      </div>
    </section>
  );
}
