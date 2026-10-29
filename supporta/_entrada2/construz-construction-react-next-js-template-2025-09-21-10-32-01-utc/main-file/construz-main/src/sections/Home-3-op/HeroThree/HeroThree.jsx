import Link from "next/link";

const HeroThree = () => {
    return (
        <div className="hero-wrapper hero-3" id="hero-sec">
            <div className="hero-bg-3-1" style={{ maskImage: "url('/main-assets/img/hero/hero_bg_mask_3_1.png')", backgroundImage: "url('/main-assets/img/hero/hero_bg_3_1.png')" }}></div>
            <div className="hero-shadow-text">construz</div>
            <div className="hero-bg-shape3-1 shape-mockup jump" data-bottom="3%" data-left="3%">
                <img src="/main-assets/img/shape/sec-bg-shape2.png" alt="img" />
            </div>

            <div className="container">
                <div className="hero-style3">
                    <div className="row">
                        <div className="col-lg-12">
                            <span className="hero-subtitle">Our Vision <img src="/main-assets/img/icon/long-arrow-right2.svg" alt="img" /></span>
                            <h1 className="hero-title">Quality Construction</h1>
                            <h1 className="hero-title style2">& Honest Service</h1>
                            <p className="hero-text">We craft unique digital experiences. With more than 7 years of expertise we design and code clean websites.</p>
                            <Link href="/pages/innerpage/about" className="btn style2">DISCOVER MORE <i className="ri-arrow-right-up-line"></i></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroThree;