"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { buttonClass } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { getPlan } from "@/lib/plans";

/** Dispara o evento de conclusão uma vez e mostra o plano assinado. */
export function CheckoutComplete() {
  const [label, setLabel] = useState("");
  const [test, setTest] = useState(false);
  const [briefing, setBriefing] = useState("");
  const sent = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = getPlan(params.get("plano") ?? "");
    setTest(params.get("teste") === "1");
    if (plan) setLabel(`Plano ${plan.name}, R$${plan.price}/mês.`);
    const ref = params.get("ref") ?? "";
    const t = params.get("t") ?? "";
    if (/^sup_[0-9a-f-]{36}$/.test(ref) && t) setBriefing(`/briefing?ref=${ref}&t=${encodeURIComponent(t)}`);
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
    <div className="mt-6">
      <p className="inline-flex flex-wrap items-center gap-2 rounded-full bg-pink-light px-4 py-2 text-[15px] font-medium">
        {label}
        {test ? <span className="label-mono text-graphite">modo teste, nenhuma cobrança feita</span> : null}
      </p>
      {briefing ? (
        <div className="mt-6">
          <Link href={briefing} className={buttonClass("primary", "lg")}>
            Preencher o briefing agora (10 minutos) <ArrowRight aria-hidden strokeWidth={1.75} className="h-4 w-4" />
          </Link>
          <p className="mt-2 text-sm text-graphite">O link também vai por e-mail assim que o pagamento for confirmado.</p>
        </div>
      ) : null}
    </div>
  );
}
