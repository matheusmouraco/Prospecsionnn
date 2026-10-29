import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import Service from "@/components/pages/service/service";
import Banner from "@/components/ui/sections/banner";

export default function ServicePage() {
    return (
        <>
            <Header />
            <Banner title="OUR SERVICES" pathName="Our Services" />
            <Service />
            <Footer />
        </>
    );
}
