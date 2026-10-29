import React from 'react';
import data from '../../data/home3_construction/partners';
function Partners() {
  return (
    <section className="tc-partners-style3">
      <div className="container">
        <div className="title mb-80">
          <div className="row">
            <div className="col-lg-4">
              <h5
                className="fsz-30 text-uppercase wow fadeInUp slow"
                data-wow-delay="0.2s"
              >
                our partners
              </h5>
            </div>
            <div className="col-lg-8 mt-4 mt-lg-0">
              <div
                className="text fsz-18 wow fadeInUp slow"
                data-wow-delay="0.4s"
              >
                We are proud to have been trusted and chosen by trusted partners
                for the past 25 years, here are the prominent names
              </div>
            </div>
          </div>
        </div>
        <div className="logos">
          {data.map((item, i) => (
            <a
              key={i}
              href="#"
              className="logo-card wow fadeInUp slow"
              data-wow-delay={item.delay}
            >
              <span className="num">{i + 1}</span>
              <img src={item.img} alt="" className="logo" />
              <p> {item.title} </p>
            </a>
          ))}
        </div>
      </div>
      <img
        src="/home3_construction/assets/img/bg_pattern.png"
        alt=""
        className="bg"
        data-speed="0.8"
      />
    </section>
  );
}

export default Partners;
