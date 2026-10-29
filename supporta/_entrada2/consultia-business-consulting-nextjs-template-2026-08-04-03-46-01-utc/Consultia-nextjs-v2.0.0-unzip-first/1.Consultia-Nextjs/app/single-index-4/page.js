
import About from "@/components/homepages/home4/About"
import Blog from "@/components/homepages/home4/Blog"
import Border from "@/components/homepages/home4/Border"
import Contact from "@/components/homepages/home4/Contact"
import Counters from "@/components/homepages/home4/Counters"
import Faqs from "@/components/homepages/home4/Faqs"
import Logo from "@/components/homepages/home4/Logo"
import Pricing from "@/components/homepages/home4/Pricing"
import Service from "@/components/homepages/home4/Service"
import Team from "@/components/homepages/home4/Team"
import Testimonial from "@/components/homepages/home4/Testimonial"
import Welcome from "@/components/homepages/home4/Welcome"
import Layout from "@/components/layout/Layout"
export default function Page() {

    return (
        <>

            <Layout headerStyle={4} footerStyle={4}>
                <Welcome />
                <About />
                <Border />
                <Counters />
                <Service />
                <Faqs />
                <Testimonial />
                <Team />
                <Pricing />
                <Blog />
                <Contact />
                <Logo />
            </Layout>
        </>
    )
}