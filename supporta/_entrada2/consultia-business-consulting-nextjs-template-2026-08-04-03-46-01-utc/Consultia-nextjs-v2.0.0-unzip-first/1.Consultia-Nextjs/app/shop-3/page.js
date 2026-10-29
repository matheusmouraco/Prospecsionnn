
import Layout from "@/components/layout/Layout"
import Link from "next/link"
export default function Page() {

    return (
        <>

            <Layout headerStyle={1} footerStyle={1} breadcrumbTitle="OUR SHOP">
                <div>
                    <div className="section-padding2 products">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="widgets lg-mr-15">
                                        <div className="single-widget padding-less-widget">
                                            <h3>Search by keyword</h3>
                                            <div className="search-form-widget">
                                                <form action="#">
                                                    <input type="search" placeholder="Type keyword here" />
                                                    <button type="submit" className="search-icon">
                                                        <i className="fa-solid fa-magnifying-glass" />
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                        <div className="single-widget price-filter-widget widget-border">
                                            <h3>FILTER BY PRICE</h3>
                                            <div className="filter level-filter level-req">
                                                <div id="rangeSlider" className="range-slider">
                                                    <div className="range-group">
                                                        <input className="range-input" defaultValue={100} min={1} max={500} step={1} type="range" />
                                                        <input className="range-input" defaultValue={350} min={1} max={500} step={1} type="range" />
                                                    </div>
                                                    <div className="filter-options">
                                                        <div className="range-filter-button">
                                                            <Link href="#" className="theme-btn-11">Filter</Link>
                                                        </div>
                                                        <div className="range-slider-output">
                                                            <p>Price:</p>
                                                            <div className="number-group">
                                                                $<input className="number-input" type="number" defaultValue={100} min={0} max={500} /><span className="range-output-divider">-</span> $<input className="number-input" type="number" defaultValue={350} min={0} max={500} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="single-widget recent-posts">
                                            <h3>Best Seller</h3>
                                            <div className="recent-post">
                                                <div className="recent-post-content">
                                                    <Link href="#">Leadership Burnout: What causes it and how avoid it.</Link>
                                                    <div className="blog-date-time">
                                                        <ul className="blog-date">
                                                            <li><Link href="#">$15.99</Link></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="recent-img">
                                                    <img src="/assets/img/products/product-6.jpg" alt="" />
                                                </div>
                                            </div>
                                            <div className="recent-post">
                                                <div className="recent-post-content">
                                                    <Link href="#">Stop setting diversity goals Start meeting them.</Link>
                                                    <div className="blog-date-time">
                                                        <ul className="blog-date">
                                                            <li><Link href="#">$35.99</Link></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="recent-img">
                                                    <img src="/assets/img/products/product-4.jpg" alt="" />
                                                </div>
                                            </div>
                                            <div className="recent-post">
                                                <div className="recent-post-content">
                                                    <Link href="#">Leadership Burnout: What causes it and how avoid it.</Link>
                                                    <div className="blog-date-time">
                                                        <ul className="blog-date">
                                                            <li><Link href="#">$25.99</Link></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="recent-img">
                                                    <img src="/assets/img/products/product-1.jpg" alt="" />
                                                </div>
                                            </div>
                                            <div className="recent-post">
                                                <div className="recent-post-content">
                                                    <Link href="#">Celebrate Black History Month By Donating.</Link>
                                                    <div className="blog-date-time">
                                                        <ul className="blog-date">
                                                            <li><Link href="#">$30.00</Link></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="recent-img">
                                                    <img src="/assets/img/products/product-7.jpg" alt="" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="single-widget categories">
                                            <h3>Categories</h3>
                                            <ul className="category-list">
                                                <li>
                                                    <Link className="active" href="#">Lifestyle
                                                        <span><i className="fa-solid fa-angle-right" /></span></Link>
                                                </li>
                                                <li>
                                                    <Link href="#">Stories
                                                        <span><i className="fa-solid fa-angle-right" /></span></Link>
                                                </li>
                                                <li>
                                                    <Link href="#">Updates
                                                        <span><i className="fa-solid fa-angle-right" /></span></Link>
                                                </li>
                                                <li>
                                                    <Link href="#">Development
                                                        <span><i className="fa-solid fa-angle-right" /></span></Link>
                                                </li>
                                                <li>
                                                    <Link href="#">Marketing
                                                        <span><i className="fa-solid fa-angle-right" /></span></Link>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="single-widget tags-widget">
                                            <h3>Tags</h3>
                                            <ul className="tags-list">
                                                <li><Link href="#">Healthcare</Link></li>
                                                <li><Link href="#">Consult</Link></li>
                                                <li><Link href="#">Cahless</Link></li>
                                                <li><Link href="#">Cyberattacks</Link></li>
                                                <li><Link href="#">Meeting</Link></li>
                                                <li><Link href="#">Leadership</Link></li>
                                                <li><Link href="#">Health Insurace</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <div className="products-wrap lg-ml-15">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="single-product">
                                                    <div className="product-image">
                                                        <div className="product-img img-zoom">
                                                            <img src="/assets/img/products/product-2.jpg" alt="" />
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
                                            <div className="col-md-6">
                                                <div className="single-product">
                                                    <div className="product-image">
                                                        <div className="product-img img-zoom">
                                                            <img src="/assets/img/products/product-1.jpg" alt="" />
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
                                            <div className="col-md-6">
                                                <div className="single-product">
                                                    <div className="product-image">
                                                        <div className="product-img img-zoom">
                                                            <img src="/assets/img/products/product-3.jpg" alt="" />
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
                                            <div className="col-md-6">
                                                <div className="single-product">
                                                    <div className="product-image">
                                                        <div className="product-img img-zoom">
                                                            <img src="/assets/img/products/product-4.jpg" alt="" />
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
                                            <div className="col-md-6">
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
                                            <div className="col-md-6">
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
                                    <div className="space30" />
                                    <div className="row">
                                        <div className="col-12 m-auto">
                                            <div className="theme-pagination text-center">
                                                <ul>
                                                    <li>
                                                        <Link href="#"><i className="fa-solid fa-angle-left" /></Link>
                                                    </li>
                                                    <li><Link className="active" href="#">01</Link></li>
                                                    <li><Link href="#">02</Link></li>
                                                    <li>...</li>
                                                    <li><Link href="#">99</Link></li>
                                                    <li>
                                                        <Link href="#"><i className="fa-solid fa-angle-right" /></Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*=====Shop End=======*/}
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