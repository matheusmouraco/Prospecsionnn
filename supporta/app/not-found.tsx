import { Symbol } from "@/components/brand/Symbol";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <>
    <Header />
    <main id="conteudo">
    <section className="py-24 md:py-36">
      <div className="container-site">
        <Symbol className="h-16 w-16" />
        <p className="label-mono mt-8 text-graphite">Erro 404</p>
        <h1 className="mt-4 text-[clamp(2.5rem,7vw,5rem)] leading-[1] tracking-[-0.055em]">Essa página não existe.</h1>
        <p className="mt-5 max-w-xl text-lg text-graphite">Talvez o link tenha mudado. Comece pela página inicial ou veja os planos.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/" size="lg">Ir para o início</Button>
          <Button href="/planos" variant="outline" size="lg">Ver planos</Button>
        </div>
      </div>
    </section>
    </main>
    <Footer />
    </>
  );
}
