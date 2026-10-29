import React from 'react';

function Slider() {
  return (
    <section className="tc-main-slider-style1">
      <div className="container-fluid">
        <div className="main-slider">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <div className="slider-card">
                <img
                  src="/innerpages/assets/img/blog/b1.jpg"
                  alt=""
                  className="bg"
                />
                <div className="content">
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-7">
                        <div className="info">
                          <div className="date fsz-12 text-uppercase mb-30">
                            <a href="#"> inspiration </a>
                            <span className="circle icon-3 bg-white rounded-circle mx-3"></span>
                            <a href="#"> march 24, 2024 </a>
                          </div>
                          <h2 className="fsz-45 fw-500">
                            <a href="#" className="hover-orange1">
                              Top 10 Wooden Architecture Building 2023
                            </a>
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="slider-card">
                <img
                  src="/innerpages/assets/img/blog/b2.jpg"
                  alt=""
                  className="bg"
                />
                <div className="content">
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-7">
                        <div className="info">
                          <div className="date fsz-12 text-uppercase mb-30">
                            <a href="#"> inspiration </a>
                            <span className="circle icon-3 bg-white rounded-circle mx-3"></span>
                            <a href="#"> march 24, 2024 </a>
                          </div>
                          <h2 className="fsz-45 fw-500">
                            <a href="#" className="hover-orange1">
                              Minimalist landscape in frontyard for young couple
                            </a>
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="swiper-pagination"></div>
          <div className="arrows">
            <div className="swiper-button-prev"></div>
            <div className="swiper-button-next"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Slider;
