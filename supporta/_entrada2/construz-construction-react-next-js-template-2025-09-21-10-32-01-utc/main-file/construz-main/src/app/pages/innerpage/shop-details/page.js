import BreadcumbTwelve from "~/sections/Shop-Details/BreadcumbTwelve";
import ProductDetails from "~/sections/Shop-Details/ProductDetails";
import HeaderOne from "~/sections/Common/Header/HeaderOne";
import FooterTwo from "~/sections/Common/Footer/FooterTwo";
import Scroll from "~/sections/Common/Scroll";
export default function ShopDetailsPage() {
    return (
        <div>
            <HeaderOne />
            <BreadcumbTwelve />
            <ProductDetails />
            <FooterTwo />
            <Scroll />
        </div>
    );
}