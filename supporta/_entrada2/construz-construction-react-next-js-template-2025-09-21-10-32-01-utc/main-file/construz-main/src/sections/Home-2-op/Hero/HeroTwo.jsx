import Link from "next/link";

const Hero = () => {
  return (
    <div className="hero-wrapper hero-2" id="hero-sec">
      <div
        className="section-animation-shape1-1 shape-mockup animation-infinite"
        style={{ backgroundImage: "url('/main-assets/img/shape/global-line-shape1.png')" }}
      ></div>
      <div
        className="section-animation-shape1-2 shape-mockup animation-infinite"
        style={{ backgroundImage: "url('/main-assets/img/shape/global-line-shape1.png')" }}
      ></div>
      <div
        className="hero-slider2 global-carousel"
        data-slide-show="1"
        data-dots="true"
        data-xl-dots="true"
        data-ml-dots="true"
        data-lg-dots="true"
        data-md-dots="true"
        data-fade="true"
        data-asnavfor=".hero-number-slider2"
      >
        <div className="hero-slide">
          <div className="container">
            <div className="hero-style2">
              <div className="row">
                <div className="col-lg-12">
                  <h1
                    className="hero-title"
                    data-ani="slider-custom-anim-left"
                    data-ani-delay="0.1s"
                  >
                    RECONSTRUCTION <span className="year">2024</span>
                  </h1>
                </div>
                <div className="col-lg-7">
                  <div
                    className="hero-thumb text-center"
                    data-ani="slideinleft"
                    data-ani-delay="0.4s"
                  >
                    <img src="/main-assets/img/hero/hero_shape_1_1.png" alt="img" />
                  </div>
                </div>
                <div className="col-lg-5">
                  <p
                    className="hero-text"
                    data-ani="slider-custom-anim-left"
                    data-ani-delay="0.2s"
                  >
                    We craft unique digital experiences. With more than 7 years
                    of expertise we design and code clean websites.
                  </p>
                  <div
                    className="hero-tag"
                    data-ani="slideinup"
                    data-ani-delay="0.4s"
                  >
                    <div className="about-experience-tag style2">
                      <span className="hero-title-anime">
                        Explore More - Explore More -
                      </span>
                    </div>
                    <Link href="/pages/innerpage/contact" className="hero-tag_icon">
                      <i className="ri-arrow-right-up-line"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-slide">
          <div className="container">
            <div className="hero-style2">
              <div className="row">
                <div className="col-lg-12">
                  <h1
                    className="hero-title"
                    data-ani="slider-custom-anim-left"
                    data-ani-delay="0.1s"
                  >
                    ELITE RENOVATION <span className="year">2024</span>
                  </h1>
                </div>
                <div className="col-lg-7">
                  <div
                    className="hero-thumb text-center"
                    data-ani="slideinleft"
                    data-ani-delay="0.4s"
                  >
                    <img src="/main-assets/img/hero/hero_thumb_2_1.png" alt="img" />
                  </div>
                </div>
                <div className="col-lg-5">
                  <p
                    className="hero-text"
                    data-ani="slider-custom-anim-left"
                    data-ani-delay="0.2s"
                  >
                    We craft unique digital experiences. With more than 7 years
                    of expertise we design and code clean websites.
                  </p>
                  <div
                    className="hero-tag"
                    data-ani="slideinup"
                    data-ani-delay="0.4s"
                  >
                    <div className="about-experience-tag style2">
                      <span className="hero-title-anime">
                        Explore More - Explore More -
                      </span>
                    </div>
                    <Link href="/pages/innerpage/contact" className="hero-tag_icon">
                      <i className="ri-arrow-right-up-line"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-slide">
          <div className="container">
            <div className="hero-style2">
              <div className="row">
                <div className="col-lg-12">
                  <h1
                    className="hero-title"
                    data-ani="slider-custom-anim-left"
                    data-ani-delay="0.1s"
                  >
                    INDUSTRY SOLUTION <span className="year">2024</span>
                  </h1>
                </div>
                <div className="col-lg-7">
                  <div
                    className="hero-thumb text-center"
                    data-ani="slideinleft"
                    data-ani-delay="0.4s"
                  >
                    <img src="/main-assets/img/hero/hero_thumb_2_2.png" alt="img" />
                  </div>
                </div>
                <div className="col-lg-5">
                  <p
                    className="hero-text"
                    data-ani="slider-custom-anim-left"
                    data-ani-delay="0.2s"
                  >
                    We craft unique digital experiences. With more than 7 years
                    of expertise we design and code clean websites.
                  </p>
                  <div
                    className="hero-tag"
                    data-ani="slideinup"
                    data-ani-delay="0.4s"
                  >
                    <div className="about-experience-tag style2">
                      <span className="hero-title-anime">
                        Explore More - Explore More -
                      </span>
                    </div>
                    <Link href="/pages/innerpage/contact" className="hero-tag_icon">
                      <i className="ri-arrow-right-up-line"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div
          className="row global-carousel hero-number-slider2"
          data-slide-show="1"
          data-fade="true"
          data-asnavfor=".hero-slider2"
        >
          <div className="col-lg-auto">
            <div className="slider-number">1. Construction</div>
          </div>
          <div className="col-lg-auto">
            <div className="slider-number">2. Renovation</div>
          </div>
          <div className="col-lg-auto">
            <div className="slider-number">3. Industry</div>
          </div>
        </div>
      </div>
      <div
        className="hero-shape2-1 shape-mockup jump-reverse d-lg-block d-none"
        data-left="0"
        data-bottom="5%"
      >
        <img src="/main-assets/img/hero/hero_shape_2_1.png" alt="img" />
      </div>
      <div
        className="hero-shape2-2 shape-mockup jump d-sm-block d-none"
        data-right="0"
        data-top="13%"
      >
        <img src="/main-assets/img/hero/hero_shape_2_2.png" alt="img" />
      </div>
      <div
        className="hero-shape2-3 shape-mockup jump-reverse d-xl-block d-none"
        data-right="0"
        data-bottom="0"
      >
        <img src="/main-assets/img/hero/hero_shape_2_3.png" alt="img" />
      </div>
    </div>
  );
};

export default Hero;
