
import About from "@/components/homepages/home2/About"
import Blog from "@/components/homepages/home2/Blog"
import Contact from "@/components/homepages/home2/Contact"
import Counter from "@/components/homepages/home2/Counter"
import Logo from "@/components/homepages/home2/Logo"
import Service from "@/components/homepages/home2/Service"
import Subscribe from "@/components/homepages/home2/Subscribe"
import Team from "@/components/homepages/home2/Team"
import Testimonial from "@/components/homepages/home2/Testimonial"
import Welcome from "@/components/homepages/home2/Welcome"
import Works from "@/components/homepages/home2/Works"
import Layout from "@/components/layout/Layout"
export default function Page() {

    return (
        <>

            <Layout headerStyle={2} footerStyle={2}>
                <Welcome />
                <Logo />
                <About />
                <Service />
                <Works />
                <Counter />
                <Team />
                <Testimonial />
                <Blog />
                <Contact />
                <Subscribe />
            </Layout>
        </>
    )
}