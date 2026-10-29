import React from 'react';
import data from '../../data/home3_construction/portfolio';
function Portfolio() {
  return (
    <section className="tc-portfolio-style3">
      <div className="container">
        <div className="title">
          <div className="row">
            <div className="col-lg-4">
              <h5
                className="fsz-30 text-uppercase wow fadeInUp slow"
                data-wow-delay="0.2s"
              >
                Latest Works
              </h5>
            </div>
            <div className="col-lg-6 mt-4 mt-lg-0">
              <div className="links wow fadeInUp slow" data-wow-delay="0.4s">
                <a href="#"> all </a>
                <a href="#"> Construct </a>
                <a href="#"> interior </a>
                <a href="#"> renovation </a>
              </div>
            </div>
            <div className="col-lg-2 text-lg-end mt-4 mt-lg-0">
              <a
                href="#"
                className="text-uppercase hover-yellow1 wow fadeInUp slow"
                data-wow-delay="0.6s"
              >
                <span> all projects </span>
                <i className="ti-arrow-top-right ms-2"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="projects-slider">
          <div className="swiper-wrapper">
            {data.map((item, i) => (
              <div key={i} className="swiper-slide">
                <div className="project-card">
                  <div className="row">
                    <div className="col-lg-3">
                      <div className="info">
                        <h2 className="fsz-45 text-uppercase fw-500 mb-30">
                          {item.title.split('<br />')[0]} <br />{' '}
                          {item.title.split('<br />')[1]}
                        </h2>
                        <small className="fsz-12 d-block mb-40">
                          {item.subTitle}
                        </small>
                        <p className="fsz-18">
                          {item.desc.split('<br />')[0]} <br />{' '}
                          {item.desc.split('<br />')[1]}
                        </p>
                        <a href="#" className="arrow-icon">
                          <i className="ti-arrow-top-right"></i>
                        </a>
                      </div>
                    </div>
                    <div className="col-lg-8 offset-lg-1">
                      <div className="main-img">
                        <img src={item.img} alt="" className="img-cover" />
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
        </div>
      </div>
      <img
        src="/home3_construction/assets/img/bg_pattern.png"
        alt=""
        className="bg"
        data-speed="0.8"
      />
    </section>
  );
}

export default Portfolio;
