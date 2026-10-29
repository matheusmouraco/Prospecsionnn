import React from 'react';

function About() {
  return (
    <section className="tc-about-style10 section-padding-x overflow-hidden">
      <div className="container-fluid">
        <div className="content section-padding border-top borderd">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="img">
                <img
                  src="/home10/assets/img/about.png"
                  alt=""
                  className="img-contain wow fadeInUp"
                  data-wow-delay="0.2s"
                />
                <div className="years-box wow zoomIn" data-wow-delay="0.5s">
                  <h4> 25 </h4>
                  <span className="text-uppercase color-666">
                    Year of <br /> Experience
                  </span>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="info">
                <div
                  className="section-head-style10 mb-50 wow fadeInUp"
                  data-wow-delay="0.4s"
                >
                  <h2 className="fsz-50 ltspc--3 lh-2 js-splittext-lines">
                    We believe that architecture has the power to shape the way
                    we live, work and interact with our sourroundings
                  </h2>
                </div>
                <div
                  className="text color-666 fsz-21 wow fadeInUp"
                  data-wow-delay="0.6s"
                >
                  Archin Studio is an archiectural practice based in Boston.
                  <br /> We cut ourteeth on designing and creating buildings
                  that are both beautiful and sustainable.
                </div>
                <a
                  href="#"
                  className="butn borderd border rounded-pill mt-80 hover-bg-black wow fadeInUp"
                  data-wow-delay="0.7s"
                >
                  <span>
                    More About Us
                    <i className="small ms-1 ti-arrow-top-right"></i>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="about-maquee">
        <div className="swiper-wrapper">
          <div className="swiper-slide">
            <a href="#"> Sustainable Design </a>
          </div>
          <div className="swiper-slide">
            <a href="#"> Building Beyond </a>
          </div>
          <div className="swiper-slide">
            <a href="#"> Functional Spaces Rationalize </a>
          </div>
          <div className="swiper-slide">
            <a href="#"> Bespoke Solutions </a>
          </div>
          <div className="swiper-slide">
            <a href="#"> Sustainable Design </a>
          </div>
          <div className="swiper-slide">
            <a href="#"> Building Beyond </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
