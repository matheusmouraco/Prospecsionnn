import Link from "next/link";

const CtaFour = () => {
    return (
        <div className="bg-shape" style={{ backgroundImage: "url('/main-assets/img/bg/cta-bg4-2.png')" }}>
            <div className="cta-area-4 space-top" id="contact-sec">
                <div className="container">
                    <div className="cta-wrap4 text-center" style={{ backgroundImage: "url('/main-assets/img/bg/cta-bg4-1.png')" }} data-overlay="title" data-opacity="6">
                        <div className="title-area mb-30">
                            <span className="sub-title text-white">We have won many factory awards</span>
                            <h2 className="cta-title style2">Your Renovation</h2>
                            <h3 className="cta-title text-white">Starts Here</h3>
                        </div>
                        <div className="btn-wrap justify-content-center">
                            <Link href="/pages/innerpage/contact" className="btn style2">Get in Touch <i className="ri-arrow-right-up-line"></i></Link>
                        </div>
                    </div>
                </div>
            </div>
            <section className="blog-area-4 space" id="blog-sec">
                <div className="container">
                    <div className="row justify-content-lg-between justify-content-center align-items-center">
                        <div className="col-lg-6">
                            <div className="title-area text-lg-start text-center">
                                <span className="sub-title text-theme">Journal <i className="ri-arrow-right-down-line"></i></span>
                                <h2 className="sec-title">News and Article</h2>
                            </div>
                        </div>
                        <div className="col-md-auto">
                            <div className="sec-btn">
                                <div className="icon-box">
                                    <button data-slick-prev=".blog-slider4" className="slick-arrow default style2"><i className="ri-arrow-left-line"></i></button>
                                    <button data-slick-next=".blog-slider4" className="slick-arrow default style2"><i className="ri-arrow-right-line"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row global-carousel blog-slider4 slider-shadow" data-slide-show="3" data-lg-slide-show="3" data-md-slide-show="2" data-sm-slide-show="1" data-xs-slide-show="1" data-dots="false">
                        <div className="col-md-6 col-lg-4">
                            <div className="blog-card style4">
                                <div className="blog-img">
                                    <img src="/main-assets/img/blog/blog_4_1.png" alt="blog image" />
                                    <div className="blog-date">
                                        <Link href="/pages/innerpage/blog"><span>17</span>JUN</Link>
                                    </div>
                                </div>
                                <div className="blog-content">
                                    <div className="blog-meta">
                                        <Link href="/pages/innerpage/blog">By Rebecca</Link>
                                        <Link href="/pages/innerpage/blog">Architecture</Link>
                                    </div>
                                    <h3 className="blog-title"><Link href="/pages/innerpage/blog-details">Cultural artifacts and new attitudes</Link></h3>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-4">
                            <div className="blog-card style4">
                                <div className="blog-img">
                                    <img src="/main-assets/img/blog/blog_4_2.png" alt="blog image" />
                                    <div className="blog-date">
                                        <Link href="/pages/innerpage/blog"><span>20</span>AUG</Link>
                                    </div>
                                </div>
                                <div className="blog-content">
                                    <div className="blog-meta">
                                        <Link href="/pages/innerpage/blog">By Rebecca</Link>
                                        <Link href="/pages/innerpage/blog">Office</Link>
                                        <Link href="/pages/innerpage/blog">News 2024</Link>
                                    </div>
                                    <h3 className="blog-title"><Link href="/pages/innerpage/blog-details">Interactive technologies in factories and plants</Link></h3>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-4">
                            <div className="blog-card style4">
                                <div className="blog-img">
                                    <img src="/main-assets/img/blog/blog_4_3.png" alt="blog image" />
                                    <div className="blog-date">
                                        <Link href="/pages/innerpage/blog"><span>30</span>SEP</Link>
                                    </div>
                                </div>
                                <div className="blog-content">
                                    <div className="blog-meta">
                                        <Link href="/pages/innerpage/blog">By Rebecca</Link>
                                        <Link href="/pages/innerpage/blog">Building</Link>
                                    </div>
                                    <h3 className="blog-title"><Link href="/pages/innerpage/blog-details">Creation of industrial projects around the world</Link></h3>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-4">
                            <div className="blog-card style4">
                                <div className="blog-img">
                                    <img src="/main-assets/img/blog/blog_4_1.png" alt="blog image" />
                                    <div className="blog-date">
                                        <Link href="/pages/innerpage/blog"><span>17</span>JUN</Link>
                                    </div>
                                </div>
                                <div className="blog-content">
                                    <div className="blog-meta">
                                        <Link href="/pages/innerpage/blog">By Rebecca</Link>
                                        <Link href="/pages/innerpage/blog">Architecture</Link>
                                    </div>
                                    <h3 className="blog-title"><Link href="/pages/innerpage/blog-details">Cultural artifacts and new attitudes</Link></h3>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-4">
                            <div className="blog-card style4">
                                <div className="blog-img">
                                    <img src="/main-assets/img/blog/blog_4_2.png" alt="blog image" />
                                    <div className="blog-date">
                                        <Link href="/pages/innerpage/blog"><span>20</span>AUG</Link>
                                    </div>
                                </div>
                                <div className="blog-content">
                                    <div className="blog-meta">
                                        <Link href="/pages/innerpage/blog">By Rebecca</Link>
                                        <Link href="/pages/innerpage/blog">Office</Link>
                                        <Link href="/pages/innerpage/blog">News 2024</Link>
                                    </div>
                                    <h3 className="blog-title"><Link href="/pages/innerpage/blog-details">Interactive technologies in factories and plants</Link></h3>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-4">
                            <div className="blog-card style4">
                                <div className="blog-img">
                                    <img src="/main-assets/img/blog/blog_4_3.png" alt="blog image" />
                                    <div className="blog-date">
                                        <Link href="/pages/innerpage/blog"><span>30</span>SEP</Link>
                                    </div>
                                </div>
                                <div className="blog-content">
                                    <div className="blog-meta">
                                        <Link href="/pages/innerpage/blog">By Rebecca</Link>
                                        <Link href="/pages/innerpage/blog">Building</Link>
                                    </div>
                                    <h3 className="blog-title"><Link href="/pages/innerpage/blog-details">Creation of industrial projects around the world</Link></h3>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    );
};

export default CtaFour;