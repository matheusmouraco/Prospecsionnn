import About from "~/sections/Home-4/About";
import CTA from "~/sections/Home-4/CTA";
import Hero from "~/sections/Home-4/Hero";
import Portfolio from "~/sections/Home-4/Portfolio";
import Service from "~/sections/Home-4/Service";
import ServiceTwo from "~/sections/Home-4/ServiceTwo";
import Testimonial from "~/sections/Home-4/Testimonial";
import Video from "~/sections/Home-4/Video";
import WhyChoose from "~/sections/Home-4/WhyChoose";
import ClientTwo from "~/sections/Common/ClientTwo";
import HeaderTwoOp from "~/sections/Common/HeaderOp/HeaderTwoOp";
import Scroll from "~/sections/Common/Scroll";
import FooterFour from "~/sections/Common/Footer/FooterFour";

export default function HomeFour() {
    return ( typeof window !== undefined &&
        <div style={{ overflow: 'hidden' }}>
            <HeaderTwoOp />
            <Hero />
            <Service />
            <About />
            <ServiceTwo />
            <WhyChoose />
            <Video />
            <Portfolio />
            <Testimonial />
            <CTA />
            <ClientTwo />
            <FooterFour />
            <Scroll />
        </div>
    );
}
