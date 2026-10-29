import HeaderThree from "~/sections/Common/Header/HeaderThree";
import About from "~/sections/Home-5/About";
import Award from "~/sections/Home-5/Award";
import Benefit from "~/sections/Home-5/Benefit";
import Blog from "~/sections/Home-5/Blog";
import CTA from "~/sections/Home-5/CTA";
import Client from "~/sections/Home-5/Client";
import Contact from "~/sections/Home-5/Contact";
import Hero from "~/sections/Home-5/Hero";
import Portfolio from "~/sections/Home-5/Portfolio";
import Testimonial from "~/sections/Home-5/Testimonial";
import WhyChoose from "~/sections/Home-5/WhyChoose";
import CounterTwo from "~/sections/Common/CounterTwo";
import Scroll from "~/sections/Common/Scroll";
import FooterFive from "~/sections/Common/Footer/FooterFive";
export default function HomeFive() {
    return (
        <div style={{ overflow: 'hidden' }}>
            <HeaderThree />
            <Hero />
            <About />
            <WhyChoose />
            <Benefit />
            <Testimonial />
            <Award />
            <Contact />
            <Portfolio />
            <CounterTwo />
            <Client />
            <Blog />
            <CTA />
            <FooterFive />
            <Scroll />
        </div>
    );
}
