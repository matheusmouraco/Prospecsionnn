import React from 'react';

function Banners() {
  return (
    <section className="tc-banners-style6">
      <div className="container">
        <div className="banners">
          <div className="row">
            <div className="col-lg-6">
              <a
                href="#0"
                className="banner-card wow zoomIn slow"
                data-wow-delay="0.2s"
              >
                <div className="img">
                  <img
                    src="/home6_furniture/assets/images/banner1.jpg"
                    alt=""
                    className="img-cover"
                  />
                </div>
                <div className="info">
                  <span className="float-arrow">
                    <i className="fal fa-arrow-up-right"></i>
                  </span>
                  <div className="cont">
                    <div className="text fsz-14 text-uppercase mb-50">
                      A good home workspace starts with <br /> the right
                      furniture
                    </div>
                    <h3> work from home, elevated </h3>
                  </div>
                </div>
              </a>
            </div>
            <div className="col-lg-6">
              <a
                href="#0"
                className="banner-card wow zoomIn slow"
                data-wow-delay="0.4s"
              >
                <div className="img">
                  <img
                    src="/home6_furniture/assets/images/banner2.jpg"
                    alt=""
                    className="img-cover"
                  />
                </div>
                <div className="info">
                  <span className="float-arrow">
                    <i className="fal fa-arrow-up-right"></i>
                  </span>
                  <div className="cont">
                    <div className="text fsz-14 text-uppercase mb-50">
                      discover our latest collection with <br /> luxury rugs &
                      more
                    </div>
                    <h3> winter warm </h3>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banners;
