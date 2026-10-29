import React from 'react';
import data from '../../../data/innerpages/single_project/testimonials';
function Testimonials() {
  return (
    <section className="tc-testimonials-style1">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 wow zoomIn slow" data-wow-delay="0.2s">
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
                  {data.map((item, i) => (
                    <div key={i} className="swiper-slide">
                      <div className="clients-card">
                        <div className="text fsz-45 fw-600 lh-2 js-splittext-lines">
                          {item.desc}
                        </div>
                        <div className="author">
                          <div className="au-img">
                            <img src={item.img} alt="" className="img-cover" />
                          </div>
                          <div className="au-inf">
                            <h6 className="text-capitalize mb-2 fsz-16 fw-bold">
                              {item.title}
                            </h6>
                            <p className="text-capitalize fsz-14 color-666">
                              {item.subTitle}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
      <img
        src="/innerpages/assets/img/c_line3.png"
        alt=""
        className="c-line wow"
      />
    </section>
  );
}

export default Testimonials;
