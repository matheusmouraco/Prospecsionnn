import BreadcumbFifteen from "~/sections/Wishlist/BreadcumbFifteen";
import Wishlist from "~/sections/Wishlist/Wishlist";
import HeaderOne from "~/sections/Common/Header/HeaderOne";
import FooterTwo from "~/sections/Common/Footer/FooterTwo";
import Scroll from "~/sections/Common/Scroll";
export default function WishlistPage() {
    return (
        <div>
            <HeaderOne />
            <BreadcumbFifteen />
            <Wishlist />
            <FooterTwo />
            <Scroll />
        </div>
    );
}