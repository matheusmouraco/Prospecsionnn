import { z } from "zod";
import { INPUT_TYPES, ROOMS } from "@/config/options";
import { isDemo } from "@/lib/ai/providers";
import { callGemini } from "@/lib/ai/providers/gemini-client";
import { serverEnv } from "@/lib/server/env";
import { parseDataUrl } from "@/lib/server/data-url";
import { hasAccess } from "@/lib/server/guard";

export const runtime = "nodejs";
export const maxDuration = 30;

const Out = z.object({
  tipo: z.enum(INPUT_TYPES.map((t) => t.id) as [string, ...string[]]).nullable().catch(null),
  ambiente: z.enum(ROOMS.map((r) => r.id) as [string, ...string[]]).nullable().catch(null),
  vazio: z.boolean().catch(false),
});

/** Classifies the uploaded image (3D, photo, sketch, facade) and guesses the room. */
export async function POST(req: Request) {
  if (!(await hasAccess())) return Response.json({ error: "Digite a senha de acesso.", code: "acesso" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as { image?: string } | null;
  if (!body?.image) return Response.json({ error: "Sem imagem" }, { status: 400 });
  if (isDemo()) return Response.json({ tipo: null, ambiente: null, vazio: false, demo: true });

  try {
    const img = parseDataUrl(body.image);
    const out = await callGemini({
      model: serverEnv().modelText,
      timeoutMs: 25_000,
      parts: [
        { type: "image", ...img },
        {
          type: "text",
          text: `Classify this architecture/interior image. Answer ONLY a JSON object, no markdown:
{"tipo": one of ${JSON.stringify(INPUT_TYPES.map((t) => t.id))} ("3d" = screenshot of a 3D model from SketchUp/Promob/Revit/Lumion or any CGI with flat materials; "foto" = real photo of an interior; "croqui" = hand sketch, line drawing or floor plan; "fachada" = exterior/facade photo or 3D),
 "ambiente": one of ${JSON.stringify(ROOMS.map((r) => r.id))} or null,
 "vazio": true if the space is empty, unfinished or under construction}`,
        },
      ],
    });
    const json = JSON.parse(out.text.match(/\{[\s\S]*\}/)?.[0] ?? "{}");
    return Response.json(Out.parse(json));
  } catch (err) {
    console.error("[detect]", err);
    // Detection is a convenience: the user just picks manually.
    return Response.json({ tipo: null, ambiente: null, vazio: false });
  }
}
