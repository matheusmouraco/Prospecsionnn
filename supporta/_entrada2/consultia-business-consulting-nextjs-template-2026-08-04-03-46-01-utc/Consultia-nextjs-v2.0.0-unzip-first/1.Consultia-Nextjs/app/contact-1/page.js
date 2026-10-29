
import Layout from "@/components/layout/Layout"
import Link from "next/link"
export default function Page() {

    return (
        <>

            <Layout headerStyle={1} footerStyle={1} breadcrumbTitle="CONTACT">
                <div>
                    <div className="contact-boxes">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-4">
                                    <div className="single-contact-box">
                                        <div className="contact-box-icon">
                                            <img src="/assets/img/icons/contact-1.svg" alt="" />
                                        </div>
                                        <div className="contact-box-content">
                                            <p className="font-f-3">CALL US</p>
                                            <Link className="font-f-3" href="/tel:+11 1111 11000">+11 1111 11000</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="single-contact-box">
                                        <div className="contact-box-icon">
                                            <img src="/assets/img/icons/contact-2.svg" alt="" />
                                        </div>
                                        <div className="contact-box-content">
                                            <p className="font-f-3">EMAIL US</p>
                                            <Link className="font-f-3" href="/mailto:hello@consultia.com">hello@consultia.com</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="single-contact-box">
                                        <div className="contact-box-icon">
                                            <img src="/assets/img/icons/contact-3.svg" alt="" />
                                        </div>
                                        <div className="contact-box-content">
                                            <p className="font-f-3">HEADQUARTERS</p>
                                            <Link className="font-f-3" href="#">New York, NY 94105, United States</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*=====Contact Boxes End=======*/}
                    {/*=====Contact Form Start=======*/}
                    <div className="main-contact-form section-padding">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-4">
                                    <div className="heading2 mr50">
                                        <small className="heading-top inner-heading-top"><img src="/assets/img/icons/hands.svg" alt="" />Our Success in
                                            Numbers</small>
                                        <h2>Let’s Work Together</h2>
                                        <p>
                                            Share your vision for your next projects with us now. Please
                                            contact us for basic questions. we’re here to help!
                                        </p>
                                    </div>
                                </div>
                                <div className="col-lg-8">
                                    <div className="main-form">
                                        <form>
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <input type="text" name="fname" placeholder="First Name" />
                                                </div>
                                                <div className="col-lg-6">
                                                    <input type="text" name="lname" placeholder="Last Name" />
                                                </div>
                                                <div className="col-12">
                                                    <input type="email" name="email" placeholder="Email Address" />
                                                </div>
                                                <div className="col-lg-6">
                                                    <input type="text" name="service" placeholder="Service Interested In" />
                                                </div>
                                                <div className="col-lg-6">
                                                    <input type="text" name="subject" placeholder="Subject" />
                                                </div>
                                                <div className="col-12">
                                                    <textarea name="message" cols={30} rows={5} placeholder="Tell Us About Your Projects" />
                                                </div>
                                                <div className="col-12">
                                                    <button type="submit" className="full-btn theme-btn-11">
                                                        Submit
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*=====Contact Form End=======*/}
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
                    {/*=====Faq start=======*/}
                    <div className="faq2 section-padding">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8 m-auto">
                                    <div className="heading2 text-center">
                                        <small className="heading-top inner-heading-top"><img src="/assets/img/icons/hands.svg" alt="" />FAQ</small>
                                        <h2>Frequently Asked Questions</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="single-faq2">
                                        <h3>What should entrepreneurs never do?</h3>
                                        <p>
                                            I'm a serial entrepreneur and have started/ran/sold
                                            approximately 20 businesses over the past 45 years.Some of my
                                            businesses made millions, some of them broke even. But - I never
                                            lost a dime on a single one.
                                        </p>
                                    </div>
                                    <div className="single-faq2">
                                        <h3>Are you too poor to start a business?</h3>
                                        <p>
                                            I'm a serial entrepreneur and have started/ran/sold
                                            approximately 20 businesses over the past 45 years.Some of my
                                            businesses made millions, some of them broke even. But - I never
                                            lost a dime on a single one.
                                        </p>
                                    </div>
                                    <div className="single-faq2">
                                        <h3>Do developers really code from scratch in a hackathon?</h3>
                                        <p>
                                            I'm a serial entrepreneur and have started/ran/sold
                                            approximately 20 businesses over the past 45 years.Some of my
                                            businesses made millions, some of them broke even. But - I never
                                            lost a dime on a single one.
                                        </p>
                                    </div>
                                    <div className="single-faq2">
                                        <h3>What pieces do museums not want the public to see?</h3>
                                        <p>
                                            I'm a serial entrepreneur and have started/ran/sold
                                            approximately 20 businesses over the past 45 years.Some of my
                                            businesses made millions, some of them broke even. But - I never
                                            lost a dime on a single one.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="single-faq2">
                                        <h3>What should entrepreneurs never do?</h3>
                                        <p>
                                            I'm a serial entrepreneur and have started/ran/sold
                                            approximately 20 businesses over the past 45 years.Some of my
                                            businesses made millions, some of them broke even. But - I never
                                            lost a dime on a single one.
                                        </p>
                                    </div>
                                    <div className="single-faq2">
                                        <h3>Are you too poor to start a business?</h3>
                                        <p>
                                            I'm a serial entrepreneur and have started/ran/sold
                                            approximately 20 businesses over the past 45 years.Some of my
                                            businesses made millions, some of them broke even. But - I never
                                            lost a dime on a single one.
                                        </p>
                                    </div>
                                    <div className="single-faq2">
                                        <h3>Do developers really code from scratch in a hackathon?</h3>
                                        <p>
                                            I'm a serial entrepreneur and have started/ran/sold
                                            approximately 20 businesses over the past 45 years.Some of my
                                            businesses made millions, some of them broke even. But - I never
                                            lost a dime on a single one.
                                        </p>
                                    </div>
                                    <div className="single-faq2">
                                        <h3>What pieces do museums not want the public to see?</h3>
                                        <p>
                                            I'm a serial entrepreneur and have started/ran/sold
                                            approximately 20 businesses over the past 45 years.Some of my
                                            businesses made millions, some of them broke even. But - I never
                                            lost a dime on a single one.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="space30" />
                            <div className="price-notice">
                                <div className="row align-items-center">
                                    <div className="col-md-6">
                                        <div className="heading4 inner-heading no-margin-heading">
                                            <h4 className="font-f-3 weight-700">Have more questions?</h4>
                                            <p>
                                                If you’re a business with a large payments volume or unique
                                                business model, reach out to discuss alternive pricing
                                                options.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-6 text-md-right">
                                        <Link href="#" className="theme-btn-11">Get In Touch</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*=====Faq end=======*/}
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
                                            <form>
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