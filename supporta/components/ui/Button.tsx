import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "pink" | "neon" | "outline" | "outline-dark" | "paper" | "ghost";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-[#25252d]",
  pink: "bg-pink text-ink hover:bg-[#ff5a87]",
  neon: "neon-glow bg-pink text-ink hover:bg-[#ff5a87] hover:shadow-[0_0_28px_rgb(255_61_113/0.7),0_0_90px_rgb(255_61_113/0.4)]",
  outline: "border border-ink/20 text-ink hover:border-ink",
  "outline-dark": "border border-paper/25 text-paper hover:border-paper",
  paper: "bg-paper text-ink hover:bg-white",
  ghost: "text-ink hover:bg-ink/5",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[15px]",
  lg: "h-13 px-7 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] transition-[background-color,border-color,box-shadow,color] duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${extra}`;
}

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

/** Botão em pílula. Com href vira link (interno via next/link, externo com rel seguro). */
export function Button({
  href,
  variant,
  size,
  className,
  children,
  ...rest
}: Common & ({ href: string } & Omit<ComponentProps<"a">, "href">)) {
  const cls = buttonClass(variant, size, className);
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={cls} target="_blank" rel="noopener" {...rest}>
      {children}
    </a>
  );
}
