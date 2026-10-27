"use client";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// Eventos do funil. GA4 recebe o nome interno; o Meta Pixel recebe o evento padrão equivalente.
const metaEvents: Record<string, string> = {
  plan_click: "ViewContent",
  begin_checkout: "InitiateCheckout",
  checkout_complete: "Subscribe",
  diagnostic_submit: "Lead",
  whatsapp_click: "Contact",
};

/** Dispara evento só se os scripts já foram carregados (o que só acontece depois do consentimento). */
export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
  const meta = metaEvents[event];
  if (meta) window.fbq?.("track", meta, params);
  else window.fbq?.("trackCustom", event, params);
}

export const CONSENT_KEY = "supporta-consent";
export const CONSENT_EVENT = "supporta:consent";

export function readConsent(): "granted" | "denied" | null {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function saveConsent(value: "granted" | "denied") {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Navegação privada: segue só na sessão atual.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}
