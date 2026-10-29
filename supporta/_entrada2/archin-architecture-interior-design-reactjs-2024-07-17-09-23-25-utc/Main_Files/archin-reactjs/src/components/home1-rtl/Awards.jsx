import React from 'react';
import data from '../../data/home1-rtl/awards';
function Awards() {
  return (
    <section className="tc-awards-style1">
      <div className="container">
        <div className="awards-content">
          <div className="mb-80 text-center js-splittext-lines">
            <h2 className="fsz-45"> الجوائز والتقديرات </h2>
          </div>
          <div className="awards-list wow fadeInUp" data-wow-delay="0.2s">
            {data.map((item, i) => (
              <div key={i} className="award-row">
                <div className="row gx-0 align-items-center">
                  <div className="col-lg-2">
                    <div className="year"> {item.year} </div>
                  </div>
                  <div className="col-lg-6 my-3 my-lg-0">
                    <h6 className="title fsz-23 fw-400">{item.title}</h6>
                  </div>
                  <div className="col-lg-2">
                    <p>
                      <i className="la la-map-marker me-3"></i> {item.location}
                    </p>
                  </div>
                  <div className="col-lg-2 text-lg-end mt-4 mt-lg-0">
                    <i className="ti-arrow-top-right fsz-20"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-100 mb-40">
            <a href="#" className="butn border rounded-pill hover-bg-orange1">
              <span>
                مشاهدة المزيد <i className="small ms-1 la la-angle-down"></i>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Awards;
