
import CounterUp from "@/components/elements/CounterUp"
import Faq1 from "@/components/elements/Faq1"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
export default function Page() {

    return (
        <>

            <Layout headerStyle={1} footerStyle={1} breadcrumbTitle="ABOUT CONSULTIA">
                <div>
                    <div className="about-inner bg-28 section-padding">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <div className="mr50">
                                        <div className="heading2 no-margin-heading">
                                            <small className="heading-top inner-heading-top"><img src="/assets/img/icons/hands.svg" alt="" />Our stories
                                                how we establish our company.</small>
                                            <h2>
                                                We Handle The Most Tedious Bookkeeping Tasks of Your Business
                                                Operations.
                                            </h2>
                                            <p>
                                                Imagine building some of the most sophisticated
                                                hardware-driven technologies in the world – spacecraft, drones
                                                or autonomous vehicles. Then imagine being unable to easily
                                                share your data to different teams, having to use clunky user
                                                interfaces, and relying on a single person manually inputting
                                                data.
                                            </p>
                                            <p>
                                                Excel spreadsheet to bottom line your project. To solve this
                                                problem, Violet Labs is developing a cloud-based platform that
                                                can act as a single source of truth, collecting the data from
                                                all the tools and making them easily accessible across teams.
                                                Hoag likened the product to Zapier, which uses APIs to talk to
                                                different tools.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="about-bg-main-img position-relative ml50">
                                        <img src="/assets/img/about/about23.png" alt="" />
                                        <div className="corner-right-bottom-shape2 position-absolute">
                                            <img src="/assets/img/shapes/shape-right-bottom2.png" alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*=====About end=======*/}
                    {/*=====About start=======*/}
                    <div className="about-inner padding-bottom bg-29">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <div className="about-bg-main-img position-relative mr50">
                                        <img src="/assets/img/about/about24.png" alt="" />
                                        <div className="corner-right-bottom-shape2 position-absolute">
                                            <img src="/assets/img/shapes/shape-right-bottom2.png" alt="" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="ml50">
                                        <div className="heading2 no-margin-heading">
                                            <small className="heading-top inner-heading-top"><img src="/assets/img/icons/hands.svg" alt="" />Our Vision
                                                help us to improve our quality.</small>
                                            <h2>
                                                We Handle The Most Tedious Bookkeeping Tasks of Your Business
                                                Operations.
                                            </h2>
                                            <p>
                                                Imagine building some of the most sophisticated
                                                hardware-driven technologies in the world – spacecraft, drones
                                                or autonomous vehicles. Then imagine being unable to easily
                                                share your data to different teams, having to use clunky user
                                                interfaces, and relying on a single person manually inputting
                                                data.
                                            </p>
                                            <p>
                                                Excel spreadsheet to bottom line your project. To solve this
                                                problem, Violet Labs is developing a cloud-based platform that
                                                can act as a single source of truth, collecting the data from
                                                all the tools and making them easily accessible across teams.
                                                Hoag likened the product to Zapier, which uses APIs to talk to
                                                different tools.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*=====About end=======*/}
                    {/*=====Counter start=======*/}
                    <div className="counter-4 inner-counter-4 inner-font-1 section-padding" style={{ background: 'url(assets/img/bg/bg-12.png) no-repeat', backgroundPosition: 'center', backgroundSize: 'cover' }}>
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8 m-auto">
                                    <div className="heading2 white-heading text-center">
                                        <small className="heading-top inner-heading-top"><img src="/assets/img/icons/hands.svg" alt="" />Our Success in
                                            Numbers</small>
                                        <h2>Why Consultia advisor is the best?</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="row counters-3">
                                <div className="col-lg-3 col-6">
                                    <div className="single-couter-3">
                                        <h3><CounterUp count={900} />+</h3>
                                        <p>Number of Families</p>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-6">
                                    <div className="single-couter-3">
                                        <h3>$<CounterUp count={95} />B</h3>
                                        <p>Assets Managed</p>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-6">
                                    <div className="single-couter-3">
                                        <h3><CounterUp count={40} />+</h3>
                                        <p>Full Time Advisors</p>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-6">
                                    <div className="single-couter-3">
                                        <h3><CounterUp count={30} />+</h3>
                                        <p>Employess</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*=====Counter end=======*/}
                    {/*=====Service start=======*/}
                    <div className="service-inner-1 section-padding2 inner-font-1">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8 m-auto">
                                    <div className="heading2 text-center">
                                        <small className="heading-top inner-heading-top"><img src="/assets/img/icons/hands.svg" alt="" />Our Success in
                                            Numbers</small>
                                        <h2>Our team of financial professionals.</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 col-lg-4">
                                    <div className="single-service text-center">
                                        <div className="service-icon bg-24">
                                            <img src="/assets/img/icons/service-11.png" alt="" />
                                        </div>
                                        <h3>We seek clarity</h3>
                                        <p>
                                            See whether your time-off schedule overlaps with a teammate’s
                                            while applying for or reviewing a time-off request.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-4">
                                    <div className="single-service text-center">
                                        <div className="service-icon bg-24">
                                            <img src="/assets/img/icons/service-12.png" alt="" />
                                        </div>
                                        <h3>We Improve</h3>
                                        <p>
                                            Get notified in any Slack channel about who is on break, the
                                            next public holiday, and who to wish a happy birthday.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-4">
                                    <div className="single-service text-center">
                                        <div className="service-icon bg-24">
                                            <img src="/assets/img/icons/service-13.png" alt="" />
                                        </div>
                                        <h3>We act with empathy</h3>
                                        <p>
                                            Get notified in any Slack channel about who is on break, the
                                            next public holiday, and who to wish a happy birthday.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-4">
                                    <div className="single-service text-center">
                                        <div className="service-icon bg-24">
                                            <img src="/assets/img/icons/service-14.png" alt="" />
                                        </div>
                                        <h3>We are champion</h3>
                                        <p>
                                            See whether your time-off schedule overlaps with a teammate’s
                                            while applying for or reviewing a time-off request.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-4">
                                    <div className="single-service text-center">
                                        <div className="service-icon bg-24">
                                            <img src="/assets/img/icons/service-15.png" alt="" />
                                        </div>
                                        <h3>Our transparency</h3>
                                        <p>
                                            Get notified in any Slack channel about who is on break, the
                                            next public holiday, and who to wish a happy birthday.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-4">
                                    <div className="single-service text-center">
                                        <div className="service-icon bg-24">
                                            <img src="/assets/img/icons/service-16.png" alt="" />
                                        </div>
                                        <h3>We work together</h3>
                                        <p>
                                            Get notified in any Slack channel about who is on break, the
                                            next public holiday, and who to wish a happy birthday.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*=====Service end=======*/}
                    {/*=====Team start=======*/}
                    <div className="team-2 padding-bottom2 inner-font-1">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8 m-auto">
                                    <div className="heading2 text-center">
                                        <small className="heading-top inner-heading-top"><img src="/assets/img/icons/hands.svg" alt="" />Our Success in
                                            Numbers</small>
                                        <h2>Our team of financial professionals.</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-3 col-md-6">
                                    <div className="single-team">
                                        <div className="team-sides team-font-side">
                                            <div className="team-img">
                                                <img src="/assets/img/team/team9.jpg" alt="" />
                                            </div>
                                            <div className="team-content bg-18">
                                                <Link className="weight-700" href="#">Kathryn Murphy</Link>
                                                <p>Senior Consultant</p>
                                            </div>
                                        </div>
                                        <div className="team-sides team-back-side">
                                            <div className="team-content bg-18">
                                                <Link className="weight-700" href="#">Kathryn Murphy</Link>
                                                <p>Senior Consultant</p>
                                                <div className="space10" />
                                                <div className="team-socials">
                                                    <ul>
                                                        <li>
                                                            <Link data-bs-toggle="tooltip" title="Linked in" href="#"><i className="fa-brands fa-linkedin-in" /></Link>
                                                        </li>
                                                        <li>
                                                            <Link data-bs-toggle="tooltip" title="Facebook" href="#"><i className="fa-brands fa-facebook-f" /></Link>
                                                        </li>
                                                        <li>
                                                            <Link data-bs-toggle="tooltip" title="Instagram" href="#"><i className="fa-brands fa-instagram" /></Link>
                                                        </li>
                                                        <li>
                                                            <Link data-bs-toggle="tooltip" title="TikTok" href="#"><i className="fa-brands fa-tiktok" /></Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6">
                                    <div className="single-team">
                                        <div className="team-sides team-font-side">
                                            <div className="team-img">
                                                <img src="/assets/img/team/team10.jpg" alt="" />
                                            </div>
                                            <div className="team-content bg-18">
                                                <Link className="weight-700" href="#">Aston Turner</Link>
                                                <p>Group manager</p>
                                            </div>
                                        </div>
                                        <div className="team-sides team-back-side">
                                            <div className="team-content bg-18">
                                                <Link className="weight-700" href="#">Alyssa Healy</Link>
                                                <p>Group manager</p>
                                                <div className="space10" />
                                                <div className="team-socials">
                                                    <ul>
                                                        <li>
                                                            <Link data-bs-toggle="tooltip" title="Linked in" href="#"><i className="fa-brands fa-linkedin-in" /></Link>
                                                        </li>
                                                        <li>
                                                            <Link data-bs-toggle="tooltip" title="Facebook" href="#"><i className="fa-brands fa-facebook-f" /></Link>
                                                        </li>
                                                        <li>
                                                            <Link data-bs-toggle="tooltip" title="Instagram" href="#"><i className="fa-brands fa-instagram" /></Link>
                                                        </li>
                                                        <li>
                                                            <Link data-bs-toggle="tooltip" title="TikTok" href="#"><i className="fa-brands fa-tiktok" /></Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6">
                                    <div className="single-team">
                                        <div className="team-sides team-font-side">
                                            <div className="team-img">
                                                <img src="/assets/img/team/team11.jpg" alt="" />
                                            </div>
                                            <div className="team-content bg-18">
                                                <Link className="weight-700" href="#">Jhye Richardson</Link>
                                                <p>Associate Consultant</p>
                                            </div>
                                        </div>
                                        <div className="team-sides team-back-side">
                                            <div className="team-content bg-18">
                                                <Link className="weight-700" href="#">Jhye Richardson</Link>
                                                <p>Associate Consultant</p>
                                                <div className="space10" />
                                                <div className="team-socials">
                                                    <ul>
                                                        <li>
                                                            <Link data-bs-toggle="tooltip" title="Linked in" href="#"><i className="fa-brands fa-linkedin-in" /></Link>
                                                        </li>
                                                        <li>
                                                            <Link data-bs-toggle="tooltip" title="Facebook" href="#"><i className="fa-brands fa-facebook-f" /></Link>
                                                        </li>
                                                        <li>
                                                            <Link data-bs-toggle="tooltip" title="Instagram" href="#"><i className="fa-brands fa-instagram" /></Link>
                                                        </li>
                                                        <li>
                                                            <Link data-bs-toggle="tooltip" title="TikTok" href="#"><i className="fa-brands fa-tiktok" /></Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6">
                                    <div className="single-team">
                                        <div className="team-sides team-font-side">
                                            <div className="team-img">
                                                <img src="/assets/img/team/team12.jpg" alt="" />
                                            </div>
                                            <div className="team-content bg-18">
                                                <Link className="weight-700" href="#">Peter Handscomb</Link>
                                                <p>Consultant  Analytics</p>
                                            </div>
                                        </div>
                                        <div className="team-sides team-back-side">
                                            <div className="team-content bg-18">
                                                <Link className="weight-700" href="#">Peter Handscomb</Link>
                                                <p>Consultant  Analytics</p>
                                                <div className="space10" />
                                                <div className="team-socials">
                                                    <ul>
                                                        <li>
                                                            <Link data-bs-toggle="tooltip" title="Linked in" href="#"><i className="fa-brands fa-linkedin-in" /></Link>
                                                        </li>
                                                        <li>
                                                            <Link data-bs-toggle="tooltip" title="Facebook" href="#"><i className="fa-brands fa-facebook-f" /></Link>
                                                        </li>
                                                        <li>
                                                            <Link data-bs-toggle="tooltip" title="Instagram" href="#"><i className="fa-brands fa-instagram" /></Link>
                                                        </li>
                                                        <li>
                                                            <Link data-bs-toggle="tooltip" title="TikTok" href="#"><i className="fa-brands fa-tiktok" /></Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*=====Team end=======*/}
                    {/*=====Office-area end=======*/}
                    <div className="office-area section-padding2 bg-13 inner-font-1 _relative">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8 m-auto">
                                    <div className="heading2 text-center">
                                        <small className="heading-top inner-heading-top"><img src="/assets/img/icons/hands.svg" alt="" />Our Success in
                                            Numbers</small>
                                        <h2>Our Offices Around the World</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-4 col-md-6">
                                    <div className="single-office">
                                        <div className="office-icon">
                                            <img src="/assets/img/icons/telegram.png" alt="" />
                                        </div>
                                        <h3>
                                            <Link href="#">New York Office</Link>
                                        </h3>
                                        <p>
                                            90 Abia Martin Drive, Ocean Beach, New York, NY 94105, United
                                            States
                                        </p>
                                        <Link href="#" className="theme-btn-13">Get Direction
                                            <img src="/assets/img/icons/arrow-up-right-inner-1.svg" alt="" /></Link>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div className="single-office">
                                        <div className="office-icon">
                                            <img src="/assets/img/icons/telegram.png" alt="" />
                                        </div>
                                        <h3>San Francisco Office</h3>
                                        <p>
                                            90 Abia Martin Drive, Ocean Beach, New York, NY 94105, United
                                            States
                                        </p>
                                        <Link href="#" className="theme-btn-13">Get Direction
                                            <img src="/assets/img/icons/arrow-up-right-inner-1.svg" alt="" /></Link>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div className="single-office">
                                        <div className="office-icon">
                                            <img src="/assets/img/icons/telegram.png" alt="" />
                                        </div>
                                        <h3>Dublin Office</h3>
                                        <p>
                                            90 Abia Martin Drive, Ocean Beach, New York, NY 94105, United
                                            States
                                        </p>
                                        <Link href="#" className="theme-btn-13">Get Direction
                                            <img src="/assets/img/icons/arrow-up-right-inner-1.svg" alt="" /></Link>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div className="single-office">
                                        <div className="office-icon">
                                            <img src="/assets/img/icons/telegram.png" alt="" />
                                        </div>
                                        <h3>Boston Office</h3>
                                        <p>
                                            90 Abia Martin Drive, Ocean Beach, New York, NY 94105, United
                                            States
                                        </p>
                                        <Link href="#" className="theme-btn-13">Get Direction
                                            <img src="/assets/img/icons/arrow-up-right-inner-1.svg" alt="" /></Link>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div className="single-office">
                                        <div className="office-icon">
                                            <img src="/assets/img/icons/telegram.png" alt="" />
                                        </div>
                                        <h3>Los Angeles Office</h3>
                                        <p>
                                            90 Abia Martin Drive, Ocean Beach, New York, NY 94105, United
                                            States
                                        </p>
                                        <Link href="#" className="theme-btn-13">Get Direction
                                            <img src="/assets/img/icons/arrow-up-right-inner-1.svg" alt="" /></Link>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div className="single-office">
                                        <div className="office-icon">
                                            <img src="/assets/img/icons/telegram.png" alt="" />
                                        </div>
                                        <h3>Nashville Office</h3>
                                        <p>
                                            90 Abia Martin Drive, Ocean Beach, New York, NY 94105, United
                                            States
                                        </p>
                                        <Link href="#" className="theme-btn-13">Get Direction
                                            <img src="/assets/img/icons/arrow-up-right-inner-1.svg" alt="" /></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="shape-007">
                            <img src="/assets/img/shapes/shape007.svg" alt="" />
                        </div>
                    </div>
                    {/*=====Office-area end=======*/}
                    {/*=====Faqs start=======*/}
                    <div className="faqs-area section-padding inner-font-1 inner-faq-1">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <div className="heading2 mr50">
                                        <small className="heading-top inner-heading-top"><img src="/assets/img/icons/hands.svg" alt="" />Our Success in
                                            Numbers</small>
                                        <h2>
                                            We Handle The Most Tedious Bookkeeping Tasks of Your Business
                                            Operations.
                                        </h2>
                                        <p>
                                            Experienced, knowledgeable professionals in Property Tax
                                            Consulting. Our team of Property Tax Consultants is committed to
                                            saving you money by obtaining the lowest possible assessed value
                                            for your commercial or residential properties.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="ml50">
                                        <div className="faqs">
                                            <Faq1 />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*=====Faqs end=======*/}
                    {/*=====Subscribe start=======*/}
                    <div className="subscribe-4 bg12 padding-90 inner-font-1 inner-subscribe">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <div className="heading4 white-heading inner-heading no-margin-heading">
                                        <h2>Want to join our team?</h2>
                                        <p>
                                            We are always looking for talented people, We here to help you
                                            to open your bright future.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-lg-5 col-md-6 offset-lg-1">
                                    <div className="sunscribe-form">
                                        <div className="subscribe-from-wrap">
                                            <form action="#">
                                                <input type="email" placeholder="Email Address" />
                                                <button type="submit" name="button">
                                                    Subscribe Now
                                                    <img src="/assets/img/icons/arrow-up-right.svg" alt="" />
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </Layout>
        </>
    )
}