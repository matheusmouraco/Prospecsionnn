import React from 'react';
import data from '../../data/home1-rtl/header-slider';
function Header() {
  return (
    <header className="tc-header-style1">
      <div className="header-slider">
        <div className="swiper-wrapper">
          {data.map((item, i) => (
            <div key={i} className="swiper-slide">
              <div className="slider-card">
                <div className="img">
                  <img src={item.img} alt="" className="img-cover" />
                </div>
                <div className="info section-padding-x pb-70">
                  <div className="row align-items-end gx-5">
                    <div className="col-lg-6 offset-lg-2">
                      <h1 data-swiper-parallax="-2000" className="">
                        {item.title}
                      </h1>
                      <h5 className="fsz-30 mt-30 fw-400">{item.subTitle}</h5>
                    </div>
                    <div className="col-lg-3">
                      <div className="cont pb-30">
                        <div className="text fsz-17 fw-300 lh-4">
                          {item.desc}
                        </div>
                        <a
                          href="#"
                          className="butn border rounded-pill mt-60 hover-bg-white"
                        >
                          <span>
                            خدماتنا
                            <i className="small ms-1 ti-arrow-top-right"></i>
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="slider-controls">
          <div className="swiper-button-prev"></div>
          <div className="swiper-button-next"></div>
        </div>
        <div className="swiper-pagination"></div>
      </div>
    </header>
  );
}

export default Header;
