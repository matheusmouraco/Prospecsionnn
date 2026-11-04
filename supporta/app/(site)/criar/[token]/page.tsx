import type { Metadata } from "next";
import { SiteProgress } from "@/components/criar/SiteProgress";

export const metadata: Metadata = { title: "Seu site | Supporta", robots: { index: false, follow: false } };

export default async function CriarTokenPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <section aria-label="Seu site" className="relative overflow-hidden bg-white pb-24 pt-10 md:pt-14">
      <div aria-hidden className="grid-light pointer-events-none absolute inset-0" />
      <div className="container-site relative">
        <SiteProgress token={token} />
      </div>
    </section>
  );
}
