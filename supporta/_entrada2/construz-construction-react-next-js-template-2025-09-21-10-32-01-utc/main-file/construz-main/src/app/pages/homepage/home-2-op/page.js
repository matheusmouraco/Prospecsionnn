import About from "~/sections/Home-2/About";
import Blog from "~/sections/Home-2/Blog";
import Client from "~/sections/Home-2/Client";
import Contact from "~/sections/Home-2/Contact";
import Counter from "~/sections/Home-2/Counter";
import FAQ from "~/sections/Home-2/FAQ";
import Hero from "~/sections/Home-2/Hero";
import Portfolio from "~/sections/Home-2/Portfolio";
import Pricing from "~/sections/Home-2/Pricing";
import Process from "~/sections/Home-2/Process";
import Service from "~/sections/Home-2/Service";
import Testimonial from "~/sections/Home-2/Testimonial";
import Video from "~/sections/Home-2/Video";
import FooterThree from "~/sections/Common/Footer/FooterThree";
import HeaderOneOp from "~/sections/Common/HeaderOp/HeaderOneOp";
import Scroll from "~/sections/Common/Scroll";
export default function HomeTwo() {
  return (
    <div style={{ overflow: 'hidden' }}>
      <HeaderOneOp />
      <Hero />
      <About />
      <Service />
      <Process />
      <Video />
      <Counter />
      <Portfolio />
      <Testimonial />
      <Pricing />
      <FAQ />
      <Client />
      <Blog />
      <Contact />
      <FooterThree />
      <Scroll />
    </div>
  );
}
