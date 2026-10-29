import React from 'react';
import data from '../../data/home5_residence/services';
function Services() {
  return (
    <section className="tc-services-style5">
      <div className="container">
        <div className="content">
          <div className="title mb-120">
            <div className="row justify-content-between">
              <div className="col-lg-6">
                <h2 className="fsz-70 text-uppercase fw-400 js-splittext-lines">
                  <span className="color-brown1">premium service</span> <br /> &
                  amenities
                </h2>
              </div>
              <div className="col-lg-5">
                <h6 className="color-brown1 text-uppercase fsz-24 lh-4 js-splittext-lines">
                  20+ premium and essential services in archin, constributing to
                  enhancing resident’s life experience
                </h6>
              </div>
            </div>
          </div>
          <div className="services">
            {data.map((item, i) => (
              <a
                key={i}
                href="#"
                className="service-card wow fadeInUp slow"
                data-wow-delay="0.2s"
              >
                <span className="num">{i + 1}</span>
                <div className="icon">
                  <i className={item.img}></i>
                </div>
                <div className="info">
                  <h6> {item.title} </h6>
                  <p> {item.subTitle} </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
