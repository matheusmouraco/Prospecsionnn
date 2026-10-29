import BreadcumbFive from "~/sections/Checkout/BreadcumbFive";
import CheckoutArea from "~/sections/Checkout/CheckoutArea";
import HeaderOne from "~/sections/Common/Header/HeaderOne";
import FooterTwo from "~/sections/Common/Footer/FooterTwo";
import Scroll from "~/sections/Common/Scroll";
export default function CheckoutPage() {
  return (
    <>
      <HeaderOne />
      <BreadcumbFive />
      <CheckoutArea />
      <FooterTwo />
      <Scroll />
    </>
  );
}
