"use client";

import { usePathname } from "next/navigation";
import { whatsappMessageFor, whatsappUrl } from "@/lib/site";
import { WhatsAppIcon } from "./WhatsAppIcon";

/** Botão flutuante com mensagem pré-preenchida de acordo com a página. */
export function WhatsAppFloat() {
  const pathname = usePathname() ?? "/";
  if (pathname.startsWith("/assinar")) return null;
  return (
    <a
      href={whatsappUrl(whatsappMessageFor(pathname))}
      target="_blank"
      rel="noopener"
      aria-label="Falar com a Supporta no WhatsApp"
      data-track="whatsapp_click"
      data-track-origin={`flutuante:${pathname}`}
      className="fixed bottom-4 right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper ring-1 ring-line-dark transition-transform hover:scale-105 md:bottom-6 md:right-6"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
