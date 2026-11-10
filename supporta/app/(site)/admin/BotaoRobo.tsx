import { alternarRobo } from "./actions";

/** Um clique: assume a conversa (o robô para) ou devolve ao robô na etapa em que ele estava. */
export function BotaoRobo({ telefone, etapa, grande = false }: { telefone: string | null; etapa: string | null; grande?: boolean }) {
  if (!telefone || !etapa) return null;
  const parado = etapa === "humano";
  const tam = grande ? "px-4 py-2 text-sm" : "px-3 py-1 text-xs";
  return (
    <form action={alternarRobo} className="inline">
      <input type="hidden" name="telefone" value={telefone} />
      <input type="hidden" name="acao" value={parado ? "devolver" : "assumir"} />
      <button
        className={`whitespace-nowrap rounded-full font-medium ${tam} ${parado ? "bg-ok text-white" : "border border-ink text-ink"}`}
        title={parado ? "O robô volta a responder de onde parou" : "O robô para e você responde pelo WhatsApp"}
      >
        {parado ? "Devolver ao robô" : "Assumir"}
      </button>
    </form>
  );
}
