import React from 'react';

function Services() {
  return (
    <div className="swiper-slide reverse-color">
      <section className="section tc-services-style8">
        <div className="container">
          <div className="section-head mb-4 mb-lg-0">
            <h3 className="fsz-30 fw-600 text-uppercase">
              our <br /> services
            </h3>
          </div>
          <div className="section-body">
            <div className="row gx-3">
              <div className="col-lg-7">
                <a href="#" className="service-card">
                  <div className="top-info">
                    <span className="title">
                      Architecture and <br /> Interior
                    </span>
                    <span className="icon">
                      <i className="fal fa-bezier-curve"></i>
                    </span>
                  </div>
                  <div className="tags">
                    <span className="tag"> Architecture Design </span>
                    <span className="tag"> 3D Render </span>
                    <span className="tag"> CGI </span>
                    <span className="tag"> Interior Design </span>
                    <span className="tag"> Constructions, </span>
                    <span className="tag"> Landscape Design, </span>
                    <span className="tag"> Consulting </span>
                  </div>
                </a>
              </div>
              <div className="col-lg-5">
                <a href="#" className="service-card r-card mt-3 mt-lg-0">
                  <div className="top-info">
                    <span className="title">
                      bespoke <br /> furniture
                    </span>
                    <span className="icon">
                      <i className="fal fa-bed"></i>
                    </span>
                  </div>
                  <div className="tags">
                    <span className="tag"> Bespoke Furnitures </span>
                    <span className="tag"> Online Store </span>
                    <span className="tag"> Decor </span>
                    <span className="tag"> Material Supply </span>
                  </div>
                </a>
              </div>
            </div>
            <div className="text fsz-16 color-666 mt-40">
              We provide best solution for your dream, still adapt your budget
              <br /> and match with requires about quality of project
            </div>
            <span className="num mt-40"> 02 </span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Services;
