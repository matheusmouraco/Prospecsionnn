import type { Metadata } from "next";
import { SiteBuilder } from "@/components/criar/SiteBuilder";
import { planoValido } from "@/lib/criador";
import { priceLabel, pricing } from "@/lib/plans";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Crie seu site com IA em minutos | Supporta",
  description: `Responda um jogo rápido de escolhas e a IA da Supporta monta o site da sua empresa. Você vê a prévia antes de pagar. ${priceLabel(pricing.site)}, pago uma vez.`,
  path: "/criar",
});

export default async function CriarPage({ searchParams }: { searchParams: Promise<{ plano?: string }> }) {
  const { plano } = await searchParams;
  return (
    <section aria-label="Criador de site" className="relative overflow-hidden bg-white pb-24 pt-10 md:pt-14">
      <div aria-hidden className="grid-light pointer-events-none absolute inset-0" />
      <div className="container-site relative">
        <SiteBuilder initialPlan={planoValido(plano)} />
      </div>
    </section>
  );
}
