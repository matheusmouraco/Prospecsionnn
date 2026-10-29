import { JsonLd } from "./JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

/** Trilha de navegação só para Google e IAs (dados estruturados). Na tela ela não aparece, a pedido do Moura. */
export function Breadcrumbs({ items }: { items: { name: string; path: string }[]; tone?: "light" | "dark" }) {
  return <JsonLd data={breadcrumbSchema(items)} />;
}
