import React from 'react';

function Testimonials() {
  return (
    <section className="tc-testimonials-style7">
      <div className="container">
        <div className="rotate-box" data-speed="1" data-lag="0.4">
          <a
            href="#"
            className="rotate-circle fsz-30 rotate-text d-inline-block text-uppercase"
          >
            <svg className="textcircle" viewBox="0 0 500 500">
              <defs>
                <path
                  id="textcircle"
                  d="M250,400 a150,150 0 0,1 0,-300a150,150 0 0,1 0,300Z"
                ></path>
              </defs>
              <text>
                <textPath xlinkHref="#textcircle" textLength="900">
                  trusted by clients - testimonial -
                </textPath>
              </text>
            </svg>
          </a>
          <img
            src="/home7_landscape/assets/img/vector_quote.svg"
            alt=""
            className="icon"
          />
        </div>
        <div className="test-content wow fadeInUp slow" data-wow-delay="0.2s">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="testi-slider">
                <div className="swiper-wrapper">
                  <div className="swiper-slide">
                    <div className="testi-card">
                      <h4 className="sub-font">
                        “We always knew what was happening and what was going to
                        happen. They did amazing work and an exquisite design
                        and the lighting is incredible.”
                      </h4>
                      <div className="auther mt-80">
                        <h6 className="fsz-18 fw-bold mb-15">
                          Dominik Szoboszlai
                        </h6>
                        <p className="color-666 text-decoration-underline">
                          Ecohaus Residence
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="swiper-button-prev"></div>
          <div className="swiper-button-next"></div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
