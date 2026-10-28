import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export function Breadcrumbs({ items, tone = "light" }: { items: { name: string; path: string }[]; tone?: "light" | "dark" }) {
  const strong = tone === "dark" ? "text-paper" : "text-ink";
  const hover = tone === "dark" ? "hover:text-paper" : "hover:text-ink";
  return (
    <>
      <nav aria-label="Você está em" className={`label-mono ${tone === "dark" ? "text-mist" : "text-graphite"}`}>
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className={hover}>Início</Link>
          </li>
          {items.map((item, i) => (
            <li key={item.path} className="flex items-center gap-2">
              <span aria-hidden>/</span>
              {i === items.length - 1 ? (
                <span aria-current="page" className={strong}>{item.name}</span>
              ) : (
                <Link href={item.path} className={hover}>{item.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(items)} />
    </>
  );
}
