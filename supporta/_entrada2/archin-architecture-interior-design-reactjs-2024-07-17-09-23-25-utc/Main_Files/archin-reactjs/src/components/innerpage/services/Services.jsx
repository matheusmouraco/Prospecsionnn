import React from 'react';

function Services() {
  return (
    <section className="tc-services-style1">
      <div className="content section-padding section-padding-x">
        <div className="container">
          <div className="title mb-80 text-center">
            <p className="color-666 text-uppercase wow"> our services </p>
          </div>
          <div className="services">
            <div className="row">
              <div className="col-lg-3">
                <a
                  href="#"
                  className="service-card wow fadeInUp"
                  data-wow-delay="0.2s"
                >
                  <div className="icon">
                    <i className="la la-hard-hat"></i>
                  </div>
                  <h5 className="fsz-24 mb-20"> Architecture & Building </h5>
                  <div className="img">
                    <img
                      src="/innerpages/assets/img/services/ser1.jpg"
                      alt=""
                      className="img-cover"
                    />
                  </div>
                  <div className="text color-666 mt-50">
                    Planning, 3D Vissuallization, Landscape Design, Structural
                    Drawing, CGI, Construction Supervision
                  </div>
                  <span className="arrow">
                    <i className="ti-arrow-top-right"></i>
                  </span>
                </a>
              </div>
              <div className="col-lg-3">
                <a
                  href="#"
                  className="service-card mt-150 wow fadeInUp"
                  data-wow-delay="0.4s"
                >
                  <div className="icon">
                    <i className="la la-bezier-curve"></i>
                  </div>
                  <h5 className="fsz-24 mb-20">
                    {' '}
                    Interior and Exterior Design{' '}
                  </h5>
                  <div className="img">
                    <img
                      src="/innerpages/assets/img/services/ser2.jpg"
                      alt=""
                      className="img-cover"
                    />
                  </div>
                  <div className="text color-666 mt-50">
                    Interior Design, Exterior Design, Rennovation, Sustainable
                    Design, Installation, Plumbing System, 3D Experience
                  </div>
                  <span className="arrow">
                    <i className="ti-arrow-top-right"></i>
                  </span>
                </a>
              </div>
              <div className="col-lg-3">
                <a
                  href="#"
                  className="service-card wow fadeInUp"
                  data-wow-delay="0.6s"
                >
                  <div className="icon">
                    <i className="la la-bed"></i>
                  </div>
                  <h5 className="fsz-24 mb-20"> Furniture Productions </h5>
                  <div className="img">
                    <img
                      src="/innerpages/assets/img/services/ser3.jpg"
                      alt=""
                      className="img-cover"
                    />
                  </div>
                  <div className="text color-666 mt-50">
                    Bespoke Furniture, Material Supply, Online Store,
                    Distribute, 3D Modeling
                  </div>
                  <span className="arrow">
                    <i className="ti-arrow-top-right"></i>
                  </span>
                </a>
              </div>
              <div className="col-lg-3">
                <a
                  href="#"
                  className="service-card mt-150 wow fadeInUp"
                  data-wow-delay="0.8s"
                >
                  <div className="icon">
                    <i className="la la-comments"></i>
                  </div>
                  <h5 className="fsz-24 mb-20">
                    Project Consulting & Supervisor
                  </h5>
                  <div className="img">
                    <img
                      src="/innerpages/assets/img/services/ser4.jpg"
                      alt=""
                      className="img-cover"
                    />
                  </div>
                  <div className="text color-666 mt-50">
                    Project Analysis, Bid Documentation, Construction Supervisor
                  </div>
                  <span className="arrow">
                    <i className="ti-arrow-top-right"></i>
                  </span>
                </a>
              </div>
            </div>
          </div>
          <div className="text-center">
            <a
              href="#"
              className="butn rounded-pill mt-80 hover-bg-black bg-orange1 text-white"
            >
              <span>
                Get A Free Quote Now
                <i className="small ms-1 ti-arrow-top-right"></i>
              </span>
            </a>
          </div>
        </div>
      </div>
      <div className="ser-img">
        <img src="/innerpages/assets/img/services/ser.jpg" alt="" />
      </div>
    </section>
  );
}

export default Services;
