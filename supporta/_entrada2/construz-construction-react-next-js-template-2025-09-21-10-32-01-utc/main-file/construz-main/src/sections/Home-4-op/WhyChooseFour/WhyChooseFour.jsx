/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";


const WhyChooseFour = () => {
    return (
        <div>
            <div className="why-area-4 space overflow-hidden" style={{ backgroundImage: "url('/main-assets/img/bg/why-bg4-1.png')" }}>
                <div className="container">
                    <div className="row">
                        <div className="col-xxl-5 col-lg-6">
                            <div className="title-area">
                                <span className="sub-title text-theme">What we do <i className="ri-arrow-right-down-line"></i></span>
                                <h2 className="sec-title text-white">Solution that inspire progress</h2>
                            </div>
                        </div>
                        <div className="col-xxl-4 offset-xxl-2 col-lg-6">
                            <div className="wcu-card-wrap4 m-0">
                                <div className="wcu-card">
                                    <div className="wcu-card-icon">
                                        <img src="/main-assets/img/icon/why-icon1-5.svg" alt="img" />
                                    </div>
                                    <div className="wcu-card-details">
                                        <h4 className="wcu-card-title text-white">Skilled Team</h4>
                                        <p className="wcu-card-text">We are expert your all work is very nice waiting for next project.</p>
                                    </div>
                                </div>
                                <div className="wcu-card">
                                    <div className="wcu-card-icon">
                                        <img src="/main-assets/img/icon/why-icon1-2.svg" alt="img" />
                                    </div>
                                    <div className="wcu-card-details">
                                        <h4 className="wcu-card-title text-white">Core Planning</h4>
                                        <p className="wcu-card-text">Ipsum is that it has a more-or-less normal distribution of letters opposed to using</p>
                                    </div>
                                </div>
                                <div className="wcu-card">
                                    <div className="wcu-card-icon">
                                        <img src="/main-assets/img/icon/why-icon1-6.svg" alt="img" />
                                    </div>
                                    <div className="wcu-card-details">
                                        <h4 className="wcu-card-title text-white">Save Money</h4>
                                        <p className="wcu-card-text"> Content here, content here', making it look like readable English. Many desktop</p>
                                    </div>
                                </div>
                                <div className="wcu-card">
                                    <div className="wcu-card-icon">
                                        <img src="/main-assets/img/icon/why-icon1-1.svg" alt="img" />
                                    </div>
                                    <div className="wcu-card-details">
                                        <h4 className="wcu-card-title text-white">Technology</h4>
                                        <p className="wcu-card-text"> We are expert your all work is very nice waiting for next project  publishing packages</p>
                                    </div>
                                </div>
                                <div className="wcu-card">
                                    <div className="wcu-card-icon">
                                        <img src="/main-assets/img/icon/why-icon1-3.svg" alt="img" />
                                    </div>
                                    <div className="wcu-card-details">
                                        <h4 className="wcu-card-title text-white">Project Result</h4>
                                        <p className="wcu-card-text"> Making this the first true generator on the Internet uses a dictionary</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="video-area-2 position-relative">
                <div className="video_thumb2-1" style={{ backgroundImage: "url('/main-assets/img/normal/testimonial_2-1.png')" }}>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="video-wrap2" style={{ backgroundImage: "url('/main-assets/img/bg/video-bg2-1.png')" }}>
                                <Link href="https://www.youtube.com/watch?v=Mp8IXI1kzvQ" className="popup-video play-btn-wrap style2 justify-content-end text-end">
                                    <div className="video-text">
                                        See our intro video
                                    </div>
                                    <span className="play-btn style8">
                                        <i className="ri-play-fill"></i>
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhyChooseFour;