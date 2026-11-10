"use client";

import { useEffect, useState } from "react";

const TIPS = [
  "Travando paredes, janelas e perspectiva da sua imagem",
  "Aplicando os materiais superfície por superfície",
  "Calculando a luz natural e as sombras de contato",
  "Ajustando reflexos do porcelanato e dos metais",
  "Dica: no resultado, use \"Editar área\" para mudar só um pedaço",
  "Dica: salve suas escolhas como preset e reaplique em um clique",
  "Dica: HD 2K é ideal para a apresentação final ao cliente",
  "Refinando texturas de madeira, pedra e tecido",
];

/** Overlay shown on the stage while an image is being generated. */
export function Generating({ image, startedAt, expectedSeconds, label, done, total }: { image: string; startedAt: number; expectedSeconds: number; label: string; done?: number; total?: number }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, []);
  const elapsed = (now - startedAt) / 1000;
  // Smooth asymptotic progress: ~80% at the expected time, never reaches 100 before the answer.
  const progress = Math.min(97, 100 * (1 - Math.exp(-elapsed / (expectedSeconds * 0.62))));
  const tip = TIPS[Math.floor(elapsed / 4.5) % TIPS.length];
  const r = 34;
  const circ = 2 * Math.PI * r;

  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt="" className="absolute inset-0 size-full scale-105 object-cover blur-[2px] brightness-[.45] saturate-50" />
      <div className="absolute inset-x-0 top-0 h-[12%] bg-gradient-to-b from-transparent via-accent/30 to-transparent animate-scan" />
      <div className="absolute inset-0 grid place-items-center p-6">
        <div className="flex max-w-sm flex-col items-center text-center">
          <div className="relative size-24">
            <svg viewBox="0 0 80 80" className="size-full -rotate-90">
              <circle cx="40" cy="40" r={r} fill="none" stroke="rgb(255 255 255 / .12)" strokeWidth="4" />
              <circle
                cx="40"
                cy="40"
                r={r}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - progress / 100)}
                style={{ transition: "stroke-dashoffset .3s linear" }}
              />
            </svg>
            <span className="absolute inset-0 grid place-items-center text-lg font-semibold tabular-nums">{Math.round(progress)}%</span>
          </div>
          <p className="mt-4 text-base font-medium">{label}</p>
          {total && total > 1 ? <p className="mt-0.5 text-xs text-muted">{done ?? 0} de {total} prontas</p> : null}
          <p key={tip} className="mt-3 min-h-10 text-sm text-ink/70 animate-fade-in">
            {tip}
          </p>
        </div>
      </div>
    </div>
  );
}
