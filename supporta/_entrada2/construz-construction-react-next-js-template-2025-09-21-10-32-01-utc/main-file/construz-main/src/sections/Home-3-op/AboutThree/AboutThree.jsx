import Link from "next/link";

const AboutThree = () => {
    return (
        <div className="about-area-3 space overflow-hidden" id="about-sec">
            <div className="container">
                <div className="row gy-80 gx-100 align-items-end">
                    <div className="col-xl-7">
                        <div className="about-wrap3">
                            <div className="title-area mb-25">
                                <span className="sub-title text-theme">ABOUT US <i className="ri-arrow-right-down-line"></i></span>
                                <h2 className="sec-title">We building everything that you needed</h2>
                                <p className="sec-text">We craft unique digital experiences. With more than 7 years of expertise we design and code clean websites. </p>

                            </div>
                            <div className="checklist mb-35">
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
                                            <img src="/main-assets/img/normal/about_3-3.png" alt="img" />
                                        </div>
                                        <div className="author-text">Funder of Construz</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="about-thumb3 mt-70">
                            <div className="video-wrap about-img-1">
                                <img src="/main-assets/img/normal/about_3-1.png" alt="img" />
                                <Link href="https://www.youtube.com/watch?v=Mp8IXI1kzvQ" className="play-btn style6 popup-video"><i className="ri-play-fill"></i></Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-5 col-md-8">
                        <div className="about-thumb3 mb-30">
                            <div className="about-img-2" data-mask-src="/main-assets/img/normal/about_mask3-2.png">
                                <img src="/main-assets/img/normal/about_3-2.png" alt="img" />
                            </div>
                        </div>
                        <p>We craft unique digital experiences. With more than 7 years of expertise we design and code clean websites. </p>
                        <div className="btn-group mt-35">
                            <Link href="/pages/innerpage/about" className="btn">Now more Company <i className="ri-arrow-right-up-line"></i></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutThree;