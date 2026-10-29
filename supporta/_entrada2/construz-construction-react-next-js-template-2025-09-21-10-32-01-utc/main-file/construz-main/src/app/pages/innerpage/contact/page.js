import BreadcumbSix from "~/sections/Contact/BreadcumbSix";
import ContactArea from "~/sections/Contact/ContactArea";
import ContactAreaTwo from "~/sections/Contact/ContactAreaTwo";
import ContactMap from "~/sections/Contact/ContactMap";
import HeaderOne from "~/sections/Common/Header/HeaderOne";
import FooterTwo from "~/sections/Common/Footer/FooterTwo";
import Scroll from "~/sections/Common/Scroll";
export default function ContactPage() {
  return (
    <div style={{overflow: "hidden"}}>
      <HeaderOne />
      <BreadcumbSix />
      <ContactArea />
      <ContactAreaTwo />
      <ContactMap />
      <FooterTwo />
      <Scroll />
    </div>
  );
}
