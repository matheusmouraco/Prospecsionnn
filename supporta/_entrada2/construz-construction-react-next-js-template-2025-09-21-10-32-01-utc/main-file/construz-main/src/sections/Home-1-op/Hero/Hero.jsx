import Link from "next/link";

const Hero = () => {
  return (
    <div
      className="hero-wrapper hero-1"
      id="hero-sec"
      style={{ backgroundImage: "url('/main-assets/img/hero/hero_bg_1_1.png')" }}
    >
      <div className="hero-bg-shape1-1"></div>
      <div className="hero-bg-shape1-2"></div>
      <div
        className="section-animation-shape1-1 shape-mockup animation-infinite"
        style={{ backgroundImage: "url('/main-assets/img/shape/global-line-shape1.png')" }}
      ></div>
      <div
        className="section-animation-shape1-2 shape-mockup animation-infinite"
        style={{ backgroundImage: "url('/main-assets/img/shape/global-line-shape1.png')" }}
      ></div>
      <div className="hero-slider1">
        <div className="hero-slide">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <div className="hero-style1">
                  <h1 className="hero-title text-white">
                    Build Your dream buildings for the future
                  </h1>
                  <p className="hero-text text-white">
                    We craft unique digital experiences. With more than 7 years
                    of expertise we design and code clean websites.
                  </p>

                  <div className="btn-group">
                    <Link href="/pages/innerpage/about" className="btn style2">
                      Discover More <i className="ri-arrow-right-up-line"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-thumb text-center">
            <img src="/main-assets/img/hero/hero_thumb_1_1.png" alt="img" />
          </div>
        </div>
        <div className="hero-slide">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <div className="hero-style1">
                  <h1 className="hero-title text-white">
                    Quality Build Construction Service
                  </h1>
                  <p className="hero-text text-white">
                    We craft unique digital experiences. With more than 7 years
                    of expertise we design and code clean websites.
                  </p>

                  <div className="btn-group">
                    <Link href="/pages/innerpage/about" className="btn style2">
                      Discover More <i className="ri-arrow-right-up-line"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-thumb text-center">
            <img src="/main-assets/img/hero/hero_thumb_1_2.png" alt="img" />
          </div>
        </div>
        <div className="hero-slide">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <div className="hero-style1">
                  <h1 className="hero-title text-white">
                    Apex Architects Build Construction for future
                  </h1>
                  <p className="hero-text text-white">
                    We craft unique digital experiences. With more than 7 years
                    of expertise we design and code clean websites.
                  </p>

                  <div className="btn-group">
                    <Link href="/pages/innerpage/about" className="btn style2">
                      Discover More <i className="ri-arrow-right-up-line"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-thumb text-center">
            <img src="/main-assets/img/hero/hero_thumb_1_3.png" alt="img" />
          </div>
        </div>
      </div>
      <div className="slider-controller-wrap">
        <div className="slider-btn-wrap">
          <div className="icon-box">
            <button
              data-slick-prev=".hero-slider1"
              className="slick-arrow default"
            >
              <i className="ri-arrow-left-down-line"></i>
            </button>
            <button
              data-slick-next=".hero-slider1"
              className="slick-arrow default"
            >
              <i className="ri-arrow-right-up-line"></i>
            </button>
          </div>
          <div className="slides-numbers">
            <span className="active">01</span> / <span className="total"></span>
          </div>
        </div>
      </div>
      <div className="hero-shape1-1 shape-mockup movingX">
        <img src="/main-assets/img/hero/hero_shape_1_1.png" alt="img" />
      </div>
      <div
        className="hero-experience-wrap"
        style={{
          backgroundImage: "url('/main-assets/img/hero/hero_experience_wrap_bg_1_1.png')",
        }}
      >
        <span className="shadow-text">Business Experience</span>
        <div className="hero-experience-icon">
          <img src="/main-assets/img/hero/hero_experience_wrap_icon_1_1.png" alt="img" />
        </div>
        <h2 className="hero-experience-counter">
          <span className="counter-number">40</span>+
        </h2>
        <p className="hero-experience-text">Years we have been doing this</p>
        <div className="media">
          <div className="icon">
            <img src="/main-assets/img/hero/hero_experience_wrap_icon_1_2.png" alt="img" />
          </div>
          <Link className="link-btn" href="landing-assets/about">
            Let’s work together{" "}
            <img src="/main-assets/img/icon/long-arrow-right.png" alt="img" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
