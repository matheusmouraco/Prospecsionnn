import BreadcumbNine from "~/sections/Service/BreadcumbNine";
import Client from "~/sections/Service/Client";
import Contact from "~/sections/Service/Contact";
import Process from "~/sections/Service/Process";
import Service from "~/sections/Service/Service";
import HeaderOne from "~/sections/Common/Header/HeaderOne";
import FooterTwo from "~/sections/Common/Footer/FooterTwo";
import TestimonialTwo from "~/sections/Common/TestimonialTwo";
import Scroll from "~/sections/Common/Scroll";
export default function ServicePage() {
    return (
        <div style={{overflow: 'hidden'}}>
            <HeaderOne />
            <BreadcumbNine />
            <Service />
            <Process />
            <TestimonialTwo />
            <Client />
            <Contact />
            <FooterTwo />
            <Scroll />
        </div>
    );
}