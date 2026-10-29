import React from 'react';

function Testimonials() {
  return (
    <section className="tc-testimonials-style2">
      <div className="container">
        <div className="content">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="testi-slider">
                <div className="swiper-wrapper">
                  <div className="swiper-slide">
                    <div className="testi-card">
                      <div className="text js-splittext-lines">
                        “We always knew what was happening and what was going to
                        happen. They did amazing work and an exquisite design
                        and the lighting is incredible.”
                      </div>
                      <div className="author-inf mt-50">
                        <p className="fsz-18 fw-600"> Dominik Szoboszlai </p>
                        <small className="fsz-14 color-666 mt-15">
                          Investor of Dallas Homestay Group JSC
                        </small>
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

export default Testimonials;
