import Contact from '@/components/Contact';
import Guides from '@/components/Guides';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Manifesto from '@/components/Manifesto';
import Marquee from '@/components/Marquee';
import Projects from '@/components/Projects';
import Services from '@/components/Services';

export default function Home() {
  return (
    <>
      <Guides />
      <Header />
      <main className="wrap relative z-[1]">
        <Hero />
        <Marquee />
        <Projects />
        <Manifesto />
        <Services />
        <Contact />
      </main>
    </>
  );
}
