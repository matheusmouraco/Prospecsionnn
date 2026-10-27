"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readConsent, saveConsent } from "@/lib/analytics";

export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(readConsent() === null);
  }, []);

  if (!open) return null;

  const choose = (value: "granted" | "denied") => {
    saveConsent(value);
    setOpen(false);
  };

  return (
    <div role="region" aria-label="Aviso de cookies" className="fixed bottom-3 left-3 right-20 z-50 md:bottom-6 md:left-6 md:right-auto md:max-w-md">
      <div className="rounded-3xl border border-line-dark bg-ink p-4 text-paper md:p-5">
        <p className="text-sm leading-relaxed text-mist md:text-[15px]">
          Usamos cookies de medição (Google e Meta) só se você aceitar.{" "}
          <Link href="/privacidade" className="link text-paper">Saiba mais</Link>
        </p>
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={() => choose("granted")} className="h-10 rounded-full bg-paper px-4 text-sm font-medium text-ink hover:bg-white">
            Aceitar
          </button>
          <button type="button" onClick={() => choose("denied")} className="h-10 rounded-full border border-paper/25 px-4 text-sm font-medium text-paper hover:border-paper">
            Recusar
          </button>
        </div>
      </div>
    </div>
  );
}
