import React from 'react';
import data from '../../data/home2/slider';
function Header() {
  return (
    <header className="tc-header-style2">
      <div className="container">
        <div className="top-info">
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-lg-8">
                <h1>
                  Bring the breathe into
                  <span className="sub-font"> the space </span>
                </h1>
                <div className="award-wrapper">
                  <p> An Award Winning Studio </p>
                  <span className="line"></span>
                  <p> 2020 </p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="side-info ps-lg-5">
                  <div className="facts-wrapper" data-speed="1" data-lag="0.5">
                    <div className="title fsz-12 text-uppercase mb-30">
                      <i className="icon-6 bg-orange1 rounded-circle me-2"></i>
                      The Facts
                    </div>
                    <div className="numbers">
                      <div className="row">
                        <div className="col-6">
                          <h2 className="num sub-font">
                            <span className="counter">92</span>%
                          </h2>
                          <p> Clients Satisfied </p>
                        </div>
                        <div className="col-6">
                          <h2 className="num sub-font">
                            <span className="counter">152</span>
                          </h2>
                          <p> Projects Done </p>
                        </div>
                      </div>
                    </div>
                    <img
                      src="/home2/assets/img/subtract.png"
                      alt=""
                      className="line"
                    />
                  </div>
                  <div className="text color-666 mt-80">
                    Our goal is to create spaces that are not only <br />
                    beautiful, but also functional & comfortable
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="slider-content wow zoomIn slow" data-wow-delay="0.2s">
        <div className="container-fluid">
          <div className="head-slider">
            <div className="swiper-wrapper">
              {data.map((item, i) => (
                <div key={i} className="swiper-slide">
                  <div className="slider-card">
                    <div className="img">
                      <img
                        src={item.img}
                        alt=""
                        className="main-img img-cover"
                      />
                    </div>
                    <div className="info">
                      <div className="container">
                        <div className="cont">
                          <div className="tags">
                            <a href="#"> {item.sub1} </a>
                            <a href="#"> {item.sub2} </a>
                          </div>
                          <h2 className="title">
                            <a href="#">{item.title}</a>
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="controls">
              <div className="swiper-button-prev"></div>
              <div className="swiper-pagination"></div>
              <div className="swiper-button-next"></div>
              <img
                src="/home2/assets/img/controls_bg.png"
                alt=""
                className="cont-bg"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="head-features">
          <div className="row gx-0 justify-content-between">
            <div className="col-lg-3">
              <div className="feat-card">
                <span className="icon">
                  <i className="fal fa-betamax"></i>
                </span>
                <b className="fsz-18 fw-600">
                  360 Panorama & 3D Virtual Reality Experience
                </b>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="feat-card">
                <span className="icon">
                  <i className="fal fa-leaf"></i>
                </span>
                <b className="fsz-18 fw-600">
                  Crafted Furniture <br /> and Sustainable Material
                </b>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="feat-card">
                <span className="icon">
                  <i className="fal fa-bezier-curve"></i>
                </span>
                <b className="fsz-18 fw-600">
                  Young, Enthusiastic and <br /> Innovative Architects
                </b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
