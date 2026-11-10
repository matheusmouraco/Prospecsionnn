"use client";

import { useEffect, useState } from "react";
import { SlatsLoader } from "@/components/ui/brand";

const TIPS = [
  "Travando paredes, aberturas e perspectiva da sua imagem",
  "Aplicando os materiais superfície por superfície",
  "Calculando a luz natural e as sombras de contato",
  "Ajustando reflexos do porcelanato, do vidro e dos metais",
  "Refinando texturas de madeira, pedra e tecido",
  "Dica: no resultado, use Editar área para mudar só um pedaço",
  "Dica: salve suas escolhas como preset e reaplique em um clique",
  "Dica: HD 2K é o ideal para a apresentação final ao cliente",
];

/** Overlay shown on the canvas while an image is being generated. */
export function Generating({ image, startedAt, expectedSeconds, label, done, total }: { image: string; startedAt: number; expectedSeconds: number; label: string; done?: number; total?: number }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(t);
  }, []);
  const elapsed = (now - startedAt) / 1000;
  // Asymptotic progress: ~80% at the expected time, never 100 before the answer arrives.
  const progress = Math.min(97, 100 * (1 - Math.exp(-elapsed / (expectedSeconds * 0.62))));
  const tip = TIPS[Math.floor(elapsed / 4.5) % TIPS.length];
  const remaining = Math.max(0, Math.round(expectedSeconds - elapsed));

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt="" className="absolute inset-0 size-full scale-[1.03] object-cover blur-[3px] brightness-[.32] saturate-[.4]" />
      <div className="absolute inset-x-0 top-0 h-[14%] bg-gradient-to-b from-transparent via-white/[.07] to-transparent animate-scan" />
      <div className="slats slats-fade absolute inset-0 text-white/[.035]" />
      <div className="absolute inset-0 grid place-items-center p-6">
        <div className="flex w-full max-w-sm flex-col items-center text-center">
          <SlatsLoader size={104} />
          <p className="mt-7 text-lg font-medium font-display">{label}</p>
          <p className="mt-1 text-xs text-muted tabular-nums">
            {total && total > 1 ? `${done ?? 0} de ${total} prontas · ` : ""}
            {remaining > 0 ? `cerca de ${remaining}s` : "finalizando"}
          </p>
          <div className="mt-5 h-[3px] w-full max-w-[260px] overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-ink transition-[width] duration-300 ease-linear" style={{ width: `${progress}%` }} />
          </div>
          <p key={tip} className="mt-5 min-h-10 max-w-xs text-[13px] leading-relaxed text-ink/60 animate-fade-in">
            {tip}
          </p>
        </div>
      </div>
    </div>
  );
}
