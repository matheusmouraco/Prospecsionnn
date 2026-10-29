import React from 'react';

function Layouts() {
  return (
    <section className="tc-layouts">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-5">
            <div className="info wow fadeInUp slow" data-wow-delay="0.2s">
              <h2 className="fsz-45 fw-600 mb-30">
                Unique Portfolio <br /> Layouts
              </h2>
              <div className="text fsz-16 mb-30 color-666">
                With pre-defined layouts, you can create a portfolio of
                articles, images, or videos and show them in an organized and
                visually appealing way.
              </div>
              <div className="icon-cards">
                <div className="item">
                  <div className="icon">
                    <img src="/home_preview/assets/img/l1.png" alt="" />
                  </div>
                  <p className="fsz-11"> Project Slider </p>
                </div>
                <div className="item">
                  <div className="icon">
                    <img src="/home_preview/assets/img/l2.png" alt="" />
                  </div>
                  <p className="fsz-11"> Masonry </p>
                </div>
                <div className="item">
                  <div className="icon">
                    <img src="/home_preview/assets/img/l3.png" alt="" />
                  </div>
                  <p className="fsz-11"> ProCarousel </p>
                </div>
                <div className="item">
                  <div className="icon">
                    <img src="/home_preview/assets/img/l4.png" alt="" />
                  </div>
                  <p className="fsz-11"> classic Grid </p>
                </div>
                <div className="item">
                  <div className="icon">
                    <img src="/home_preview/assets/img/l5.png" alt="" />
                  </div>
                  <p className="fsz-11"> Parallax </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-7">
            <div
              className="img wow zoomIn slow mt-5 mt-lg-0"
              data-wow-delay="0.4s"
            >
              <img src="/home_preview/assets/img/layout.png" alt="" />
              <img
                src="/home_preview/assets/img/layout1.png"
                alt=""
                className="sub-img img-contain"
                data-speed="1.2"
              />
            </div>
          </div>
        </div>
      </div>
      <img
        src="/home_preview/assets/img/circle.png"
        alt=""
        className="circle rotate-center"
      />
    </section>
  );
}

export default Layouts;
