import React from 'react';

function Services() {
  return (
    <section className="tc-services-style3">
      <div className="container">
        <div className="top-inf mb-80">
          <div className="row">
            <div className="col-lg-4">
              <h5
                className="fsz-30 text-uppercase wow fadeInUp slow"
                data-wow-delay="0.2s"
              >
                our services
              </h5>
            </div>
            <div className="col-lg-4">
              <div
                className="text fsz-18 mt-4 mt-lg-0 pe-lg-5 wow fadeInUp slow"
                data-wow-delay="0.4s"
              >
                ARCHIN Constructions has a passion for perfection. We see great
                value in focusing on the finer details that can make a big
                difference to the end result
              </div>
            </div>
            <div className="col-lg-4">
              <div
                className="text fsz-18 mt-4 mt-lg-0 wow fadeInUp slow"
                data-wow-delay="0.6s"
              >
                We commitment to quality design & projects are always delivered
                to an exceptional standard.
              </div>
            </div>
          </div>
        </div>
        <div className="servives-cards">
          <div className="row gx-0">
            <div className="col-lg-4">
              <a
                href="#"
                className="service-card wow fadeInLeft"
                data-wow-delay="0.6s"
              >
                <div className="num">
                  <span className="num-cir"> 1 </span>
                </div>
                <div className="img">
                  <img
                    src="/home3_construction/assets/img/services/ser1.jpg"
                    alt=""
                    className="img-cover"
                  />
                </div>
                <div className="info">
                  <p className="fsz-14 color-666"> 24 Cases </p>
                  <h3 className="fsz-45 text-uppercase fw-500 mt-15">
                    interior
                  </h3>
                </div>
              </a>
            </div>
            <div className="col-lg-6">
              <a
                href="#"
                className="service-card wow zoomIn"
                data-wow-delay="0.2s"
              >
                <div className="num">
                  <span className="num-cir"> 2 </span>
                </div>
                <div className="img">
                  <img
                    src="/home3_construction/assets/img/services/ser2.jpg"
                    alt=""
                    className="img-cover"
                  />
                </div>
                <div className="info">
                  <p className="fsz-14 color-666"> 52 Cases </p>
                  <h3 className="fsz-45 text-uppercase fw-500 mt-15">
                    construct
                  </h3>
                </div>
              </a>
            </div>
            <div className="col-lg-2">
              <a
                href="#"
                className="service-card sm-card wow fadeInRight"
                data-wow-delay="0.8s"
              >
                <div className="num">
                  <span className="num-cir"> 3 </span>
                </div>
                <div className="img">
                  <img
                    src="/home3_construction/assets/img/services/ser3.jpg"
                    alt=""
                    className="img-cover"
                  />
                </div>
                <div className="info">
                  <p className="fsz-14 color-666"> 52 Cases </p>
                  <h3 className="fsz-45 text-uppercase fw-500 mt-15">revamp</h3>
                </div>
              </a>
              <a
                href="#"
                className="all-card wow fadeInUp"
                data-wow-delay="0.4s"
              >
                <span>
                  Full <br /> Services <i className="ti-arrow-top-right"></i>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
