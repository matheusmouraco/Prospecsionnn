import { Gauge, ScanSearch, Smartphone, Wallet } from "lucide-react";

const items = [
  { icon: Gauge, text: "Nota 90+ no PageSpeed" },
  { icon: Smartphone, text: "Feito pro celular" },
  { icon: ScanSearch, text: "Pronto pro Google e pras IAs" },
  { icon: Wallet, text: "Sem custo de criação" },
];

export function ProofStrip() {
  return (
    <section aria-label="Garantias" className="border-y border-line bg-white">
      <ul className="container-site grid grid-cols-2 gap-x-6 gap-y-5 py-7 md:grid-cols-4">
        {items.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3 text-[15px] font-medium tracking-[-0.01em] md:text-base">
            <Icon aria-hidden strokeWidth={1.75} className="h-5 w-5 shrink-0 text-pink drop-shadow-[0_0_6px_rgb(255_61_113/0.55)]" />
            {text}
          </li>
        ))}
      </ul>
    </section>
  );
}
