import BreadcumbTen from "~/sections/Service-Details/BreadcumbTen";
import Faq from "~/sections/Service-Details/Faq";
import ServiceDetails from "~/sections/Service-Details/ServiceDetails";
import HeaderOne from "~/sections/Common/Header/HeaderOne";
import Scroll from "~/sections/Common/Scroll";
import FooterTwo from "~/sections/Common/Footer/FooterTwoServiceDetails";
export default function ServiceDetailsPage() {
    return (
        <div style={{ overflow: 'hidden' }}>
            <HeaderOne />
            <BreadcumbTen />
            <ServiceDetails />
            <Faq />
            <FooterTwo />
            <Scroll />
        </div>
    );
}