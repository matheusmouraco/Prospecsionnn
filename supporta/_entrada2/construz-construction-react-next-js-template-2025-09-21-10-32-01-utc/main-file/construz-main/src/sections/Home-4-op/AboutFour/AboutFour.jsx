import Link from "next/link";

const AboutFour = () => {
    return (
        <div className="about-area-4 space overflow-hidden" id="about-sec">
            <div className="about-bg-shape4-1 shape-mockup" data-top="0">
                <img src="/main-assets/img/bg/about-bg-shape4-1.png" alt="img" />
            </div>
            <div className="container">
                <div className="row gx-70 align-items-center flex-row-reverse">
                    <div className="col-xl-6">
                        <div className="about-thumb4 mb-40 mb-xl-0">
                            <div className="about-img-1">
                                <img src="/main-assets/img/normal/about_4-1.png" alt="img" />
                            </div>
                            <div className="about-img-2">
                                <img src="/main-assets/img/normal/about_4-2.png" alt="img" />
                            </div>
                            <div className="client-group-4-1 jump">
                                <img src="/main-assets/img/normal/client_group_4-1.png" alt="img" />
                            </div>
                            <div className="about-counter-wrap">
                                <h3 className="about-counter-number"><span className="counter-number">2.6</span>k+</h3>
                                <p className="about-counter-text">Client satisfaction our services</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="about-wrap4">
                            <div className="title-area mb-40">
                                <span className="sub-title text-theme">ABOUT US <i className="ri-arrow-right-down-line"></i></span>
                                <h2 className="sec-title">We building everything that you needed</h2>
                                <p className="sec-text">Welcome to Construz. We are architecture with a rich history of excellence, we have been empowering industries and driving progress for over 36 years.
                                </p>
                            </div>
                            <div className="about-tab-4">
                                <div className="filter-menu-active">
                                    <button data-filter=".cat1" className="active" type="button">Our History</button>
                                    <button data-filter=".cat2" type="button">Our Mission</button>
                                    <button data-filter=".cat3" type="button">Our Vision</button>
                                </div>
                                <div className="filter-active-cat1">
                                    <div className="filter-item cat1">
                                        <p className="about-tab-text">These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed</p>
                                    </div>
                                    <div className="filter-item cat2">
                                        <p className="about-tab-text">These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed</p>
                                    </div>
                                    <div className="filter-item cat3">
                                        <p className="about-tab-text">These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed</p>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="checklist style7">
                                        <ul>
                                            <li><i className="ri-checkbox-circle-line"></i> Quality control system
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="checklist style7">
                                        <ul>
                                            <li><i className="ri-checkbox-circle-line"></i> Transforming ideas into reality
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="btn-group mt-50">
                                <Link href="/pages/innerpage/about" className="btn">NOW MORE COMPANY <i className="ri-arrow-right-up-line"></i></Link>
                                <img src="/main-assets/img/normal/about_4-sign.png" alt="img" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutFour;