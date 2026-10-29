import React from 'react';

function LatestPosts() {
  return (
    <section className="tc-latest-posts-style1">
      <div className="container">
        <div className="content">
          <div className="title mb-70 wow fadeInUp slow" data-wow-delay="0.2s">
            <div className="row">
              <div className="col-lg-8">
                <h3 className="fsz-45 text-capitalize"> Latest Articles </h3>
              </div>
              <div className="col-lg-4 mt-4 mt-lg-0">
                <div className="arrows me-lg-0 ms-lg-auto">
                  <div className="swiper-button-prev"></div>
                  <div className="swiper-button-next"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="posts-slider wow fadeInUp slow" data-wow-delay="0.2s">
            <div className="swiper-wrapper">
              <div className="swiper-slide">
                <div className="post-card">
                  <a
                    href="#"
                    className="img radius-7 overflow-hidden th-400 d-block"
                  >
                    <img
                      src="/innerpages/assets/img/blog/b3.jpg"
                      alt=""
                      className="img-cover"
                    />
                  </a>
                  <div className="info pt-50">
                    <div className="row">
                      <div className="col-lg-3">
                        <div className="date">
                          <h2 className="num fsz-45 fw-400 mb-10"> 25 </h2>
                          <p className="txt fsz-12 color-666 text-uppercase">
                            december <br /> 2023
                          </p>
                        </div>
                      </div>
                      <div className="col-lg-9">
                        <div className="cont">
                          <h3 className="fsz-24">
                            <a href="#" className="hover-orange1">
                              How to handle the day light in <br /> Vray for
                              best reality
                            </a>
                          </h3>
                          <div className="tags fsz-12 color-orange1 text-uppercase mt-20">
                            <a href="#"> Architecture, </a>
                            <a href="#"> Guide </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="swiper-slide">
                <div className="post-card">
                  <a
                    href="#"
                    className="img radius-7 overflow-hidden th-400 d-block"
                  >
                    <img
                      src="/innerpages/assets/img/blog/b4.jpg"
                      alt=""
                      className="img-cover"
                    />
                  </a>
                  <div className="info pt-50">
                    <div className="row">
                      <div className="col-lg-3">
                        <div className="date">
                          <h2 className="num fsz-45 fw-400 mb-10"> 16 </h2>
                          <p className="txt fsz-12 color-666 text-uppercase">
                            december <br /> 2023
                          </p>
                        </div>
                      </div>
                      <div className="col-lg-9">
                        <div className="cont">
                          <h3 className="fsz-24">
                            <a href="#" className="hover-orange1">
                              Sustainable Design Award <br /> 2024
                            </a>
                          </h3>
                          <div className="tags fsz-12 color-orange1 text-uppercase mt-20">
                            <a href="#"> Inspiration, </a>
                            <a href="#"> interior </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LatestPosts;
