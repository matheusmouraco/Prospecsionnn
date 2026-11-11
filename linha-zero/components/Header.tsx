import { Logo } from './drawings/Logo';
import { whatsappUrl } from '@/lib/site';

// mix-blend-difference keeps the header legible on both the night and the paper sections.
export function Header() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-5 sm:px-8 lg:px-12">
        <a href="#topo" className="pointer-events-auto" aria-label="Linha Zero Arquitetura, voltar ao início">
          <Logo />
        </a>
        <nav aria-label="Principal" className="pointer-events-auto">
          <ul className="eyebrow flex items-center gap-5 sm:gap-8">
            <li className="hidden md:block">
              <a href="#projetos" className="opacity-70 transition-opacity hover:opacity-100">
                Projetos
              </a>
            </li>
            <li className="hidden md:block">
              <a href="#processo" className="opacity-70 transition-opacity hover:opacity-100">
                Processo
              </a>
            </li>
            <li>
              <a href={whatsappUrl} target="_blank" rel="noopener" className="group inline-flex flex-col gap-1">
                <span>Fale com a gente</span>
                <span className="cta-line block h-px w-full bg-current" />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
