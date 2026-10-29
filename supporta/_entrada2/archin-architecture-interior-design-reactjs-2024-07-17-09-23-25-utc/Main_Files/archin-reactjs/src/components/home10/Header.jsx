import React from 'react';
import data from '../../data/home10/slider';
function Header() {
  return (
    <header className="tc-header-style10">
      <div className="header-slider">
        <div className="swiper-wrapper">
          {data.map((item, i) => (
            <div key={i} className="swiper-slide">
              <div className="slider-card">
                <div className="img">
                  <img src={item.img} alt="" className="img-cover" />
                </div>
                <div className="info section-padding-x">
                  <div className="row align-items-end">
                    <div className="col-lg-6">
                      <h1 data-swiper-parallax="-2000" className="js-title">
                        archin
                      </h1>
                    </div>
                    <div className="col-lg-3">
                      <div className="cont pb-30">
                        <h6 className="fsz-20 text-uppercase mb-30 fw-300">
                          Since {item.history}
                        </h6>
                        <div className="text fsz-16 fw-300 lh-4">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="float-box" data-swiper-parallax="500">
                  <h4> {item.title} </h4>
                  <ul className="fsz-20 color-666 mt-50">
                    <li>
                      <a href="tel:05432567887"> {item.num} </a>
                    </li>
                    <li>
                      <a href={`mailto:${item.email}`}>{item.email}</a>
                    </li>
                  </ul>
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
    </header>
  );
}

export default Header;
