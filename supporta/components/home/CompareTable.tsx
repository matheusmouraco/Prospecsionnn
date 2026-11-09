import { Check, ChevronDown } from "lucide-react";
import { priceLabel, priceRows, site99 } from "@/lib/plans";

/** O que está incluso no site e quanto custa cada item, recolhível (details/summary, sem JavaScript). */
export function CompareTable({ open = false }: { open?: boolean }) {
  return (
    <details className="group mt-12 rounded-[2rem] border border-line bg-white" open={open}>
      <summary className="flex items-center justify-between gap-4 px-6 py-5 md:px-8">
        <span className="text-lg font-semibold tracking-[-0.03em]">O que está incluso e quanto custa</span>
        <ChevronDown aria-hidden strokeWidth={1.75} className="h-5 w-5 transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-line">
        <table className="w-full border-collapse text-left text-[15px]">
          <caption className="sr-only">Itens inclusos no {site99.name} e valores de cada cobrança</caption>
          <tbody>
            <tr>
              <th colSpan={2} scope="colgroup" className="label-mono bg-paper px-6 py-3 text-graphite md:px-8">
                Incluso no {site99.name}
              </th>
            </tr>
            {site99.features.map((f) => (
              <tr key={f} className="border-b border-line">
                <th scope="row" className="px-6 py-3.5 font-normal md:px-8">{f}</th>
                <td className="px-6 py-3.5 text-right md:px-8">
                  <Check aria-hidden strokeWidth={1.75} className="ml-auto h-5 w-5" />
                  <span className="sr-only">Incluso</span>
                </td>
              </tr>
            ))}
          </tbody>
          <tbody>
            <tr>
              <th colSpan={2} scope="colgroup" className="label-mono bg-paper px-6 py-3 text-graphite md:px-8">
                Quanto custa
              </th>
            </tr>
            {priceRows.map((r) => (
              <tr key={r.item} className="border-b border-line last:border-0">
                <th scope="row" className="px-6 py-3.5 font-normal md:px-8">
                  {r.item}
                  <span className="block text-[13px] text-graphite">{r.detail}</span>
                </th>
                <td className="whitespace-nowrap px-6 py-3.5 text-right font-semibold md:px-8">
                  {priceLabel(r.value)}
                  <span className="font-normal text-graphite">{r.per}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
