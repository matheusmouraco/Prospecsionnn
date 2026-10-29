import React from 'react';

function Blog() {
  return (
    <section className="tc-blog-style7">
      <div className="container">
        <h2 className="fsz-60 text-center text-capitalize fw-400 mb-100 js-splittext-lines">
          Guides & Tips
        </h2>
        <div className="row gx-5">
          <div className="col-lg-6">
            <div
              className="main-post pe-lg-5 wow fadeInUp slow"
              data-wow-delay="0.2s"
            >
              <a href="#" className="img">
                <img
                  src="/home7_landscape/assets/img/blog1.jpg"
                  alt=""
                  className="img-cover"
                />
              </a>
              <div className="info">
                <div className="date">
                  <h3 className="numb"> 25 </h3>
                  <small>
                    december <br /> 2023
                  </small>
                </div>
                <div className="cont">
                  <a href="#" className="title fsz-24 hover-underline d-block">
                    Minimalist Landscape in frontyard <br /> for young couple
                  </a>
                  <small className="fsz14 text-uppercase mt-15 color-green1 fw-300">
                    guide
                  </small>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="sub-posts ps-lg-5 mt-5 mt-lg-0">
              <div
                className="post-card wow fadeInUp slow"
                data-wow-delay="0.4s"
              >
                <div className="date">
                  <h3 className="numb"> 12 </h3>
                  <small>
                    december <br /> 2023
                  </small>
                </div>
                <div className="cont">
                  <a href="#" className="title fsz-24 hover-underline d-block">
                    What you need to know before renovating a pool?
                  </a>
                  <small className="fsz14 text-uppercase mt-15 color-green1 fw-300">
                    News, Offers
                  </small>
                </div>
              </div>
              <div
                className="post-card wow fadeInUp slow"
                data-wow-delay="0.6s"
              >
                <div className="date">
                  <h3 className="numb"> 7 </h3>
                  <small>
                    october <br /> 2023
                  </small>
                </div>
                <div className="cont">
                  <a href="#" className="title fsz-24 hover-underline d-block">
                    Most commonly asked outdoor living questions
                  </a>
                  <small className="fsz14 text-uppercase mt-15 color-green1 fw-300">
                    guide
                  </small>
                </div>
              </div>
              <div
                className="post-card wow fadeInUp slow"
                data-wow-delay="0.8s"
              >
                <div className="date">
                  <h3 className="numb"> 15 </h3>
                  <small>
                    august <br /> 2023
                  </small>
                </div>
                <div className="cont">
                  <a href="#" className="title fsz-24 hover-underline d-block">
                    Tips for selecting outdoor furniture
                  </a>
                  <small className="fsz14 text-uppercase mt-15 color-green1 fw-300">
                    tips & tricks
                  </small>
                </div>
              </div>
              <a
                href="#"
                className="more-link ms-lg-5 wow fadeInUp slow"
                data-wow-delay="0.2s"
              >
                see all articles
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="slider-content float_box_container overflow-hidden pt-100 pb-100">
        <div className="tc-awards-slider1">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <div className="service-card">
                <h2>
                  <a href="#">Get Free Quote</a>
                </h2>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="service-card">
                <h2>
                  <a href="#">Get Free Quote</a>
                </h2>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="service-card">
                <h2>
                  <a href="#">Get Free Quote</a>
                </h2>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="service-card">
                <h2>
                  <a href="#">Get Free Quote</a>
                </h2>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="service-card">
                <h2>
                  <a href="#">Get Free Quote</a>
                </h2>
              </div>
            </div>
          </div>
        </div>
        <div className="float_box">
          <p>
            <i className="fal fa-arrow-up-right fsz-70"></i>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Blog;
