import React from 'react';

function Services() {
  return (
    <section className="tc-services-style2">
      <div className="container">
        <div className="row gx-0">
          <div className="col-lg-7">
            <h2 className="fsz-45 fw-500 mb-50">
              Archin’s
              <span className="sub-font fst-italic color-orange1 fw-400">
                services
              </span>
            </h2>
            <div className="services">
              <div className="row">
                <div className="col-lg-4">
                  <a
                    href="#"
                    className="service-card wow fadeInUp slow"
                    data-wow-delay="0.2s"
                  >
                    <div className="img">
                      <img
                        src="/home2/assets/img/services/ser1.jpg"
                        alt=""
                        className="img-cover"
                      />
                      <div className="arrow">
                        <i className="fal fa-long-arrow-right ico-45"></i>
                      </div>
                    </div>
                    <div className="info pt-30">
                      <h4 className="fsz-24"> Design </h4>
                      <p className="color-666 mt-15">
                        Interior Design, CGI, Planning, Rennovaton, Landscape
                        Design, 3D Virutal Reality
                      </p>
                    </div>
                  </a>
                </div>
                <div className="col-lg-4">
                  <a
                    href="#"
                    className="service-card wow fadeInUp slow"
                    data-wow-delay="0.4s"
                  >
                    <div className="img">
                      <img
                        src="/home2/assets/img/services/ser2.jpg"
                        alt=""
                        className="img-cover"
                      />
                      <div className="arrow">
                        <i className="fal fa-long-arrow-right ico-45"></i>
                      </div>
                    </div>
                    <div className="info pt-30">
                      <h4 className="fsz-24"> Implement </h4>
                      <p className="color-666 mt-15">
                        Building, Installations, Plumbing System,Lighting,
                        Material Supply
                      </p>
                    </div>
                  </a>
                </div>
                <div className="col-lg-4">
                  <a
                    href="#"
                    className="service-card wow fadeInUp slow"
                    data-wow-delay="0.6s"
                  >
                    <div className="img">
                      <img
                        src="/home2/assets/img/services/ser3.jpg"
                        alt=""
                        className="img-cover"
                      />
                      <div className="arrow">
                        <i className="fal fa-long-arrow-right ico-45"></i>
                      </div>
                    </div>
                    <div className="info pt-30">
                      <h4 className="fsz-24"> Commercial </h4>
                      <p className="color-666 mt-15">
                        Bespoke Furniture, Online Store
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 offset-lg-1">
            <h2 className="fsz-45 sub-font fw-500 js-splittext-lines">
              Our goal is to create spaces that are not only beautiful, but also
              <span className="color-orange1"> functional </span> and
              <span className="color-orange1"> comfortable. </span>
            </h2>
            <div className="btns">
              <a
                href="#"
                className="butn borderd border rounded-pill mt-70 hover-bg-black me-2"
              >
                <span>
                  About Us
                  <i className="ms-2 fal fa-long-arrow-right ico-45"></i>
                </span>
              </a>
              <a
                href="#"
                className="butn rounded-pill mt-70 hover-bg-black bg-orange1 text-white"
              >
                <span>
                  Our Showreel <i className="ms-2 fal fa-play"></i>
                </span>
              </a>
            </div>
          </div>
        </div>
        <div className="btm-info mt-50">
          <div className="row gx-0">
            <div className="col-lg-7">
              <h5 className="fsz-24 lh-4 wow fadeInUp slow">
                We provide best solution for your dream, still adapt your budget
                and match with requires about quality of project
              </h5>
              <a
                href="#"
                className="butn borderd border rounded-pill mt-70 hover-bg-black"
              >
                <span>
                  See Our Projects
                  <i className="ms-2 fal fa-long-arrow-right ico-45"></i>
                </span>
              </a>
            </div>
            <div className="col-lg-4 offset-lg-1">
              <div className="phone-box" data-speed="1" data-lag="0.5">
                <img
                  src="/home2/assets/img/subtract2.png"
                  alt=""
                  className="bg-img"
                />
                <h2 className="fsz-45 sub-font fw-400">T: (+706) 856 01 95</h2>
                <p className="color-666 mt-40">
                  Call us direct 24/7 for get a <br />
                  free consultation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
