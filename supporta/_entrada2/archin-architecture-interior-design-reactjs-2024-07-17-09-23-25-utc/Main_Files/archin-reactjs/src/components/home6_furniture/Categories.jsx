import React from 'react';
import data from '../../data/home6_furniture/categories';
function Categories() {
  return (
    <section className="tc-categories-style6">
      <div className="container">
        <div className="section-title mb-50 text-center">
          <h2 className="js-splittext-lines"> popular categories </h2>
        </div>
        <div className="row wow fadeInUp slow" data-wow-delay="0.2s">
          {data.map((item, i) => (
            <div key={i} className="col-lg-2 col-6">
              <a href="#" className="cat-card">
                <div className="img">
                  <img src={item.img} alt="" className="img-contain" />
                </div>
                <div className="info py-4">
                  <h6 className="fsz-18 text-uppercase"> {item.title} </h6>
                </div>
              </a>
            </div>
          ))}
        </div>
        <div className="text-center wow fadeInUp slow" data-wow-delay="0.3s">
          <a
            href="#"
            className="butn border radius-4 border-brown2 hover-bg-brown2 text-capitalize color-brown2 mt-80"
          >
            <span> View All Categories </span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Categories;
