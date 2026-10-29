
import About from "@/components/homepages/home3/About"
import Blog from "@/components/homepages/home3/Blog"
import CaseStudy from "@/components/homepages/home3/CaseStudy"
import Contact from "@/components/homepages/home3/Contact"
import Counter from "@/components/homepages/home3/Counter"
import Logo from "@/components/homepages/home3/Logo"
import Service from "@/components/homepages/home3/Service"
import Subscribe from "@/components/homepages/home3/Subscribe"
import Team from "@/components/homepages/home3/Team"
import Testimonial from "@/components/homepages/home3/Testimonial"
import Welcome from "@/components/homepages/home3/Welcome"
import Layout from "@/components/layout/Layout"
export default function Page() {

    return (
        <>

            <Layout headerStyle={3} footerStyle={3}>
                <Welcome />
                <CaseStudy />
                <Service />
                <About />
                <Counter />
                <Team />
                <Testimonial />
                <Blog />
                <Contact />
                <Logo />
                <Subscribe />
            </Layout>
        </>
    )
}