// The mark: a zero crossed by the datum line (±0,00), the line every drawing is measured from.
export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg className={`draw ${className}`} viewBox="0 0 34 22" aria-hidden="true" focusable="false">
      <rect x="9" y="2" width="12" height="18" rx="6" strokeWidth="1.6" />
      <path d="M1 11 H33" strokeWidth="1.2" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-3">
      <LogoMark className="h-[18px] w-auto" />
      <span className="flex items-baseline gap-2">
        <span className="text-[15px] font-semibold tracking-[-0.01em]">Linha Zero</span>
        <span className="eyebrow hidden opacity-60 sm:inline">Arquitetura</span>
      </span>
    </span>
  );
}
