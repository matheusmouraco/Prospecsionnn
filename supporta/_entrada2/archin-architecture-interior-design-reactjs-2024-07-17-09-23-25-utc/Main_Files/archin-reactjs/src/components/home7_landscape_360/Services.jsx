import React from 'react';
import data from '../../data/home7_landscape/services';
function Services() {
  return (
    <section className="tc-services-style7">
      <div className="container">
        <div className="content">
          <h2 className="fsz-60 text-center text-capitalize fw-400 mb-30 js-splittext-lines">
            Our Services
          </h2>
          <div className="cards">
            <div className="row">
              {data.map((item, i) => (
                <div key={i} className="col-lg-4">
                  <a
                    href="#"
                    className="service-card wow fadeInUp slow"
                    data-wow-delay="0.2s"
                  >
                    <div className="top-info">
                      <p className="fsz-14 text-uppercase">
                        {item.title.split('<br />')[0]} <br />{' '}
                        {item.title.split('<br />')[1]}
                      </p>
                      <span className="icon">
                        <i className="fal fa-bezier-curve"></i>
                      </span>
                    </div>
                    <div className="img mb-60">
                      <img
                        src="/home7_landscape/assets/img/services/ser1.png"
                        alt=""
                        className="img-cover"
                      />
                    </div>
                    <div className="text">{item.desc}</div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
