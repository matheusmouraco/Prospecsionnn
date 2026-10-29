

const FooterThree = () => {
    return (
        <footer className="footer-wrapper footer-layout2 bg-title shape-mockup-wrap">
            <div className="footer_shape_2-1 shape-mockup" style={{ bottom: '0px', right: '0px' }}>
                <img src="/main-assets/img/bg/testimonial-bg-shape2-1.png" alt="img" />
            </div>
            <div className="container">
                <div className="widget-area">
                    <div className="row justify-content-between">
                        <div className="col-md-6 col-xl-4">
                            <div className="widget widget-about footer-widget">
                                <div className="footer-logo">
                                    <a href="/pages/homepage/home-1"><img src="/main-assets/img/logo-white.svg" alt="Construz" /></a>
                                </div>
                                <p className="about-text">Holisticly underwhelm ethical solutions whereas maintainable strategic theme areas. Uniquely optimize quality interface before resource.</p>
                                <h4 className="about-year">Since 2000</h4>
                            </div>
                        </div>
                        <div className="col-auto d-xxl-block d-none">
                            <div className="widget-divider"></div>
                        </div>
                        <div className="col-md-6 col-xl-auto">
                            <div className="widget widget_nav_menu footer-widget">
                                <h3 className="widget_title">Useful Links</h3>
                                <div className="menu-all-pages-container grid-style">
                                    <ul className="menu">
                                        <li><a href="/pages/innerpage/about">About Us</a></li>
                                        <li><a href="/pages/innerpage/service">What We Do</a></li>
                                        <li><a href="/pages/innerpage/service">News & Article</a></li>
                                        <li><a href="/pages/innerpage/service">Success Story</a></li>
                                        <li><a href="/pages/innerpage/service">FAQ’s</a></li>
                                    </ul>
                                    <ul className="menu">
                                        <li><a href="/pages/innerpage/team">Our Team</a></li>
                                        <li><a href="/pages/innerpage/service">Careers</a></li>
                                        <li><a href="/pages/innerpage/service">Testimonials</a></li>
                                        <li><a href="/pages/innerpage/contact">Privacy Policy</a></li>
                                        <li><a href="/pages/innerpage/contact">Terms of use</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-auto d-xxl-block d-none">
                            <div className="widget-divider"></div>
                        </div>
                        <div className="col-md-6 col-xl-auto">
                            <div className="widget footer-widget widget-newsletter">
                                <h3 className="widget_title">Newsletter</h3>
                                <p className="footer-text">Subscribe for the latest news. Stay updated on the latest trends.</p>
                                <form className="newsletter-form">
                                    <div className="form-group">
                                        <input className="form-control style-border3" type="email" placeholder="Email Address..." required="" />
                                    </div>
                                    <button type="submit" className="btn-with-icon style3">
                                        SUBMIT NOW
                                        <span className="btn-icon">
                                            <i className="ri-arrow-right-up-line"></i>
                                        </span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className="copyright-wrap">
                <div className="container">
                    <div className="row gy-3 justify-content-center">
                        <div className="col-auto align-self-center"><p className="copyright-text text-center">© 2024 <a href="#">Construz</a>  |  All rights reserved</p></div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterThree;