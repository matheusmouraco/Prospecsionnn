import React from 'react';
import data from '../../data/home10/services';
function Services() {
  return (
    <section className="tc-services-style10 section-padding section-padding-x">
      <div className="container-fluid">
        <div className="section-head-style10 js-splittext-lines">
          <div className="sub-title mb-30"> our services </div>
          <h2> Perfect solutions for the dreams </h2>
        </div>
        <div className="services">
          <div className="row">
            {data.map((item, i) => (
              <div key={i} className="col-lg-3">
                <a
                  href="#"
                  className="service-card mt-80 pe-lg-5 wow fadeInUp"
                  data-wow-delay="0.2s"
                >
                  <div className="img">
                    <img src={item.img} alt="" className="img-cover" />
                  </div>
                  <div className="info">
                    <h5 className="fsz-27">{item.title}</h5>
                    <p className="color-666 mt-20">{item.desc}</p>
                    <span className="arrow">
                      <i className="ti-arrow-top-right"></i>
                    </span>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
