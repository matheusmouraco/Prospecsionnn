import Link from "next/link";

const AboutFive = () => {
    return (
        <div className="about-area-5 space" id="about-sec">
            <div className="about-bg-shape5-1 shape-mockup" data-top="-170px" data-right="0">
                <img src="/main-assets/img/bg/about-bg-shape5-1.png" alt="img" />
            </div>
            <div className="container">
                <div className="row gx-100 align-items-center">
                    <div className="col-xl-5">
                        <div className="about-thumb5 mb-40 mb-xl-0">
                            <div className="about-img-1 mb-40">
                                <img src="/main-assets/img/normal/about_5-1.png" alt="img" />
                            </div>
                            <p>We craft unique digital experiences. With more than 7 years of expertise we design and code clean websites. </p>
                            <div className="btn-group mt-30">
                                <Link href="/pages/innerpage/about" className="btn">NOW MORE COMPANY <i className="ri-arrow-right-up-line"></i></Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="about-wrap5">
                            <div className="title-area mb-40">
                                <span className="sub-title text-theme">ABOUT US <i className="ri-arrow-right-down-line"></i></span>
                                <h2 className="sec-title">We building everything that you needed</h2>
                                <p className="sec-text">We craft unique digital experiences. With more than 7 years of expertise we design and code clean websites.
                                </p>
                                <div className="checklist mb-35 mt-30">
                                    <ul>
                                        <li><img src="/main-assets/img/icon/about-checklsit-icon1-1.svg" alt="img" />Providing Solutions For Construction, Management
                                        </li>
                                        <li><img src="/main-assets/img/icon/about-checklsit-icon1-1.svg" alt="img" />Engineers design and build the structure</li>
                                    </ul>
                                </div>
                                <div className="btn-wrap">
                                    <div className="cta-grid-wrap">
                                        <div className="icon-btn">
                                            <i className="ri-phone-fill"></i>
                                        </div>
                                        <div className="media-body">
                                            <Link className="link" href="tel:+2590256215">+123 556 8824</Link>
                                            <h6 className="title">Ned Help?</h6>
                                        </div>
                                    </div>
                                    <div className="about-author-wrap">
                                        <div className="author-thumb">
                                            <img src="/main-assets/img/normal/about_3-4.png" alt="img" />
                                        </div>
                                        <div className="media-body">
                                            <div className="author-sign">
                                                <img src="/main-assets/img/normal/about_4-sign.png" alt="img" />
                                            </div>
                                            <div className="author-text">Funder of Construz</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="about-thumb5 mt-60 d-inline-block">
                                <div className="video-wrap about-img-2">
                                    <img src="/main-assets/img/normal/about_5-2.png" alt="img" />
                                    <Link href="https://www.youtube.com/watch?v=Mp8IXI1kzvQ" className="play-btn style6 popup-video"><i className="ri-play-fill"></i></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutFive;