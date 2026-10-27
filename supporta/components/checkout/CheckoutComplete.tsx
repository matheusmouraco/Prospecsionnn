"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { getPlan } from "@/lib/plans";

/** Dispara o evento de conclusão uma vez e mostra o plano assinado. */
export function CheckoutComplete() {
  const [label, setLabel] = useState("");
  const [test, setTest] = useState(false);
  const sent = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = getPlan(params.get("plano") ?? "");
    setTest(params.get("teste") === "1");
    if (plan) setLabel(`Plano ${plan.name}, R$${plan.price}/mês.`);
    const ref = params.get("ref") ?? "";
    if (plan && !sent.current) {
      sent.current = true;
      const key = `supporta-done-${ref}`;
      try {
        if (ref && sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, "1");
      } catch {}
      track("checkout_complete", { plan: plan.id, value: plan.price, currency: "BRL", transaction_id: ref });
    }
  }, []);

  if (!label) return null;
  return (
    <p className="mt-6 inline-flex flex-wrap items-center gap-2 rounded-full bg-pink-light px-4 py-2 text-[15px] font-medium">
      {label}
      {test ? <span className="label-mono text-graphite">modo teste, nenhuma cobrança feita</span> : null}
    </p>
  );
}
