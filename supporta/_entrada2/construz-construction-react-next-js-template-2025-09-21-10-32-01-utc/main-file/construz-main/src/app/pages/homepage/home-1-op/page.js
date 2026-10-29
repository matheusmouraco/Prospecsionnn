
import About from "~/sections/Home-1/About";
import Blog from "~/sections/Home-1/Blog";
import Client from "~/sections/Home-1/Client";
import Cta from "~/sections/Home-1/Cta";
import Hero from "~/sections/Home-1/Hero";
import Portfolio from "~/sections/Home-1/Portfolio";
import Process from "~/sections/Home-1/Process";
import Service from "~/sections/Home-1/Service";
import Team from "~/sections/Home-1/Team";
import Testimonial from "~/sections/Home-1/Testimonial";
import WhyChoose from "~/sections/Home-1/WhyChoose";
import FooterTwo from "~/sections/Common/Footer/FooterTwo";
import CounterOne from "~/sections/Common/Counter/CounterOne";
import HeaderOneOp from "~/sections/Common/HeaderOp/HeaderOneOp";
import Contact from "~/sections/Home-1-op/Contact";
import Scroll from "~/sections/Common/Scroll";

export default function IndexPage() {
  return (
    <div style={{ overflow: 'hidden' }}>
      <HeaderOneOp />
      <Hero />
      <About />
      <Service />
      <Cta />
      <WhyChoose />
      <Process />
      <Portfolio />
      <CounterOne />
      <Testimonial />
      <Team />
      <Client />
      <Blog />
      <Contact />
      <FooterTwo />
      <Scroll />
    </div>
  );
}
