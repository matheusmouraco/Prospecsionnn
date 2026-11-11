import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import Projects from "@/components/Projects";
import Numbers from "@/components/Numbers";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Preloader />
      <SmoothScroll />
      <Cursor />
      <Header />
      <main>
        <Hero />
        <Manifesto />
        <Projects />
        <Numbers />
        <Contact />
      </main>
    </>
  );
}
