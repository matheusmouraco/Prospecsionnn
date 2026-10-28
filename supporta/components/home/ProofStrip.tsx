import { Smartphone } from "lucide-react";
import { AiLogos } from "@/components/ui/AiLogos";

/** Quatro garantias com prova visual: a nota, o celular, onde o site aparece e o custo zero de criação. */
export function ProofStrip() {
  return (
    <section aria-labelledby="garantias-title" className="bg-paper py-14 md:py-20">
      <div className="container-site">
        <h2 id="garantias-title" className="sr-only">O que todo site da Supporta garante</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <li className="group flex flex-col rounded-[1.75rem] border border-line bg-white p-6 transition-shadow hover:shadow-[0_0_0_1px_rgb(255_61_113/0.65),0_0_22px_rgb(255_61_113/0.35)]">
            <div className="flex items-center gap-4">
              <svg viewBox="0 0 64 64" className="h-16 w-16 shrink-0" aria-hidden>
                <circle cx="32" cy="32" r="27" fill="none" stroke="var(--line)" strokeWidth="6" />
                <circle cx="32" cy="32" r="27" fill="none" stroke="var(--pink)" strokeWidth="6" strokeLinecap="round" strokeDasharray="153 170" transform="rotate(-90 32 32)" className="drop-shadow-[0_0_6px_rgb(255_61_113/0.6)]" />
              </svg>
              <p className="text-5xl font-semibold tracking-[-0.06em]">90+</p>
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em]">Nota no PageSpeed</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-graphite">A meta de todo site, medida no celular pela ferramenta oficial do Google.</p>
          </li>

          <li className="group flex flex-col rounded-[1.75rem] border border-line bg-white p-6 transition-shadow hover:shadow-[0_0_0_1px_rgb(255_61_113/0.65),0_0_22px_rgb(255_61_113/0.35)]">
            <span className="neon-glow inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-ink">
              <Smartphone aria-hidden strokeWidth={1.75} className="h-8 w-8 text-pink" />
            </span>
            <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em]">Feito pro celular</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-graphite">Desenhado primeiro para a tela pequena, onde o seu cliente decide quem chamar.</p>
          </li>

          <li className="group flex flex-col rounded-[1.75rem] border border-line bg-white p-6 transition-shadow hover:shadow-[0_0_0_1px_rgb(255_61_113/0.65),0_0_22px_rgb(255_61_113/0.35)]">
            <AiLogos names={false} size={24} className="min-h-16 flex-nowrap gap-x-2.5" />
            <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em]">Pronto pro Google e pras IAs</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-graphite">Dados estruturados, llms.txt e robôs liberados para ser lido e citado.</p>
          </li>

          <li className="group flex flex-col rounded-[1.75rem] border border-line bg-white p-6 transition-shadow hover:shadow-[0_0_0_1px_rgb(255_61_113/0.65),0_0_22px_rgb(255_61_113/0.35)]">
            <p className="flex h-16 items-center text-5xl font-semibold tracking-[-0.06em]">
              R$<span className="neon-text">0</span>
            </p>
            <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em]">De custo de criação</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-graphite">Você paga só a assinatura mensal, com hospedagem e manutenção inclusas.</p>
          </li>
        </ul>
      </div>
    </section>
  );
}
