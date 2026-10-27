import { Check, ChevronDown, Minus } from "lucide-react";
import { comparison, plans } from "@/lib/plans";

function Value({ v }: { v: boolean | string }) {
  if (v === true) return <><Check aria-hidden strokeWidth={1.75} className="mx-auto h-5 w-5" /><span className="sr-only">Incluso</span></>;
  if (v === false) return <><Minus aria-hidden strokeWidth={1.75} className="mx-auto h-5 w-5 text-graphite" /><span className="sr-only">Não incluso</span></>;
  return <span>{v}</span>;
}

/** Tabela comparativa completa, recolhível (details/summary, sem JavaScript). */
export function CompareTable({ open = false }: { open?: boolean }) {
  return (
    <details className="group mt-12 rounded-[2rem] border border-line bg-white" open={open}>
      <summary className="flex items-center justify-between gap-4 px-6 py-5 md:px-8">
        <span className="text-lg font-semibold tracking-[-0.03em]">Comparação completa dos planos</span>
        <ChevronDown aria-hidden strokeWidth={1.75} className="h-5 w-5 transition-transform group-open:rotate-180" />
      </summary>
      <div className="relative overflow-x-auto border-t border-line">
        <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
          <caption className="sr-only">Comparação dos planos Start, Pro e Premium</caption>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="px-6 py-4 font-medium text-graphite md:px-8">Recurso</th>
              {plans.map((p) => (
                <th key={p.id} scope="col" className={`px-4 py-4 text-center font-semibold ${p.highlight ? "bg-pink-light" : ""}`}>
                  {p.name}
                  <span className="block text-[13px] font-normal text-graphite">R${p.price}/mês</span>
                </th>
              ))}
            </tr>
          </thead>
          {comparison.map((group) => (
            <tbody key={group.group}>
              <tr>
                <th colSpan={4} scope="colgroup" className="label-mono bg-paper px-6 py-3 text-graphite md:px-8">
                  {group.group}
                </th>
              </tr>
              {group.rows.map((row) => (
                <tr key={row.label} className="border-b border-line last:border-0">
                  <th scope="row" className="px-6 py-3.5 font-normal md:px-8">{row.label}</th>
                  {plans.map((p) => (
                    <td key={p.id} className={`px-4 py-3.5 text-center ${p.highlight ? "bg-pink-light/60" : ""}`}>
                      <Value v={row.values[p.id]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </details>
  );
}
