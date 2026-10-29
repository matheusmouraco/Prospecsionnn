'use client'
import Link from "next/link"
import { useState } from "react"

export default function DemoSidebar() {
    const [isToggled, setToggled] = useState(false)
    const handleToggle = () => setToggled(!isToggled)
    return (
        <>
            <div className={isToggled ? "demo-sidebar active-sidebar" : " demo-sidebar"} id="demo-sidebar">
                <div className="demo-sidebar-wrap">
                    <div className="demo-sidebar-menu" onClick={handleToggle}>
                        <span data-bs-toggle="tooltip" title="View Demos" className="demosIcon" id="demosIcon"><i className="fa-solid fa-gear" /></span>
                        {/* <span data-bs-toggle="tooltip" title="Buy Theme"><Link href="#"><i className="fa-solid fa-cart-shopping" /></Link></span> */}
                    </div>
                    <div className="demo-sidebar-content">
                        <div className="heading2">
                            <h2>Pre-Built Demos Collection</h2>
                        </div>
                        <div className="demo-sidebar-items">
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/demo-2.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/">Multi Page</Link>
                                        <Link href="/single-index-1">Landing Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/">Tax Consulting 1</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/coming-soon.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/index-6">Multi Page</Link>
                                        <Link href="/single-index-6">Landing Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/index-6">Tax Consulting 2</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/demo-4.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/index-2">Multi Page</Link>
                                        <Link href="/single-index-2">Landing Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/index-2">Financial Consulting</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/demo-3.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/index-3">Multi Page</Link>
                                        <Link href="/single-index-3">Landing Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/index-3">Law Consulting</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/demo-1.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/index-4" className="theme-btn-9">Multi Page</Link>
                                        <Link href="/single-index-4" className="theme-btn-9">Landing Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/index-4">Business Consulting</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/demo-5.png" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/index-5">Multi Page</Link>
                                        <Link href="/single-index-5">Landing Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/index-5"> Insurance Consulting</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/demo-rtl.png" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/index-rtl-1">Multi Page</Link>
                                        <Link href="/single-index-rtl-1">Landing Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/index-rtl-1">RTL Home</Link>
                                </div>
                            </div>
                        </div>
                        <div className="space30" />
                        <div className="heading2">
                            <h2>Pre-Built Inner Demos</h2>
                        </div>
                        <div className="demo-sidebar-items inner-dmeos">
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/about-1.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/about-1">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/about-1">About 1</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/about-2.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/about-2">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/about-2">About 2</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/blog-1.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/blog-mesonry-1">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/blog-mesonry-1">Blog 1</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/blog-2.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/blog-2">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/blog-2">Blog 2</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/blog-3.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/blog-3">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/blog-3">Blog 3</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/blog-inner-1.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/single-1">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/single-1">Blog Inner 1</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/blog-inner-2.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/single-2">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/single-2">Blog Inner 2</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/career.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/career-1">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/career-1">Carrer 1</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/service-1.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/service-1">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/service-1">Service 1</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/service-2.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/service-2">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/service-2">Service 2</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/service-inner-1.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/single-service-1">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/single-service-1">Service inner 1</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/service-inner-2.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/single-service-2">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/single-service-2">Service inner 2</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/price-1.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/price-1">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/price-1">Price 1</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/price-2.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/price-2">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/price-2">Price 2</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/case-1.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/case-study-1">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/case-study-1">Case Study 1</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/case-2.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/case-study-2">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/case-study-2">Case Study 2</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/case-3.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/case-study-3">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/case-study-3">Case Study 3</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/case-4.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/case-study-4">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/case-study-4">Case Study 4</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/case-inner.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/single-case-study-1">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/single-case-study-1">Case Study Inner</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/contact-1.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/contact-1">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/contact-1">Contact 1</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/contact-2.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/contact-2">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/contact-2">Contact 2</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/faq.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/faq-1">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/faq-1">Faq</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/testimonial-1.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/testimonial-1">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/testimonial-1">Testimonial</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/team.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/team-1">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/team-1">Team</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/shop-1.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/shop-1">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/shop-1">Shop 1</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/shop-2.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/shop-2">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/shop-2">Shop 2</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/shop-3.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/shop-3">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/shop-3">Shop 3</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/shop-inner.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/shop-inner-1">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/shop-inner-1">Shop Inner</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/cart.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/cart">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/cart">Cart</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/cart-empty.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/cart-empty">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/cart-empty">Cart Empty</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/signup.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/signup">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/signup">SignUp</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/signin.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/signin">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/signin">SignIn</Link>
                                </div>
                            </div>
                            <div className="single-demo-sidebar-item">
                                <div className="demo-sidebar-item-img">
                                    <img src="/assets/img/demos/forgot.jpg" alt="" />
                                    <div className="demo-sidebar-buttons">
                                        <Link href="/forgot">View Page</Link>
                                    </div>
                                </div>
                                <div className="demo-item-content">
                                    <Link href="/forgot">Forgot</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
