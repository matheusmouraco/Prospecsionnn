import React from 'react';

function About() {
  return (
    <div className="swiper-slide">
      <section className="section tc-about-style8">
        <div className="container">
          <div className="fixed-btns d-block d-lg-none mb-40">
            <a href="#0" className="menu-icon">
              <span>
                <i className="fal fa-bars-sort"></i>
              </span>
            </a>
            <a
              href="#"
              className="butn hover-bg-black text-uppercase bg-orange1 text-white rounded-pill me-4"
            >
              <span> Start A Project </span>
            </a>
            <a href="#" className="lang-icon">
              <span>
                <i className="fal fa-globe"></i>
              </span>
            </a>
          </div>
          <div className="section-head mb-4 mb-lg-0">
            <h3 className="fsz-30 fw-600 text-uppercase">
              About <br /> us
            </h3>
          </div>
          <div className="section-body">
            <div className="text fsz-16">
              We cut ourteeth on designing and creating buildings <br /> that
              are both beautiful and sustainable.
            </div>
            <a
              href="#"
              className="butn border rounded-pill border-white hover-bg-orange1 text-capitalize text-white mt-20 fsz-13 pt-15 pb-15"
            >
              <span> About Studio </span>
            </a>
            <h1>
              Archin Design <br /> Studio
            </h1>
            <span className="num mt-40"> 01 </span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
