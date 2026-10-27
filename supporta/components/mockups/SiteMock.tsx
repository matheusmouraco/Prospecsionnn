import type { CSSProperties } from "react";
import type { Segment } from "@/lib/segments";

type Variant = "desktop" | "mobile";

/**
 * Modelo de site desenhado em HTML/CSS (zero imagem, zero peso extra).
 * As medidas usam cqw, então o modelo escala junto com a moldura.
 */
export function SiteMock({ mock, variant }: { mock: Segment["mock"]; variant: Variant }) {
  const d = variant === "desktop";
  const u = (desktop: number, mobile: number) => `${d ? desktop : mobile}cqw`;
  const heading: CSSProperties = {
    fontFamily: mock.serif ? "Georgia, 'Times New Roman', serif" : "inherit",
    fontWeight: mock.serif ? 500 : 600,
    letterSpacing: mock.serif ? "-0.02em" : "-0.045em",
    lineHeight: 1.05,
  };
  const pad = u(5, 6);

  return (
    <div style={{ background: mock.surface, color: mock.text, fontSize: u(1.55, 4) }} aria-hidden>
      {/* Navegação */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: `${u(2, 4)} ${pad}` }}>
        <span style={{ ...heading, fontSize: u(1.9, 4.6) }}>{mock.business}</span>
        {d ? (
          <span style={{ display: "flex", gap: u(2.4, 0), opacity: 0.75 }}>
            {mock.services.map((s) => (
              <span key={s}>{s}</span>
            ))}
            <span>Contato</span>
          </span>
        ) : (
          <span style={{ display: "grid", gap: "1.2cqw" }}>
            <span style={{ width: "6cqw", height: "0.9cqw", background: mock.text, borderRadius: 9 }} />
            <span style={{ width: "6cqw", height: "0.9cqw", background: mock.text, borderRadius: 9 }} />
          </span>
        )}
      </div>

      {/* Hero */}
      <div style={{ display: "grid", gridTemplateColumns: d ? "1.05fr 1fr" : "1fr", gap: u(3.5, 5), padding: `${u(4, 5)} ${pad} ${u(5, 7)}`, alignItems: "center" }}>
        <div>
          <div style={{ textTransform: "uppercase", letterSpacing: "0.12em", fontSize: u(1.05, 2.8), opacity: 0.7 }}>{mock.kicker}</div>
          <div style={{ ...heading, fontSize: u(4.6, 10), marginTop: u(1.4, 3) }}>{mock.headline}</div>
          <div style={{ marginTop: u(1.6, 3.5), opacity: 0.75, maxWidth: "36ch" }}>{mock.about}</div>
          <div style={{ display: "flex", gap: u(1.2, 2.5), marginTop: u(2.6, 5) }}>
            <span style={{ background: mock.accent, color: "#fff", borderRadius: 999, padding: `${u(1, 2.6)} ${u(2.2, 5)}`, fontWeight: 600 }}>{mock.cta}</span>
            {d ? <span style={{ border: `1px solid ${mock.text}33`, borderRadius: 999, padding: `${u(1, 2.6)} ${u(2.2, 5)}` }}>WhatsApp</span> : null}
          </div>
        </div>
        <Visual accent={mock.accent} text={mock.text} ratio={d ? "4 / 3.4" : "4 / 3"} />
      </div>

      {/* Serviços */}
      <div style={{ background: "#ffffff", padding: `${u(5, 8)} ${pad}` }}>
        <div style={{ ...heading, fontSize: u(2.8, 7) }}>Serviços</div>
        <div style={{ display: "grid", gridTemplateColumns: d ? "repeat(3, 1fr)" : "1fr", gap: u(1.6, 3), marginTop: u(2.4, 4.5) }}>
          {mock.services.map((s, i) => (
            <div key={s} style={{ border: `1px solid ${mock.text}1f`, borderRadius: u(1.4, 4), padding: u(2, 4.5) }}>
              <div style={{ width: u(3.2, 8), height: u(3.2, 8), borderRadius: 999, background: i === 0 ? mock.accent : `${mock.accent}33` }} />
              <div style={{ fontWeight: 600, marginTop: u(1.6, 3) }}>{s}</div>
              <div style={{ display: "grid", gap: u(0.7, 1.6), marginTop: u(1, 2.2) }}>
                <Line w="92%" c={mock.text} h={u(0.7, 1.6)} />
                <Line w="70%" c={mock.text} h={u(0.7, 1.6)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sobre */}
      <div style={{ display: "grid", gridTemplateColumns: d ? "1fr 1.1fr" : "1fr", gap: u(3.5, 5), padding: `${u(5, 8)} ${pad}`, alignItems: "center" }}>
        <Visual accent={mock.accent} text={mock.text} ratio="5 / 4" alt />
        <div>
          <div style={{ ...heading, fontSize: u(2.8, 7) }}>Sobre nós</div>
          <div style={{ display: "grid", gap: u(0.8, 1.8), marginTop: u(2, 4) }}>
            <Line w="100%" c={mock.text} h={u(0.75, 1.7)} />
            <Line w="94%" c={mock.text} h={u(0.75, 1.7)} />
            <Line w="82%" c={mock.text} h={u(0.75, 1.7)} />
            <Line w="60%" c={mock.text} h={u(0.75, 1.7)} />
          </div>
        </div>
      </div>

      {/* Contato */}
      <div style={{ background: mock.text, color: mock.surface, padding: `${u(5, 8)} ${pad}`, display: "grid", gridTemplateColumns: d ? "1fr 1fr" : "1fr", gap: u(3, 5) }}>
        <div>
          <div style={{ ...heading, fontSize: u(2.8, 7) }}>Vamos conversar?</div>
          <div style={{ marginTop: u(1.6, 3), opacity: 0.75 }}>Atendimento pelo WhatsApp</div>
          <span style={{ display: "inline-block", marginTop: u(2.2, 4.5), background: mock.surface, color: mock.text, borderRadius: 999, padding: `${u(1, 2.6)} ${u(2.2, 5)}`, fontWeight: 600 }}>{mock.cta}</span>
        </div>
        <div style={{ borderRadius: u(1.4, 4), background: `${mock.surface}1f`, aspectRatio: "16 / 9", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${mock.surface}14 1px, transparent 1px), linear-gradient(90deg, ${mock.surface}14 1px, transparent 1px)`, backgroundSize: "12% 18%" }} />
          <div style={{ position: "absolute", left: "48%", top: "38%", width: u(2.6, 6), height: u(2.6, 6), borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)", background: mock.surface }} />
        </div>
      </div>
      <div style={{ background: mock.text, color: mock.surface, opacity: 0.92, padding: `${u(2, 4)} ${pad}`, fontSize: u(1.1, 2.8), borderTop: `1px solid ${mock.surface}22` }}>
        © {mock.business}
      </div>
    </div>
  );
}

function Line({ w, c, h }: { w: string; c: string; h: string }) {
  return <span style={{ display: "block", width: w, height: h, borderRadius: 99, background: `${c}1f` }} />;
}

/** Bloco visual abstrato no lugar de foto: formas sólidas com as cores do modelo. */
function Visual({ accent, text, ratio, alt }: { accent: string; text: string; ratio: string; alt?: boolean }) {
  return (
    <div style={{ aspectRatio: ratio, borderRadius: "2.2cqw", background: alt ? `${accent}26` : accent, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "12%", bottom: "-18%", width: "58%", aspectRatio: "1", borderRadius: "50% 50% 0 0", background: alt ? `${accent}55` : `${text}40` }} />
      <div style={{ position: "absolute", right: "10%", top: "14%", width: "26%", aspectRatio: "1", borderRadius: 999, background: alt ? accent : "#ffffff40" }} />
      <div style={{ position: "absolute", right: "8%", bottom: "12%", width: "38%", height: "9%", borderRadius: 999, background: alt ? `${text}33` : "#ffffff66" }} />
    </div>
  );
}
