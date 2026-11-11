import { servicos } from '@/lib/data';
import Rule from './Rule';
import SectionHead from './SectionHead';

export default function Services() {
  return (
    <section id="servicos" className="relative pt-24 md:pt-36" aria-labelledby="servicos-title">
      <SectionHead index="03" label="Serviços" title="Do terreno à última desforma." id="servicos-title" />

      <table className="block w-full text-left">
        <caption className="sr-only">Serviços do estúdio, escopo e prazo médio</caption>
        <thead className="block max-md:sr-only">
          <tr className="g relative py-2.5 text-mute">
            <th scope="col" className="label c col-span-1 font-normal">Nº</th>
            <th scope="col" className="label c col-span-4 font-normal">Serviço</th>
            <th scope="col" className="label c col-span-5 font-normal">Escopo</th>
            <th scope="col" className="label c col-span-2 font-normal text-right">Prazo médio</th>
          </tr>
        </thead>
        <tbody className="block">
          {servicos.map((s) => (
            <tr key={s.n} className="svc-row g relative items-baseline py-5 md:py-6">
              <td className="absolute inset-x-0 top-0 p-0" aria-hidden>
                <Rule />
              </td>
              <td className="label c col-span-1 tabular-nums relative">
                <span className="svc-n">{s.n}</span>
              </td>
              <th scope="row" className="display c col-span-3 md:col-span-4 font-medium text-[clamp(1.35rem,2.3vw,2.25rem)] leading-[0.95]">
                {s.name}
              </th>
              <td className="c col-span-3 col-start-2 md:col-start-auto md:col-span-5 mt-3 md:mt-0 text-[15px] md:text-base leading-[1.45] text-ink/85 max-w-[46ch]">
                {s.scope}
              </td>
              <td className="label c col-span-3 col-start-2 md:col-start-auto md:col-span-2 md:text-right mt-3 md:mt-0 text-mute">
                {s.time}
              </td>
              <td className="svc-bar absolute left-0 right-0 bottom-0 h-[3px] bg-accent p-0" aria-hidden />
            </tr>
          ))}
        </tbody>
      </table>
      <Rule />
    </section>
  );
}
