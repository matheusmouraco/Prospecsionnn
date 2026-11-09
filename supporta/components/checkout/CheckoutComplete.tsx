"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { getPlan, pricing, priceLabel } from "@/lib/plans";

/** Dispara o evento de conclusão uma vez e mostra o que foi pago. (O site já vem da conversa no WhatsApp: não há briefing.) */
export function CheckoutComplete() {
  const [label, setLabel] = useState("");
  const [test, setTest] = useState(false);
  const sent = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = getPlan(params.get("plano") ?? "");
    setTest(params.get("teste") === "1");
    const value = pricing.site;
    if (plan) setLabel(`Site profissional, ${priceLabel(pricing.site)} pago uma vez.`);
    const ref = params.get("ref") ?? "";
    if (plan && !sent.current) {
      sent.current = true;
      const key = `supporta-done-${ref}`;
      try {
        if (ref && sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, "1");
      } catch {}
      track("checkout_complete", { plan: plan.id, value, currency: "BRL", transaction_id: ref });
    }
  }, []);

  if (!label) return null;
  return (
    <div className="mt-6">
      <p className="inline-flex flex-wrap items-center gap-2 rounded-full bg-pink-light px-4 py-2 text-[15px] font-medium">
        {label}
        {test ? <span className="label-mono text-graphite">modo teste, nenhuma cobrança feita</span> : null}
      </p>
    </div>
  );
}
