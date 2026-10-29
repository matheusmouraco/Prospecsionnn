
import About from "~/sections/Home-3/About";
import CTA from "~/sections/Home-3/CTA";
import Client from "~/sections/Home-3/Client";
import Contact from "~/sections/Home-3/Contact";
import Counter from "~/sections/Home-3/Counter";
import Hero from "~/sections/Home-3/Hero";
import Portfolio from "~/sections/Home-3/Portfolio";
import Process from "~/sections/Home-3/Process";
import Team from "~/sections/Home-3/Team";
import Testimonial from "~/sections/Home-3/Testimonial";
import WhyChoose from "~/sections/Home-3/WhyChoose";
import FooterTwo from "~/sections/Common/Footer/FooterTwo";
import Blog from "~/sections/Home-2/Blog";
import HeaderTwoOp from "~/sections/Common/HeaderOp/HeaderTwoOp";
import Scroll from "~/sections/Common/Scroll";

export default function HomeThree() {
    return (
        <div style={{ overflow: 'hidden' }}>
            <HeaderTwoOp />
            <Hero />
            <About />
            <WhyChoose />
            <Process />
            <Portfolio />
            <Counter />
            <Contact />
            <Testimonial />
            <Client />
            <Team />
            <CTA />
            <Blog />
            <FooterTwo />
            <Scroll />
        </div>
    );
}
