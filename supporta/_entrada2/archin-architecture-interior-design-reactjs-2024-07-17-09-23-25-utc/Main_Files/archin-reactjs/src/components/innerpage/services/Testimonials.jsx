import React from 'react';

function Testimonials() {
  return (
    <section className="tc-testimonials-style1">
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <h6 className="fsz-18 text-uppercase lh-4">
              what clients say <br /> about us
            </h6>
            <div className="lg-icon color-orange1">
              <i className="la la-quote-right"></i>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="tc-clients-style1">
              <div className="clients-slider1">
                <div className="swiper-wrapper">
                  <div className="swiper-slide">
                    <div className="clients-card">
                      <div className="text fsz-45 fw-600 lh-2 js-splittext-lines">
                        “The entire team tactfully delivered a project of
                        exceptional quality while staying on schedule and under
                        budget. More than what i&lsquo;m expected. I’m really
                        satisfied and recommended!.”
                      </div>
                      <div className="author">
                        <div className="au-img">
                          <img
                            src="/innerpages/assets/img/team/team1.jpg"
                            alt=""
                            className="img-cover"
                          />
                        </div>
                        <div className="au-inf">
                          <h6 className="text-capitalize mb-2 fsz-16 fw-bold">
                            M. Salah
                          </h6>
                          <p className="text-capitalize fsz-14 color-666">
                            Dash Private Villa Project Investor
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="swiper-slide">
                    <div className="clients-card">
                      <div className="text fsz-45 fw-600 lh-2 js-splittext-lines">
                        “The entire team tactfully delivered a project of
                        exceptional quality while staying on schedule and under
                        budget. More than what i&lsquo;m expected. I’m really
                        satisfied and recommended!.”
                      </div>
                      <div className="author">
                        <div className="au-img">
                          <img
                            src="/innerpages/assets/img/team/team1.jpg"
                            alt=""
                            className="img-cover"
                          />
                        </div>
                        <div className="au-inf">
                          <h6 className="text-capitalize mb-2 fsz-16 fw-bold">
                            M. Salah
                          </h6>
                          <p className="text-capitalize fsz-14 color-666">
                            Dash Private Villa Project Investor
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="swiper-slide">
                    <div className="clients-card">
                      <div className="text fsz-45 fw-600 lh-2 js-splittext-lines">
                        “The entire team tactfully delivered a project of
                        exceptional quality while staying on schedule and under
                        budget. More than what i&lsquo;m expected. I’m really
                        satisfied and recommended!.”
                      </div>
                      <div className="author">
                        <div className="au-img">
                          <img
                            src="/innerpages/assets/img/team/team1.jpg"
                            alt=""
                            className="img-cover"
                          />
                        </div>
                        <div className="au-inf">
                          <h6 className="text-capitalize mb-2 fsz-16 fw-bold">
                            M. Salah
                          </h6>
                          <p className="text-capitalize fsz-14 color-666">
                            Dash Private Villa Project Investor
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="slider-controls">
                  <div className="swiper-button-prev"></div>
                  <div className="swiper-pagination"></div>
                  <div className="swiper-button-next"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="marq-slider">
        <div className="swiper-wrapper">
          <div className="swiper-slide">
            <a href="#"> Creative </a>
          </div>
          <div className="swiper-slide">
            <a href="#"> Flexiable </a>
          </div>
          <div className="swiper-slide">
            <a href="#"> Dedicated </a>
          </div>
        </div>
      </div>
      <img src="/innerpages/assets/img/c_line3.png" alt="" className="c-line" />
    </section>
  );
}

export default Testimonials;
