"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { buttonClass } from "@/components/ui/Button";
import { nav } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      openRef.current?.focus();
    };
  }, [open]);

  return (
    <header className={`sticky top-0 z-40 bg-paper transition-[border-color] ${scrolled ? "border-b border-line" : "border-b border-transparent"}`}>
      <div className="container-site flex h-[72px] items-center justify-between gap-6">
        <Link href="/" aria-label="Supporta, página inicial" className="shrink-0">
          <Logo />
        </Link>
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-[15px] font-medium text-graphite transition-colors hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <Link href="/planos" className={buttonClass("primary", "md")} data-track="plan_click" data-track-origin="header">
              Assinar a partir de R$89
            </Link>
          </span>
          <button
            ref={openRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 lg:hidden"
          >
            <Menu aria-hidden strokeWidth={1.75} className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </button>
        </div>
      </div>

      {open ? (
        <div id="menu-mobile" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-50 flex flex-col bg-ink text-paper lg:hidden">
          <div className="container-site flex h-[72px] items-center justify-between">
            <Link href="/" aria-label="Supporta, página inicial" onClick={() => setOpen(false)}>
              <Logo tone="dark" />
            </Link>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper/25"
            >
              <X aria-hidden strokeWidth={1.75} className="h-5 w-5" />
              <span className="sr-only">Fechar menu</span>
            </button>
          </div>
          <nav aria-label="Menu mobile" className="container-site flex flex-1 flex-col justify-between pb-10 pt-8">
            <ul className="space-y-2">
              {nav.map((item, i) => (
                <li key={item.href} className="bar-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <Link href={item.href} onClick={() => setOpen(false)} className="block py-2 text-[40px] font-semibold leading-tight tracking-[-0.05em]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/planos" onClick={() => setOpen(false)} className={buttonClass("pink", "lg", "w-full")} data-track="plan_click" data-track-origin="menu-mobile">
              Assinar a partir de R$89
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
