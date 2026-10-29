import React from 'react';

function Mobile() {
  return (
    <section className="tc-mobile">
      <div className="container">
        <div className="row align-items-center justify-content-between">
          <div className="col-lg-5">
            <div className="info wow fadeInUp slow" data-wow-delay="0.2s">
              <h2 className="fsz-45 fw-600 mb-30">
                Responsive Friendly <br /> & Optimized
              </h2>
              <div className="text fsz-16 mb-60 color-666">
                Archin automatically detects the screen size and adjust the
                content accordingly to provide fully responsive and optimised
                sites.
              </div>
              <ul className="check-list fsz-20 fw-600 lh-7">
                <li>
                  <span className="icon me-2">
                    <i className="fal fa-check-circle"></i>
                  </span>
                  <span className="txt"> Hide any sections </span>
                </li>
                <li>
                  <span className="icon me-2">
                    <i className="fal fa-check-circle"></i>
                  </span>
                  <span className="txt"> Custom Mobile Modules </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-3 offset-lg-1">
            <div className="img">
              <img src="/home_preview/assets/img/layout.png" alt="" />
            </div>
          </div>
          <div className="col-lg-3">
            <div
              className="img mt-5 mt-lg-0 wow zoomIn slow"
              data-wow-delay="0.4s"
            >
              <img src="/home_preview/assets/img/mobile.png" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className="marq-content">
        <div className="marq-slider">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <a href="#"> Free Support </a>
            </div>
            <div className="swiper-slide">
              <a href="#"> Lifetime Updates </a>
            </div>
          </div>
        </div>
      </div>
      <img src="/home_preview/assets/img/pattern.png" alt="" className="patt" />
    </section>
  );
}

export default Mobile;
