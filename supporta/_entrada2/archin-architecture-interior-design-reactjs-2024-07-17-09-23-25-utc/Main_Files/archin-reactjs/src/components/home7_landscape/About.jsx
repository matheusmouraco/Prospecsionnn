import React from 'react';

function About() {
  return (
    <section className="tc-about-style7">
      <div className="container">
        <div className="row gx-0 justify-content-between">
          <div className="col-lg-3">
            <div className="rotate-box" data-speed="1" data-lag="0.4">
              <a
                href="#"
                className="rotate-circle fsz-30 rotate-text d-inline-block text-uppercase"
              >
                <svg className="textcircle" viewBox="0 0 500 500">
                  <defs>
                    <path
                      id="textcircle"
                      d="M250,400 a150,150 0 0,1 0,-300a150,150 0 0,1 0,300Z"
                    ></path>
                  </defs>
                  <text>
                    <textPath xlinkHref="#textcircle" textLength="900">
                      Landscape design - archin Studio -
                    </textPath>
                  </text>
                </svg>
              </a>
              <img
                src="/home7_landscape/assets/img/leafs.png"
                alt=""
                className="icon"
              />
            </div>
          </div>
          <div className="col-lg-5">
            <div className="info wow fadeInUp slow" data-wow-delay="0.2s">
              <div className="text fsz-25 fw-500 mb-20">
                Archin Design Studio is a landscape design and construction firm
                based in Portland, Oregon that creates residential outdoor
                living spaces and gardens. We strive to create meaningful spaces
                that fulfill our clients visions and function great for years to
                come.
              </div>
              <div className="text fsz-25 fw-500 mb-20">
                Our mission is on bringing a balance of healthy, beautiful
                living spaces to our clients.
              </div>
              <a
                href="#"
                className="butn border rounded-pill border-green1 hover-bg-green1 text-capitalize color-green1 mt-70"
              >
                <span> More About Us </span>
              </a>
            </div>
          </div>
          <div className="col-lg-2">
            <div className="numbers mt-5 mt-lg-0">
              <div
                className="number-card wow zoomIn slow"
                data-wow-delay="0.4s"
              >
                <h2 className="numb"> 95% </h2>
                <small> Clients Satisfied and repeating </small>
              </div>
              <div
                className="number-card wow zoomIn slow"
                data-wow-delay="0.6s"
              >
                <h2 className="numb"> 125% </h2>
                <small> projects done </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
