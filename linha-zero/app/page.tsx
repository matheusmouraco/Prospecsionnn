import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { PlanToPhoto } from '@/components/PlanToPhoto';
import { Projects } from '@/components/Projects';
import { Process } from '@/components/Process';
import { Contact } from '@/components/Contact';
import { Motion } from '@/components/Motion';

export default function Page() {
  return (
    <>
      <a
        href="#projetos"
        className="eyebrow sr-only z-[60] bg-cyan px-4 py-3 text-night focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Pular para os projetos
      </a>
      <Header />
      <main>
        <Hero />
        <PlanToPhoto />
        <Projects />
        <Process />
        <Contact />
      </main>
      <Motion />
    </>
  );
}
