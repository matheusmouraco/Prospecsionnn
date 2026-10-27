/** Medidor circular no padrão do PageSpeed: verde 90+, laranja 50 a 89, vermelho abaixo de 50. */
export function Gauge({ value, label }: { value: number; label: string }) {
  const color = value >= 90 ? "var(--ok)" : value >= 50 ? "var(--warn)" : "var(--bad)";
  const status = value >= 90 ? "bom" : value >= 50 ? "precisa melhorar" : "ruim";
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <figure className="flex flex-col items-center text-center">
      <svg viewBox="0 0 100 100" className="h-28 w-28" role="img" aria-label={`${label}: ${value} de 100, ${status}`}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--line)" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${(value / 100) * c} ${c}`}
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dasharray 900ms ease-out" }}
        />
        <text x="50" y="50" textAnchor="middle" dominantBaseline="central" fontSize="28" fontWeight="600" fill={color} letterSpacing="-1">
          {value}
        </text>
      </svg>
      <figcaption className="mt-3 text-[15px] font-medium">{label}</figcaption>
    </figure>
  );
}
