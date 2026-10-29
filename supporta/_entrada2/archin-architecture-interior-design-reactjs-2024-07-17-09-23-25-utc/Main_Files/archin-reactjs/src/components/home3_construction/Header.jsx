import React from 'react';
import data from '../../data/home3_construction/slider';
function Header() {
  return (
    <header className="tc-header-style3">
      <div className="header-slider">
        <div className="swiper-wrapper">
          {data.map((item, i) => (
            <div key={i} className="swiper-slide">
              <div className="slider-card">
                <div className="img">
                  <img src={item.img} alt="" className="img-cover" />
                </div>
                <div className="info">
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="title-side">
                        <h3> {item.type} </h3>
                        <a href="#" className="t-link">
                          more about <br /> archin
                        </a>
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div className="cont">
                        <div className="title" data-swiper-parallax="-500">
                          <div className="row align-items-center">
                            <div className="col-lg-6">
                              <h5> {item.advantege} </h5>
                            </div>
                            <div className="col-lg-6 text-lg-end mt-4 mt-lg-0">
                              <h6> construct & design co. </h6>
                            </div>
                          </div>
                        </div>
                        <h1 data-swiper-parallax="-1500">
                          {item.title.split('<br />')[0]} <br />{' '}
                          {item.title.split('<br />')[1]} <br />{' '}
                          {item.title.split('<br />')[2]}
                        </h1>
                        <div className="text" data-swiper-parallax="-2500">
                          {item.desc.split('<br />')[0]}
                          <br />
                          {item.desc.split('<br />')[1]}
                        </div>
                        <a
                          href="#"
                          className="arrow-icon"
                          data-swiper-parallax="-3000"
                        >
                          <i className="ti-arrow-top-right"></i>
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
