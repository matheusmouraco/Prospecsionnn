
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import CareerFilter1 from "@/components/elements/CareerFilter1"
export default function Page() {

    return (
        <>

            <Layout headerStyle={1} footerStyle={1} breadcrumbTitle="Career">
                <div>
                    <div className="about-inner bg-28 section-padding">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <div className="mr50">
                                        <div className="heading2 no-margin-heading">
                                            <small className="heading-top inner-heading-top"><img src="/assets/img/icons/hands.svg" alt="" />Our Success in
                                                Numbers</small>
                                            <h2>
                                                Our Mission is to help <br />
                                                innovative thinkers be <br />
                                                successful.
                                            </h2>
                                            <p>
                                                Imagine building some of the most sophisticated
                                                hardware-driven technologies in the world – spacecraft, drones
                                                or autonomous vehicles. Then imagine being unable to easily
                                                share your data to different teams, having to use clunky user
                                                interfaces, and relying on a single person manually inputting
                                                data.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="about-bg-main-img position-relative ml50">
                                        <img src="/assets/img/about/about-7.jpg" alt="" />
                                        <div className="corner-right-bottom-shape2 position-absolute">
                                            <img src="/assets/img/shapes/shape-right-bottom2.png" alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*=====About end=======*/}
                    {/*=====Service start=======*/}
                    <div className="service-3 bg-13 inner-service-1 section-padding2 inner-font-1" id="service">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-10 m-auto">
                                    <div className="heading2 text-center">
                                        <small className="heading-top inner-heading-top"><img src="/assets/img/icons/hands.svg" alt="" />Our Success in
                                            Numbers</small>
                                        <h2>We love our clients, and they love us.</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4 col-lg-3 col-sm-6">
                                    <div className="single-service text-center">
                                        <div className="service-icon bg-24">
                                            <img src="/assets/img/icons/service-9.png" alt="" />
                                        </div>
                                        <h3>Wills and Trust</h3>
                                    </div>
                                </div>
                                <div className="col-md-4 col-lg-3 col-sm-6">
                                    <div className="single-service text-center">
                                        <div className="service-icon bg-24">
                                            <img src="/assets/img/icons/service-10.png" alt="" />
                                        </div>
                                        <h3>Business Law</h3>
                                    </div>
                                </div>
                                <div className="col-md-4 col-lg-3 col-sm-6">
                                    <div className="single-service text-center">
                                        <div className="service-icon bg-24">
                                            <img src="/assets/img/icons/service-11.png" alt="" />
                                        </div>
                                        <h3>Marriage  Divorce</h3>
                                    </div>
                                </div>
                                <div className="col-md-4 col-lg-3 col-sm-6">
                                    <div className="single-service text-center">
                                        <div className="service-icon bg-24">
                                            <img src="/assets/img/icons/service-12.png" alt="" />
                                        </div>
                                        <h3>Tax Law</h3>
                                    </div>
                                </div>
                                <div className="col-md-4 col-lg-3 col-sm-6">
                                    <div className="single-service text-center">
                                        <div className="service-icon bg-24">
                                            <img src="/assets/img/icons/service-13.png" alt="" />
                                        </div>
                                        <h3>Real Estate Law</h3>
                                    </div>
                                </div>
                                <div className="col-md-4 col-lg-3 col-sm-6">
                                    <div className="single-service text-center">
                                        <div className="service-icon bg-24">
                                            <img src="/assets/img/icons/service-14.png" alt="" />
                                        </div>
                                        <h3>Insurance Claim</h3>
                                    </div>
                                </div>
                                <div className="col-md-4 col-lg-3 col-sm-6">
                                    <div className="single-service text-center">
                                        <div className="service-icon bg-24">
                                            <img src="/assets/img/icons/service-15.png" alt="" />
                                        </div>
                                        <h3>Bankruptcy</h3>
                                    </div>
                                </div>
                                <div className="col-md-4 col-lg-3 col-sm-6">
                                    <div className="single-service text-center">
                                        <div className="service-icon bg-24">
                                            <img src="/assets/img/icons/service-16.png" alt="" />
                                        </div>
                                        <h3>Criminal Law</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*=====Service end=======*/}
                    {/*=====Jobs start=======*/}
                    <div className="job-area section-padding2 bg-28">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-10 m-auto">
                                    <div className="heading2 text-center">
                                        <small className="heading-top inner-heading-top"><img src="/assets/img/icons/hands.svg" alt="" />Choose exactly
                                            what you need!</small>
                                        <h2>Find your perfect role and apply today.</h2>
                                    </div>
                                </div>
                            </div>
                            <CareerFilter1/>
                        </div>
                    </div>
                    {/*=====Jobs end=======*/}
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