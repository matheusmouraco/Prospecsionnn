import { Smartphone } from "lucide-react";
import { AiLogos } from "@/components/ui/AiLogos";

const item = "relative flex flex-col bg-ink p-6 md:p-8";
const title = "mt-6 text-lg font-semibold tracking-[-0.02em] text-paper";
const text = "mt-2 text-[15px] leading-relaxed text-mist";

/** Quatro garantias numa faixa preta brilhante: a nota, o celular, onde o site aparece e o custo zero de criação. */
export function ProofStrip() {
  return (
    <section aria-labelledby="garantias-title" className="bg-white pb-20 md:pb-28">
      <div className="container-site">
        <h2 id="garantias-title" className="sr-only">O que todo site da Supporta garante</h2>
        <ul className="neon-ring grid gap-px overflow-hidden rounded-[2rem] bg-line-dark sm:grid-cols-2 lg:grid-cols-4">
          <li className={item}>
            <div className="flex h-14 items-center gap-3">
              <svg viewBox="0 0 64 64" className="h-14 w-14 shrink-0" aria-hidden>
                <circle cx="32" cy="32" r="26" fill="none" stroke="var(--line-dark)" strokeWidth="7" />
                <circle cx="32" cy="32" r="26" fill="none" stroke="var(--pink)" strokeWidth="7" strokeLinecap="round" strokeDasharray="150 164" transform="rotate(-90 32 32)" className="drop-shadow-[0_0_6px_rgb(255_61_113/0.8)]" />
              </svg>
              <p className="neon-text text-5xl font-semibold tracking-[-0.06em]">90+</p>
            </div>
            <h3 className={title}>Nota no PageSpeed</h3>
            <p className={text}>A meta de todo site, medida no celular pela ferramenta oficial do Google.</p>
          </li>

          <li className={item}>
            <div className="flex h-14 items-center">
              <span className="neon-glow inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-pink">
                <Smartphone aria-hidden strokeWidth={1.75} className="h-7 w-7 text-ink" />
              </span>
            </div>
            <h3 className={title}>Feito pro celular</h3>
            <p className={text}>Desenhado primeiro para a tela pequena, onde o seu cliente decide quem chamar.</p>
          </li>

          <li className={item}>
            <div className="flex h-14 items-center">
              <AiLogos only={["google", "chatgpt", "gemini", "perplexity"]} tone="dark" names={false} size={22} className="flex-nowrap gap-x-2.5 rounded-2xl border border-line-dark bg-card-dark px-3.5 py-3" />
            </div>
            <h3 className={title}>Pronto pro Google e pras IAs</h3>
            <p className={text}>Dados estruturados, llms.txt e robôs liberados para o site ser lido e citado.</p>
          </li>

          <li className={item}>
            <p className="flex h-14 items-center text-5xl font-semibold tracking-[-0.06em] text-paper">
              R$<span className="neon-text">0</span>
            </p>
            <h3 className={title}>De custo de criação</h3>
            <p className={text}>Você paga só a assinatura mensal, com hospedagem e manutenção inclusas.</p>
          </li>
        </ul>
      </div>
    </section>
  );
}
