import Link from "next/link";

const ProjectFour = () => {
    return (
        <div className="bg-shape" style={{ backgroundImage: "url('/main-assets/img/bg/project-bg4-1.png')" }}>
            <div className="portfolio-area-4 space-top" id="project-sec">
                <div className="container">
                    <div className="row justify-content-between align-items-center">
                        <div className="col-lg-7">
                            <div className="title-area text-lg-start text-center">
                                <span className="sub-title text-theme">Recent Projects <i className="ri-arrow-right-down-line"></i></span>
                                <h2 className="sec-title">Architecture heavy project solutions</h2>
                            </div>
                        </div>
                        <div className="col-lg-auto">
                            <div className="sec-btn">
                                <div className="icon-box">
                                    <button data-slick-prev=".portfolio-slider4" className="slick-arrow default style2"><i className="ri-arrow-left-line"></i></button>
                                    <button data-slick-next=".portfolio-slider4" className="slick-arrow default style2"><i className="ri-arrow-right-line"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-hidden">
                        <div className="row gy-30 gx-30 global-carousel portfolio-slider4" data-slide-show="3" data-ml-slide-show="2" data-lg-slide-show="2" data-md-slide-show="2">
                            <div className="col-lg-4">
                                <div className="portfolio-card style4">
                                    <div className="portfolio-card-thumb">
                                        <img src="/main-assets/img/project/project4_1.png" alt="img" />
                                        <span className="portfolio-card-number">N.01</span>
                                    </div>
                                    <div className="portfolio-card-details">
                                        <span className="portfolio-card-subtitle">Architecture</span>
                                        <h4 className="portfolio-card-title"><Link href="/pages/innerpage/project-details">News Office Building</Link></h4>
                                    </div>
                                    <Link href="/pages/innerpage/project-details" className="icon-btn">
                                        <i className="ri-arrow-right-line"></i>
                                    </Link>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="portfolio-card style4">
                                    <div className="portfolio-card-thumb">
                                        <img src="/main-assets/img/project/project4_2.png" alt="img" />
                                        <span className="portfolio-card-number">N.02</span>
                                    </div>
                                    <div className="portfolio-card-details">
                                        <span className="portfolio-card-subtitle">Building</span>
                                        <h4 className="portfolio-card-title"><Link href="/pages/innerpage/project-details">General Construction</Link></h4>
                                    </div>
                                    <Link href="/pages/innerpage/project-details" className="icon-btn">
                                        <i className="ri-arrow-right-line"></i>
                                    </Link>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="portfolio-card style4">
                                    <div className="portfolio-card-thumb">
                                        <img src="/main-assets/img/project/project4_3.png" alt="img" />
                                        <span className="portfolio-card-number">N.03</span>
                                    </div>
                                    <div className="portfolio-card-details">
                                        <span className="portfolio-card-subtitle">Industry</span>
                                        <h4 className="portfolio-card-title"><Link href="/pages/innerpage/project-details">Renovation & Remodeling</Link></h4>
                                    </div>
                                    <Link href="/pages/innerpage/project-details" className="icon-btn">
                                        <i className="ri-arrow-right-line"></i>
                                    </Link>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="portfolio-card style4">
                                    <div className="portfolio-card-thumb">
                                        <img src="/main-assets/img/project/project4_1.png" alt="img" />
                                        <span className="portfolio-card-number">N.01</span>
                                    </div>
                                    <div className="portfolio-card-details">
                                        <span className="portfolio-card-subtitle">Architecture</span>
                                        <h4 className="portfolio-card-title"><Link href="/pages/innerpage/project-details">News Office Building</Link></h4>
                                    </div>
                                    <Link href="/pages/innerpage/project-details" className="icon-btn">
                                        <i className="ri-arrow-right-line"></i>
                                    </Link>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="portfolio-card style4">
                                    <div className="portfolio-card-thumb">
                                        <img src="/main-assets/img/project/project4_2.png" alt="img" />
                                        <span className="portfolio-card-number">N.02</span>
                                    </div>
                                    <div className="portfolio-card-details">
                                        <span className="portfolio-card-subtitle">Building</span>
                                        <h4 className="portfolio-card-title"><Link href="/pages/innerpage/project-details">General Construction</Link></h4>
                                    </div>
                                    <Link href="/pages/innerpage/project-details" className="icon-btn">
                                        <i className="ri-arrow-right-line"></i>
                                    </Link>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="portfolio-card style4">
                                    <div className="portfolio-card-thumb">
                                        <img src="/main-assets/img/project/project4_3.png" alt="img" />
                                        <span className="portfolio-card-number">N.03</span>
                                    </div>
                                    <div className="portfolio-card-details">
                                        <span className="portfolio-card-subtitle">Industry</span>
                                        <h4 className="portfolio-card-title"><Link href="/pages/innerpage/project-details">Renovation & Remodeling</Link></h4>
                                    </div>
                                    <Link href="/pages/innerpage/project-details" className="icon-btn">
                                        <i className="ri-arrow-right-line"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="counter-area-1 space">
                <div className="container">
                    <div className="row justify-content-between gy-40">
                        <div className="col-auto">
                            <div className="counter-card">
                                <h2 className="counter-card_number"><span className="counter-number">26</span>k+</h2>
                                <p className="counter-card_text">Projects Completed</p>
                            </div>
                        </div>
                        <div className="col-auto">
                            <div className="counter-card">
                                <h2 className="counter-card_number"><span className="counter-number">98</span>%</h2>
                                <p className="counter-card_text">Customers Satisfied</p>
                            </div>
                        </div>
                        <div className="col-auto">
                            <div className="counter-card">
                                <h2 className="counter-card_number"><span className="counter-number">20</span>M</h2>
                                <p className="counter-card_text">Special Machinery</p>
                            </div>
                        </div>
                        <div className="col-auto">
                            <div className="counter-card">
                                <h2 className="counter-card_number"><span className="counter-number">30</span>+</h2>
                                <p className="counter-card_text">Years in Business</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ProjectFour;