
import About from "@/components/homepages/home6/About"
import Brand from "@/components/homepages/home6/Brand"
import Contact from "@/components/homepages/home6/Contact"
import Customers from "@/components/homepages/home6/Customers"
import Experience from "@/components/homepages/home6/Experience"
import HowItWork from "@/components/homepages/home6/HowItWork"
import Resive from "@/components/homepages/home6/Resive"
import Service from "@/components/homepages/home6/Service"
import Welcome from "@/components/homepages/home6/Welcome"
import Layout from "@/components/layout/Layout"
export default function Page() {

    return (
        <>

            <Layout headerStyle={6} footerStyle={1}>
                <Welcome />
                <Brand />
                <About />
                <HowItWork />
                <Resive />
                <Service />
                <Experience />
                <Customers />
                <Contact />
            </Layout>
        </>
    )
}