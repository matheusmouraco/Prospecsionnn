import BreadcumbSeven from "~/sections/Project/BreadcumbSeven";
import Project from "~/sections/Project/Project";
import HeaderOne from "~/sections/Common/Header/HeaderOne";
import FooterTwo from "~/sections/Common/Footer/FooterTwo";
import Scroll from "~/sections/Common/Scroll";
export default function ProjectPage() {
    return (
        <div>
            <HeaderOne />
            <BreadcumbSeven />
            <Project />
            <FooterTwo />
            <Scroll />
        </div>
    );
}