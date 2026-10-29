import React from 'react';
import testimonials from '../../data/home10/testimonials';
import awards from '../../data/home10/awards';
function Awards() {
  return (
    <section className="tc-awards-clients-style10">
      <div className="row gx-0">
        <div className="col-lg-7">
          <div className="tc-awards-style10 section-padding section-padding-x">
            <div className="section-head-style10 mb-60 js-splittext-lines">
              <div className="sub-title mb-30"> Recogniztion </div>
              <h2> Our awards </h2>
            </div>
            <div className="awards-list wow fadeInUp" data-wow-delay="0.2s">
              {awards.map((item, i) => (
                <div key={i} className="award-row">
                  <div className="row gx-0">
                    <div className="col-lg-2">
                      <div className="year"> {item.history} </div>
                    </div>
                    <div className="col-lg-7 my-3 my-lg-0">
                      <h6 className="title fsz-18">{item.title}</h6>
                    </div>
                    <div className="col-lg-3 text-lg-end">
                      <a href="#"> {item.desc} </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="tc-clients-style10 section-padding section-padding-x">
            <div className="section-head-style10 mb-60 js-splittext-lines">
              <div className="sub-title mb-30 color-ccc"> testimonial </div>
              <h2> From our clients </h2>
            </div>
            <div className="clients-slider1 wow fadeInUp" data-wow-delay="0.2s">
              <div className="swiper-wrapper">
                {testimonials.map((item, i) => (
                  <div key={i} className="swiper-slide">
                    <div className="clients-card">
                      <div className="text fsz-19 fw-300">{item.desc}</div>
                      <a
                        href="#"
                        className="mt-30 color-999 text-decoration-underline"
                      >
                        {item.title}
                      </a>
                      <div className="author mt-40">
                        <div className="au-img">
                          <img src={item.img} alt="" className="img-cover" />
                        </div>
                        <div className="au-inf">
                          <h6 className="text-capitalize mb-2 fsz-16">
                            {item.name}
                          </h6>
                          <p className="text-uppercase fsz-12 color-ccc">
                            {item.subName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="slider-controls mt-80">
                <div className="swiper-button-prev"></div>
                <div className="swiper-pagination"></div>
                <div className="swiper-button-next"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Awards;
