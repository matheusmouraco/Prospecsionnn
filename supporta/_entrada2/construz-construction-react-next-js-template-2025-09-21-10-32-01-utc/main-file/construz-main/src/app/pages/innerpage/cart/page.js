import BreadcumbFour from "~/sections/Cart/BreadcumbFour";
import CartArea from "~/sections/Cart/CartArea";
import HeaderOne from "~/sections/Common/Header/HeaderOne";
import FooterTwo from "~/sections/Common/Footer/FooterTwo";
import Scroll from "~/sections/Common/Scroll";
export default function CartPage() {
  return (
    <div>
      <HeaderOne />
      <BreadcumbFour />
      <CartArea />
      <FooterTwo />
      <Scroll />
    </div>
  );
}
