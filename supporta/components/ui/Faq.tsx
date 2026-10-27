import { Plus } from "lucide-react";
import type { Faq as FaqItem } from "@/lib/faqs";

/** FAQ acessível com details/summary (funciona sem JavaScript). Perguntas como H3 para AEO. */
export function Faq({ items, tone = "light" }: { items: FaqItem[]; tone?: "light" | "dark" }) {
  const border = tone === "dark" ? "border-line-dark" : "border-line";
  const answer = tone === "dark" ? "text-mist" : "text-graphite";
  return (
    <div className={`border-t ${border}`}>
      {items.map((item) => (
        <details key={item.q} className={`group border-b ${border}`}>
          <summary className="flex items-start justify-between gap-6 py-6 text-left">
            <h3 className="text-lg font-semibold tracking-[-0.03em] md:text-xl">{item.q}</h3>
            <Plus aria-hidden strokeWidth={1.75} className="mt-1 h-5 w-5 shrink-0 transition-transform duration-200 group-open:rotate-45" />
          </summary>
          <p className={`-mt-1 max-w-3xl pb-6 leading-relaxed ${answer}`}>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
