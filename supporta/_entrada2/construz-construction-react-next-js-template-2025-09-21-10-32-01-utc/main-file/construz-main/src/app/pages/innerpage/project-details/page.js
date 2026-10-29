import BreadcumbEight from "~/sections/Project-Details/BreadcumbEight";
import ContactSix from "~/sections/Project-Details/ContactSix";
import ProjectDetails from "~/sections/Project-Details/ProjectDetails";
import HeaderOne from "~/sections/Common/Header/HeaderOne";
import FooterTwo from "~/sections/Common/Footer/FooterTwo";
import Scroll from "~/sections/Common/Scroll";
export default function ProjectDetailsPage() {
    return (
        <div style={{overflow: 'hidden'}}>
            <HeaderOne />
            <BreadcumbEight />
            <ProjectDetails />
            <ContactSix />
            <FooterTwo />
            <Scroll />
        </div>
    );
}