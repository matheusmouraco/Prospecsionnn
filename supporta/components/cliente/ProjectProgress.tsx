import { Check } from "lucide-react";
import type { Etapa } from "@/lib/repo";

const steps = ["Pagamento", "Briefing", "Criação", "Prévia", "No ar"];

/** Em qual passo o site está (0 a 4) e se o passo atual já foi concluído. */
function position(etapa: Etapa, briefingSent: boolean): { current: number; done: boolean } {
  if (etapa === "publicado") return { current: 4, done: true };
  if (etapa === "previa" || etapa === "revisao" || etapa === "aprovado") return { current: 3, done: false };
  if (etapa === "producao" || briefingSent) return { current: 2, done: false };
  return { current: 1, done: false };
}

const detail: Record<Etapa, string> = {
  briefing: "Falta o briefing: é ele que libera a criação do seu site.",
  producao: "Estamos criando o seu site. Você recebe um aviso quando a prévia estiver pronta.",
  previa: "A prévia do seu site está pronta. Veja e aprove ou peça mudanças aqui embaixo.",
  revisao: "Estamos fazendo as mudanças que você pediu na prévia. Você recebe um aviso com a nova versão.",
  aprovado: "Prévia aprovada. Estamos publicando o site e apontando o domínio.",
  publicado: "Seu site está no ar.",
};

export function ProjectProgress({ etapa, briefingSent, prazo }: { etapa: Etapa; briefingSent: boolean; prazo?: number }) {
  const { current, done } = position(etapa, briefingSent);
  return (
    <section aria-labelledby="andamento-title" className="rounded-[2rem] border border-line bg-white p-6 md:p-8">
      <h2 id="andamento-title" className="text-xl tracking-[-0.03em]">Andamento do site</h2>
      <ol className="mt-6 grid grid-cols-5 gap-2">
        {steps.map((label, i) => {
          const complete = i < current || (i === current && done);
          const active = i === current && !done;
          return (
            <li key={label} aria-current={active ? "step" : undefined} className="min-w-0">
              <span className={`flex h-2 rounded-full ${complete ? "bg-ink" : active ? "bg-pink" : "bg-line"}`} />
              <span className={`mt-2 flex items-center gap-1 text-sm ${complete || active ? "font-medium text-ink" : "text-graphite"}`}>
                {complete ? <Check aria-hidden strokeWidth={2} className="h-3.5 w-3.5 shrink-0" /> : null}
                <span className="truncate">{label}</span>
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-5 text-[15px] text-graphite">
        {detail[etapa === "briefing" && briefingSent ? "producao" : etapa]}
        {etapa === "producao" && prazo ? ` Prazo: até ${prazo} dias úteis depois do briefing.` : ""}
      </p>
    </section>
  );
}
