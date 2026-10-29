
import CounterUp from "@/components/elements/CounterUp"
import Faq1 from "@/components/elements/Faq1"
import Layout from "@/components/layout/Layout"
import TestimonialSlider3 from "@/components/slider/TestimonialSlider3"
import Link from "next/link"
export default function Page() {


    return (
        <>

            <Layout headerStyle={1} footerStyle={1} breadcrumbTitle="ABOUT CONSULTIA">
                <div>
                    <div className="bg-13-haf">
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="about-haf-img">
                                        <img className="border-radius" src="/assets/img/about/about-6.jpg" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*=====About haf image end=======*/}
                    {/*=====About content start=======*/}
                    <div className="section-padding">
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="heading2 no-margin-heading">
                                        <h2>Our Story</h2>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="heading2 no-margin-heading">
                                        <p>
                                            Imagine building some of the most sophisticated hardware-driven
                                            technologies in the world – spacecraft, drones or autonomous
                                            vehicles. Then imagine being unable to easily share your data to
                                            different teams, having to use clunky user interfaces, and
                                            relying on a single person manually inputting data in an Excel
                                            spreadsheet to bottom line your project. To solve this problem,
                                            Violet Labs is developing a cloud-based platform that can act as
                                            a single source of truth.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="heading2 no-margin-heading">
                                        <p>
                                            Imagine building some of the most sophisticated hardware-driven
                                            technologies in the world – spacecraft, drones or autonomous
                                            vehicles. Then imagine being unable to easily share your data to
                                            different teams, having to use clunky user interfaces, and
                                            relying on a single person manually inputting data in an Excel
                                            spreadsheet to bottom line your project. To solve this problem,
                                            Violet Labs is developing a cloud-based platform that can act as
                                            a single source of truth.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*=====About content end=======*/}
                    {/*=====About start=======*/}
                    <div className="about-inner bg-29">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <div className="about-bg-main-img position-relative mr50">
                                        <img src="/assets/img/about/about22.png" alt="" />
                                        <div className="corner-right-bottom-shape2 position-absolute">
                                            <img src="/assets/img/shapes/shape-right-bottom2.png" alt="" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="ml50">
                                        <div className="heading2 no-margin-heading">
                                            <small className="heading-top inner-heading-top"><img src="/assets/img/icons/hands.svg" alt="" />We doing super
                                                business since 1998.</small>
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
                    {/*=====Inner Counter start=======*/}
                    <div className="inner-counter-1 section-padding position-relative">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <div className="heading2 no-margin-heading mr50">
                                        <small className="heading-top inner-heading-top"><img src="/assets/img/icons/hands.svg" alt="" />Our
                                            Success in
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
                                    <div className="counter2 ml50 position-relative">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="single-counter">
                                                    <div className="conter-icon">
                                                        <img src="/assets/img/icons/service-9.png" alt="" />
                                                    </div>
                                                    <h2>$<CounterUp count={256} />B</h2>
                                                    <p>Quaterly Volume</p>
                                                </div>
                                                <div className="single-counter">
                                                    <div className="conter-icon">
                                                        <img src="/assets/img/icons/service-16.png" alt="" />
                                                    </div>
                                                    <h2><CounterUp count={152} />+</h2>
                                                    <p>Positive Feedback</p>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="single-counter mt-5">
                                                    <div className="conter-icon">
                                                        <img src="/assets/img/icons/service-12.png" alt="" />
                                                    </div>
                                                    <h2>$<CounterUp count={122} />B</h2>
                                                    <p>Assets on Platfrom</p>
                                                </div>
                                                <div className="single-counter">
                                                    <div className="conter-icon">
                                                        <img src="/assets/img/icons/service-14.png" alt="" />
                                                    </div>
                                                    <h2><CounterUp count={256} />+</h2>
                                                    <p>Employees</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="corner-right-bottom-shape2 position-absolute">
                                            <img src="/assets/img/shapes/shape-right-bottom2.png" alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="inner-counter-bg-1">
                            <img src="/assets/img/shapes/shape-8.png" alt="" />
                        </div>
                    </div>
                    {/*=====Inner Counter start =======*/}
                    {/*=====Testimonial start=======*/}
                    <div className="testimonial-3 bg-19 section-padding2 inner-font-1 inner-testimonial-1 _relative">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-10 m-auto">
                                    <div className="heading2 text-center">
                                        <small className="heading-top inner-heading-top"><img src="/assets/img/icons/hands.svg" alt="" />Our
                                            Success in
                                            Numbers</small>
                                        <h2>We love our clients, and they love us.</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <TestimonialSlider3 />
                                </div>
                            </div>
                        </div>
                        <div className="shape-007">
                            <img src="/assets/img/shapes/shape007.svg" alt="" />
                        </div>
                    </div>
                    {/*=====Testimonial end=======*/}
                    {/*=====Team start=======*/}
                    <div className="team-2 section-padding2 inner-font-1">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8 m-auto">
                                    <div className="heading2 text-center">
                                        <small className="heading-top inner-heading-top"><img src="/assets/img/icons/hands.svg" alt="" />Our
                                            Success in
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
                    {/*=====Faqs start=======*/}
                    <div className="faqs-area padding-bottom inner-font-1 inner-faq-1">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <div className="heading2 mr50">
                                        <small className="heading-top inner-heading-top"><img src="/assets/img/icons/hands.svg" alt="" />Our
                                            Success in
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