import { redirect } from "next/navigation";
import { botWhatsappUrl } from "@/lib/site";

// O site agora é criado pela conversa no WhatsApp (o robô pede tudo por lá). Links antigos para /criar vão direto para ele.
export default function CriarPage() {
  redirect(botWhatsappUrl());
}
