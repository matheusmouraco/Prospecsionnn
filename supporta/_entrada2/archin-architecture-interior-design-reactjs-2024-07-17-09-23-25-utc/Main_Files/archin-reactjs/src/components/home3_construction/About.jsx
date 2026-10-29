import React from 'react';

function About() {
  return (
    <section className="tc-about-style3">
      <div className="top-info">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <div className="info">
                <h5 className="fsz-30 text-uppercase mb-80"> Since 1962 </h5>
                <div className="text fsz-18 mb-15">
                  We specialise in a wide range of construction services for
                  private and commercial clients ranging from extensions, to
                  complete renovations and development.
                </div>
                <div className="text fsz-18 mb-15">
                  With the foundations built upon family and an ethos of hard
                  work and integrity, Archin Contractors Co. has become a
                  leading contractor in North Carolina of United States.
                </div>
                <a
                  href="#"
                  className="butn borderd mt-70 bg-white py-2 px-3 text-uppercase ltspc-1 hover-bg-yellow1"
                >
                  <span>
                    About us <i className="small ms-1 ti-arrow-top-right"></i>
                  </span>
                </a>
              </div>
            </div>
            <div className="col-lg-8 offset-lg-1">
              <div className="numbers-boxes">
                <div
                  className="sm-card js-splittext-lines"
                  data-speed="1"
                  data-lag="0.4"
                >
                  <h4 className="fsz-70 mb-30"> 52 </h4>
                  <p className="p text-uppercase">
                    awards & <br /> recognitons
                  </p>
                </div>
                <div
                  className="md-card js-splittext-lines"
                  data-speed="1"
                  data-lag="0.8"
                >
                  <h3 className="fsz-90 mb-90 fw-500"> 154 </h3>
                  <p className="p text-uppercase">
                    completed projects <br /> in 26+ cities
                  </p>
                </div>
                <div
                  className="lg-card js-splittext-lines"
                  data-speed="1"
                  data-lag="0.2"
                >
                  <h2 className="fw-500"> 25 </h2>
                  <h6 className="text-uppercase text-end fsz-18 lh-4">
                    years of <br /> experience
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        <img
          src="/home3_construction/assets/img/about_pat.png"
          alt=""
          className="pattern"
        />
      </div>
      <div className="img-content wow">
        <img
          src="/home3_construction/assets/img/about.jpg"
          alt=""
          className="img-cover main-img"
        />
      </div>
    </section>
  );
}

export default About;
