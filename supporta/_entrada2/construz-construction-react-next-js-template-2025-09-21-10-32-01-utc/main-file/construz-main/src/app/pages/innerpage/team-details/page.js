import BreadcumbFourteen from "~/sections/Team-Details/BreadcumbFourteen";
import Contact from "~/sections/Team-Details/Contact";
import ServiceDetailsTwo from "~/sections/Team-Details/ServiceDetailsTwo";
import HeaderOne from "~/sections/Common/Header/HeaderOne";
import FooterTwo from "~/sections/Common/Footer/FooterTwo";
import Scroll from "~/sections/Common/Scroll";
export default function TeamDetailsPage() {
    return (
        <div style={{overflow: 'hidden'}}>
            <HeaderOne />
            <BreadcumbFourteen />
            <ServiceDetailsTwo />
            <Contact />
            <FooterTwo />
            <Scroll />
        </div>
    );
}