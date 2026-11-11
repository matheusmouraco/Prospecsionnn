const links = [
  { href: "#projetos", label: "Projetos" },
  { href: "#processo", label: "Processo" },
  { href: "#atelie", label: "Ateliê" },
  { href: "#contato", label: "Contato" },
];

export function Header() {
  return (
    <header data-header className="site-header fixed inset-x-0 top-0 z-50 bg-paper gutter">
      <div className="flex h-18 items-center justify-between md:h-22">
        <a href="#topo" className="font-serif text-[1.4rem] leading-none tracking-[-0.01em]" aria-label="Atelier Vareda, voltar ao topo">
          Atelier <em className="italic">Vareda</em>
        </a>
        <nav aria-label="Seções" className="hidden items-center gap-11 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="eyebrow ulink">
              {l.label}
            </a>
          ))}
        </nav>
        <a href="#contato" className="eyebrow ulink md:hidden">
          Contato
        </a>
      </div>
    </header>
  );
}
