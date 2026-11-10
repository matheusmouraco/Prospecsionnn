/* eslint-disable @next/next/no-img-element */
import { PRODUCT_NAME } from "@/lib/brand";
import { cx } from "./cx";

/** Full ArquiStudio wordmark (slats + name), white version for the dark UI. */
export function Logo({ className }: { className?: string }) {
  return <img src="/brand/logo-white.webp" alt="ArquiStudio" width={2000} height={194} className={cx("w-auto", className)} />;
}

/** Slats symbol only (compact spaces, mobile). */
export function Mark({ className }: { className?: string }) {
  return <img src="/brand/splash-mark.png" alt="ArquiStudio" width={368} height={218} className={cx("w-auto", className)} />;
}

export function ProductLockup({ compact }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      {compact ? <Mark className="h-6" /> : <Logo className="h-[18px]" />}
      <span className="rounded-md border border-line-strong px-1.5 py-0.5 text-[10.5px] font-semibold tracking-[0.14em] text-ink/80 uppercase font-wide">
        {PRODUCT_NAME}
      </span>
    </span>
  );
}

/**
 * Loader made of the logo's slats: each blade rotates in sequence, like a
 * brise opening. Used while the AI is generating.
 */
export function SlatsLoader({ size = 96, className }: { size?: number; className?: string }) {
  const n = 11;
  return (
    <div className={cx("relative flex items-end justify-center", className)} style={{ width: size, height: size * 0.62 }} aria-hidden>
      {Array.from({ length: n }, (_, i) => {
        const from = -72 + (i * 72) / (n - 1);
        return (
          <span
            key={i}
            className="mx-[1.5px] block origin-bottom rounded-[1px] bg-ink animate-slat"
            style={
              {
                width: Math.max(2, size / 34),
                height: size * (0.34 + (i / (n - 1)) * 0.28),
                animationDelay: `${i * 70}ms`,
                ["--from" as string]: `${from}deg`,
                transform: `rotate(${from}deg)`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
