
'use client'
import Faq1 from "@/components/elements/Faq1"
import Layout from "@/components/layout/Layout"
import TestimonialSlider3 from "@/components/slider/TestimonialSlider3"
import Link from "next/link"
import { useState } from "react"
export default function Page() {

    const [isToggled, setToggled] = useState(false)
    const handleToggle = () => setToggled(!isToggled)
    return (
        <>

            <Layout headerStyle={1} footerStyle={1} breadcrumbTitle="Price">
                <div>
                    <div className="pricing-area pricing2 inner-font-1 inner-price section-padding2 bg-29">
                        <div className="container">
                            <div className="row">
                                <div className="col-12 text-center">
                                    <div className="plan-toggle-wrap">
                                        <div className="toggle-inner">
                                            <input id="ce-toggle" onClick={handleToggle} type="checkbox" />
                                            <span className="custom-toggle" />
                                            <div className="t-month">
                                                <h4>Monthly</h4>
                                            </div>
                                            <div className="t-year">
                                                <h4>Yearly <span>(20% Save)</span></h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space50" />
                            <div className="tab-content">
                                {isToggled ?
                                    <>
                                        <div id="yearly">
                                            <div className="row">
                                                <div className="col-lg-4">
                                                    <div className="single-price">
                                                        <div className="price-heading">
                                                            <p>Basic</p>
                                                            <h5>Create interactive forms that connect to your workflow.</h5>
                                                            <h3>$29/mo</h3>
                                                            <h6>Billed Yearly</h6>
                                                        </div>
                                                        <div className="price-body">
                                                            <Link className="theme-btn-11 full-btn" href="#">Get Basic Yearly</Link>
                                                            <h4>Everything you get with Basic</h4>
                                                            <ul>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Advanced
                                                                    Segmentation</li>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Comparative Reporting</li>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Unlimited
                                                                    Seats  Role Access</li>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Multivaritive Testing</li>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Dynamic
                                                                    Content</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4">
                                                    <div className="single-price">
                                                        <div className="price-heading">
                                                            <p>Plus</p>
                                                            <h5>Make your forms more beautiful and on-brand  analyze.</h5>
                                                            <h3>$199/mo</h3>
                                                            <h6>Billed Yearly</h6>
                                                        </div>
                                                        <div className="price-body">
                                                            <Link className="theme-btn-11 full-btn" href="#">Get Basic Yearly</Link>
                                                            <h4>Everything in Basic, Plus</h4>
                                                            <ul>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Advanced
                                                                    Segmentation</li>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Comparative Reporting</li>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Unlimited
                                                                    Seats  Role Access</li>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Multivaritive Testing</li>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Dynamic
                                                                    Content</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4">
                                                    <div className="single-price">
                                                        <div className="price-heading">
                                                            <p>Business</p>
                                                            <h5>Make your forms more beautiful and on-brand  analyze.</h5>
                                                            <h3>$399/mo</h3>
                                                            <h6>Billed Yearly</h6>
                                                        </div>
                                                        <div className="price-body">
                                                            <Link className="theme-btn-11 full-btn" href="#">Get Basic Yearly</Link>
                                                            <h4>Everything in Plus, Business</h4>
                                                            <ul>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Advanced
                                                                    Segmentation</li>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Comparative Reporting</li>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Unlimited
                                                                    Seats  Role Access</li>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Multivaritive Testing</li>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Dynamic
                                                                    Content</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </> : <>
                                        <div id="monthly">
                                            <div className="row">
                                                <div className="col-lg-4">
                                                    <div className="single-price">
                                                        <div className="price-heading">
                                                            <p>Basic</p>
                                                            <h5>Create interactive forms that connect to your workflow.</h5>
                                                            <h3>$19/mo</h3>
                                                            <h6>Billed Monthly</h6>
                                                        </div>
                                                        <div className="price-body">
                                                            <Link className="theme-btn-11 full-btn" href="#">Get Basic Monthly</Link>
                                                            <h4>Everything you get with Basic</h4>
                                                            <ul>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Advanced
                                                                    Segmentation</li>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Comparative Reporting</li>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Unlimited
                                                                    Seats  Role Access</li>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Multivaritive Testing</li>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Dynamic
                                                                    Content</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4">
                                                    <div className="single-price">
                                                        <div className="price-heading">
                                                            <p>Plus</p>
                                                            <h5>Make your forms more beautiful and on-brand  analyze.</h5>
                                                            <h3>$49/mo</h3>
                                                            <h6>Billed Monthly</h6>
                                                        </div>
                                                        <div className="price-body">
                                                            <Link className="theme-btn-11 full-btn" href="#">Get Basic Monthly</Link>
                                                            <h4>Everything in Basic, Plus</h4>
                                                            <ul>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Advanced
                                                                    Segmentation</li>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Comparative Reporting</li>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Unlimited
                                                                    Seats  Role Access</li>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Multivaritive Testing</li>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Dynamic
                                                                    Content</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4">
                                                    <div className="single-price">
                                                        <div className="price-heading">
                                                            <p>Business</p>
                                                            <h5>Make your forms more beautiful and on-brand  analyze.</h5>
                                                            <h3>$99/mo</h3>
                                                            <h6>Billed Monthly</h6>
                                                        </div>
                                                        <div className="price-body">
                                                            <Link className="theme-btn-11 full-btn" href="#">Get Basic Monthly</Link>
                                                            <h4>Everything in Plus, Business</h4>
                                                            <ul>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Advanced
                                                                    Segmentation</li>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Comparative Reporting</li>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Unlimited
                                                                    Seats  Role Access</li>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Multivaritive Testing</li>
                                                                <li><span className="pricing-icon"><img src="/assets/img/icons/double-check2.png" alt="" /></span>Dynamic
                                                                    Content</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>}

                            </div>
                            <div className="price-notice">
                                <div className="row align-items-center">
                                    <div className="col-md-6">
                                        <div className="heading4  inner-heading no-margin-heading">
                                            <h4>Volume Pricing?</h4>
                                            <p>If you’re a business with a large payments volume or unique business model, reach out to discuss
                                                alternive pricing options.</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6 text-md-right">
                                        <Link href="#" className="theme-btn-11 ">Contact Sales</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="space30" />
                        </div>
                    </div>
                    {/*=====Pricing end=======*/}
                    {/*=====Testimonial start=======*/}
                    <div className="testimonial-3 bg-13 section-padding inner-font-1 inner-testimonial-1 _relative">
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
                    {/*=====Faqs start=======*/}
                    <div className="faqs-area section-padding inner-font-1 inner-faq-1">
                        <div className="container ">
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <div className="heading2 mr50">
                                        <small className="heading-top inner-heading-top"><img src="/assets/img/icons/hands.svg" alt="" />FAQ</small>
                                        <h2>We Handle The Most Tedious Bookkeeping Tasks of Your Business Operations.</h2>
                                        <p>Experienced, knowledgeable professionals in Property Tax Consulting. Our team of Property Tax Consultants
                                            is committed to saving you money by obtaining the lowest possible assessed value for your commercial or
                                            residential properties.
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
                                        <p>We are always looking for talented people, We here to help you to open your bright future.</p>
                                    </div>
                                </div>
                                <div className="col-lg-5 col-md-6 offset-lg-1">
                                    <div className="sunscribe-form">
                                        <div className="subscribe-from-wrap">
                                            <form action="#">
                                                <input type="email" placeholder="Email Address" />
                                                <button type="submit" name="button">Subscribe Now <img src="/assets/img/icons/arrow-up-right.svg" alt="" /></button>
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