import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { aiDisclaimer } from "@/components/ui/AiLogos";
import { segments } from "@/lib/segments";
import { site, whatsappUrl } from "@/lib/site";

const columns = [
  {
    title: "Supporta",
    links: [
      { href: "/planos", label: "Planos" },
      { href: "/modelos", label: "Modelos" },
      { href: "/#como-funciona", label: "Como funciona" },
      { href: "/diagnostico", label: "Diagnóstico grátis" },
      { href: "/quanto-custa-um-site", label: "Quanto custa um site" },
      { href: "/comparativo", label: "Comparativo" },
      { href: "/sobre", label: "Sobre" },
      { href: "/contato", label: "Contato" },
    ],
  },
  {
    title: "Aprenda",
    links: [
      { href: "/geo", label: "O que é GEO" },
      { href: "/blog", label: "Blog" },
      { href: "/perguntas-frequentes", label: "Perguntas frequentes" },
      { href: "/glossario", label: "Glossário" },
      { href: "/cliente", label: "Área do cliente" },
      { href: "/llms.txt", label: "llms.txt" },
    ],
  },
  {
    title: "Modelos",
    links: segments.map((s) => ({ href: `/modelos/${s.slug}`, label: s.title })),
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-paper">
      <div className="container-site py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.3fr_2fr]">
          <div>
            <Logo tone="dark" />
            <p className="mt-5 max-w-sm text-mist">{site.signature}</p>
            <ul className="mt-8 space-y-2 text-[15px]">
              <li>
                <span className="label-mono mr-2 text-mist">WhatsApp</span>
                <a href={whatsappUrl("Oi! Vim pelo site da Supporta.")} target="_blank" rel="noopener" className="link" data-track="whatsapp_click" data-track-origin="rodape">
                  {site.whatsapp}
                </a>
              </li>
              <li>
                <span className="label-mono mr-2 text-mist">E-mail</span>
                <a href={`mailto:${site.email}`} className="link">{site.email}</a>
              </li>
            </ul>
          </div>
          <div className="grid gap-10 sm:grid-cols-3">
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <p className="label-mono text-mist">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-[15px] text-paper/90 hover:text-paper hover:underline">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-line-dark pt-8 text-sm text-mist md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.razaoSocial}. CNPJ {site.cnpj}. {site.address.street}, {site.address.city}/{site.address.state}.
            <span className="mt-1 block text-xs">{aiDisclaimer}</span>
          </p>
          <ul className="flex gap-6">
            <li><Link href="/termos" className="hover:text-paper">Termos de Uso</Link></li>
            <li><Link href="/privacidade" className="hover:text-paper">Privacidade</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
