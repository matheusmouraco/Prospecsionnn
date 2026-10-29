
import About from "@/components/homepages/home5/About"
import Agants from "@/components/homepages/home5/Agants"
import Blog from "@/components/homepages/home5/Blog"
import CaseStudy from "@/components/homepages/home5/CaseStudy"
import Contact from "@/components/homepages/home5/Contact"
import Counter from "@/components/homepages/home5/Counter"
import HowItWork from "@/components/homepages/home5/HowItWork"
import Service from "@/components/homepages/home5/Service"
import Subscribe from "@/components/homepages/home5/Subscribe"
import Testimaonial from "@/components/homepages/home5/Testimaonial"
import Welcome from "@/components/homepages/home5/Welcome"
import Layout from "@/components/layout/Layout"
export default function Page() {

    return (
        <>
            <Layout headerStyle={5} footerStyle={5}>
                <Welcome />
                <Counter />
                <About />
                <Service />
                <HowItWork />
                <Agants />
                <Testimaonial />
                <CaseStudy />
                <Contact />
                <Blog />
                <Subscribe />
            </Layout>
        </>
    )
}