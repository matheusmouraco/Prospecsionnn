'use client'
import QuantityInput from "@/components/elements/QuantityInput"
import Layout from "@/components/layout/Layout"
import ShopThumbSlider from "@/components/slider/ShopThumbSlider"
import Link from "next/link"
import { useState } from "react"
export default function Page() {
    const [activeIndex, setActiveIndex] = useState(1)
    const handleOnClick = (index) => {
        setActiveIndex(index)
    }

    const [isActive, setIsActive] = useState({
        status: false,
        key: 1,
    })

    const handleClick = (key) => {
        if (isActive.key === key) {
            setIsActive({
                status: false,
            })
        } else {
            setIsActive({
                status: true,
                key,
            })
        }
    }

    return (
        <>

            <Layout headerStyle={1} footerStyle={1}>
                <div>
                    <div className="section-padding product-details">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-7">
                                    <ShopThumbSlider />
                                </div>
                                <div className="col-lg-5">
                                    <div className="product-details lg-ml-15">
                                        <div className="heading2 no-margin-heading">
                                            <h2>Total metabolic health in one daily scoop</h2>
                                            <div className="single-review">
                                                <ul className="reviews">
                                                    <li><i className="fa-solid fa-star" /></li>
                                                    <li><i className="fa-solid fa-star" /></li>
                                                    <li><i className="fa-solid fa-star" /></li>
                                                    <li><i className="fa-solid fa-star" /></li>
                                                    <li><i className="fa-solid fa-star" /></li>
                                                </ul>
                                                <p>15 Reviews</p>
                                            </div>
                                            <p>
                                                A 3-in-1 synbiotic superblend of prebiotics, probiotics, and
                                                polyphenols, formulated to give your good gut microbes
                                                everything they need to thrive.
                                            </p>
                                        </div>
                                        <div className="space30" />
                                        <div className="product-size">
                                            <h4>Select Size</h4>
                                            <ul className="product-sizes">
                                                <li className={activeIndex === 1 ? "active" : ""} onClick={() => handleOnClick(1)}>XL</li>
                                                <li className={activeIndex === 2 ? "active" : ""} onClick={() => handleOnClick(2)}>L</li>
                                                <li className={activeIndex === 3 ? "active" : ""} onClick={() => handleOnClick(3)}>M</li>
                                            </ul>
                                        </div>
                                        <div className="space30" />
                                        <div className="product-color">
                                            <h4>Select Color</h4>
                                            <ul className="product-colors">
                                                <li className="red" />
                                                <li className="black active" />
                                                <li className="green" />
                                            </ul>
                                        </div>
                                        <div className="space30" />
                                        <div className="single-product-main-price">
                                            <h3>$165.00 USD</h3>
                                        </div>
                                        <div className="space30" />
                                        <div className="product-quantity-details">
                                            <div className="product-quantity">
                                                <QuantityInput />

                                                <button className="theme-btn-11">Add to cart</button>
                                            </div>
                                            <p>TAXES  DUTIES INCLUDED.</p>
                                        </div>
                                        <div className="space30" />
                                        <div className="product-faq">
                                            <div className="faqs inner-faq">
                                                <div id="faqs">
                                                    <div className="single-faq">
                                                        <h2 className={isActive.key == 1 ? "faq-heading  font-f-3 weight-700" : "faq-heading  font-f-3 weight-700 collapsed"} onClick={() => handleClick(1)}>
                                                            Details
                                                        </h2>
                                                        <div id="collapse1" className={isActive.key == 1 ? "accordion-collapse collapse show" : "accordion-collapse collapse"}>
                                                            <p className="font-f-3 weight-500">
                                                                When it comes to business, listen to Henry David
                                                                Thoreau: things usually don’t happen overnight –
                                                                instead, to find success takes a lot of time, effort,
                                                                and courage.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="single-faq">
                                                        <h2 className={isActive.key == 2 ? "faq-heading  font-f-3 weight-700" : "faq-heading  font-f-3 weight-700 collapsed"} onClick={() => handleClick(2)}>
                                                            Ingredients
                                                        </h2>
                                                        <div id="collapse2" className={isActive.key == 2 ? "accordion-collapse collapse show" : "accordion-collapse collapse"}>
                                                            <p className="font-f-3 weight-500">
                                                                When it comes to business, listen to Henry David
                                                                Thoreau: things usually don’t happen overnight –
                                                                instead, to find success takes a lot of time, effort,
                                                                and courage.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="single-faq">
                                                        <h2 className={isActive.key == 3 ? "faq-heading  font-f-3 weight-700" : "faq-heading  font-f-3 weight-700 collapsed"} onClick={() => handleClick(3)}>
                                                            Shipping  Returns
                                                        </h2>
                                                        <div id="collapse3" className={isActive.key == 3 ? "accordion-collapse collapse show" : "accordion-collapse collapse"}>
                                                            <p className="font-f-3 weight-500">
                                                                When it comes to business, listen to Henry David
                                                                Thoreau: things usually don’t happen overnight –
                                                                instead, to find success takes a lot of time, effort,
                                                                and courage.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*=====Shop End=======*/}
                    {/*=====Testimonial start=======*/}
                    <div className="section-padding2 testimonial-3 bg-19 section-padding2 inner-font-1 inner-testimonial-1">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8 m-auto">
                                    <div className="heading2 text-center">
                                        <small className="heading-top inner-heading-top"><img src="/assets/img/icons/hands.svg" alt="" />Our Success in
                                            Numbers</small>
                                        <h2>We love our clients, and they love us.</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 col-lg-4">
                                    <div className="single-testimonial">
                                        <div className="testimonial-icon">
                                            <img src="/assets/img/icons/quote-1.png" alt="" />
                                        </div>
                                        <p>
                                            “Consultia law firm is wonderful. I have had the chance to work
                                            with three of the lawyers and they all have been wonderful. They
                                            will tell you when you need a lawyer and when you don't. They
                                            actually try to save you money. They respond very fast to
                                            questions and try to help you understand what is going on.”
                                        </p>
                                        <div className="author-reviews">
                                            <div className="author">
                                                <Link href="#">Jason Behrendorff</Link>
                                            </div>
                                            <div className="review-1">
                                                <div className="review">
                                                    <ul>
                                                        <li><i className="fa-solid fa-star" /></li>
                                                        <li><i className="fa-solid fa-star" /></li>
                                                        <li><i className="fa-solid fa-star" /></li>
                                                        <li><i className="fa-solid fa-star" /></li>
                                                        <li><i className="fa-solid fa-star-half" /></li>
                                                    </ul>
                                                </div>
                                                <div className="review-rate">
                                                    <p>(4.5)</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-4">
                                    <div className="single-testimonial">
                                        <div className="testimonial-icon">
                                            <img src="/assets/img/icons/quote-1.png" alt="" />
                                        </div>
                                        <p>
                                            “Consultia law firm is wonderful. I have had the chance to work
                                            with three of the lawyers and they all have been wonderful. They
                                            will tell you when you need a lawyer and when you don't. They
                                            actually try to save you money. They respond very fast to
                                            questions and try to help you understand what is going on.”
                                        </p>
                                        <div className="author-reviews">
                                            <div className="author">
                                                <Link href="#">Jason Behrendorff</Link>
                                            </div>
                                            <div className="review-1">
                                                <div className="review">
                                                    <ul>
                                                        <li><i className="fa-solid fa-star" /></li>
                                                        <li><i className="fa-solid fa-star" /></li>
                                                        <li><i className="fa-solid fa-star" /></li>
                                                        <li><i className="fa-solid fa-star" /></li>
                                                        <li><i className="fa-solid fa-star-half" /></li>
                                                    </ul>
                                                </div>
                                                <div className="review-rate">
                                                    <p>(4.5)</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-4">
                                    <div className="single-testimonial">
                                        <div className="testimonial-icon">
                                            <img src="/assets/img/icons/quote-1.png" alt="" />
                                        </div>
                                        <p>
                                            “Consultia law firm is wonderful. I have had the chance to work
                                            with three of the lawyers and they all have been wonderful. They
                                            will tell you when you need a lawyer and when you don't. They
                                            actually try to save you money. They respond very fast to
                                            questions and try to help you understand what is going on.”
                                        </p>
                                        <div className="author-reviews">
                                            <div className="author">
                                                <Link href="#">Jason Behrendorff</Link>
                                            </div>
                                            <div className="review-1">
                                                <div className="review">
                                                    <ul>
                                                        <li><i className="fa-solid fa-star" /></li>
                                                        <li><i className="fa-solid fa-star" /></li>
                                                        <li><i className="fa-solid fa-star" /></li>
                                                        <li><i className="fa-solid fa-star" /></li>
                                                        <li><i className="fa-solid fa-star-half" /></li>
                                                    </ul>
                                                </div>
                                                <div className="review-rate">
                                                    <p>(4.5)</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*=====Testimonial end=======*/}
                    {/*=====Products start=======*/}
                    <div className="section-padding2">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8 m-auto">
                                    <div className="heading2 text-center">
                                        <small className="heading-top inner-heading-top"><img src="/assets/img/icons/hands.svg" alt="" />Our Success in
                                            Numbers</small>
                                        <h2>We love our clients, and they love us.</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="single-product">
                                        <div className="product-image">
                                            <div className="product-img img-zoom">
                                                <img src="/assets/img/products/product-8.jpg" alt="" />
                                            </div>
                                            <div className="cart-btn">
                                                <Link className="full-btn theme-btn-11" href="#">Add To Cart</Link>
                                            </div>
                                            <div className="cart-icons">
                                                <ul>
                                                    <li>
                                                        <Link href="#"><i className="fa-light fa-eye" /></Link>
                                                    </li>
                                                    <li>
                                                        <Link href="#"><i className="fa-regular fa-heart" /></Link>
                                                    </li>
                                                    <li>
                                                        <Link href="#"><i className="fa-solid fa-repeat" /></Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="product-content">
                                            <ul className="reviews">
                                                <li><i className="fa-solid fa-star" /></li>
                                                <li><i className="fa-solid fa-star" /></li>
                                                <li><i className="fa-solid fa-star" /></li>
                                                <li><i className="fa-solid fa-star" /></li>
                                                <li><i className="fa-solid fa-star" /></li>
                                            </ul>
                                            <Link className="font-f-3" href="/shop-inner-1">Netherlands Grey Coffee</Link>
                                            <p className="font-f-3">$15.99</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="single-product">
                                        <div className="product-image">
                                            <div className="product-img img-zoom">
                                                <img src="/assets/img/products/product-5.jpg" alt="" />
                                            </div>
                                            <div className="cart-btn">
                                                <Link className="full-btn theme-btn-11" href="#">Add To Cart</Link>
                                            </div>
                                            <div className="cart-icons">
                                                <ul>
                                                    <li>
                                                        <Link href="#"><i className="fa-light fa-eye" /></Link>
                                                    </li>
                                                    <li>
                                                        <Link href="#"><i className="fa-regular fa-heart" /></Link>
                                                    </li>
                                                    <li>
                                                        <Link href="#"><i className="fa-solid fa-repeat" /></Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="product-content">
                                            <ul className="reviews">
                                                <li><i className="fa-solid fa-star" /></li>
                                                <li><i className="fa-solid fa-star" /></li>
                                                <li><i className="fa-solid fa-star" /></li>
                                                <li><i className="fa-solid fa-star" /></li>
                                                <li><i className="fa-solid fa-star" /></li>
                                            </ul>
                                            <Link className="font-f-3" href="/shop-inner-1">Netherlands Grey Coffee</Link>
                                            <p className="font-f-3">$15.99</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="single-product">
                                        <div className="product-image">
                                            <div className="product-img img-zoom">
                                                <img src="/assets/img/products/product-6.jpg" alt="" />
                                            </div>
                                            <div className="cart-btn">
                                                <Link className="full-btn theme-btn-11" href="#">Add To Cart</Link>
                                            </div>
                                            <div className="cart-icons">
                                                <ul>
                                                    <li>
                                                        <Link href="#"><i className="fa-light fa-eye" /></Link>
                                                    </li>
                                                    <li>
                                                        <Link href="#"><i className="fa-regular fa-heart" /></Link>
                                                    </li>
                                                    <li>
                                                        <Link href="#"><i className="fa-solid fa-repeat" /></Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="product-content">
                                            <ul className="reviews">
                                                <li><i className="fa-solid fa-star" /></li>
                                                <li><i className="fa-solid fa-star" /></li>
                                                <li><i className="fa-solid fa-star" /></li>
                                                <li><i className="fa-solid fa-star" /></li>
                                                <li><i className="fa-solid fa-star" /></li>
                                            </ul>
                                            <Link className="font-f-3" href="/shop-inner-1">Netherlands Grey Coffee</Link>
                                            <p className="font-f-3">$15.99</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*=====Products end=======*/}
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