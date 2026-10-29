import React from 'react';
import data from '../../data/home2/awards';
function Award() {
  return (
    <section className="tc-awards-style2">
      <div className="container">
        <h2 className="fsz-45 fw-500 text-center mb-30">
          Featured
          <span className="sub-font fst-italic color-orange1 fw-400">
            awards
          </span>
        </h2>
        <div className="awards">
          <div className="row">
            {data.map((item, i) => (
              <div key={i} className="col-lg-3">
                <div
                  className="award-card wow fadeInUp slow"
                  data-wow-delay={item.delay}
                >
                  <div className="logo">
                    <img src={item.img} alt="" />
                  </div>
                  <h5 className="fsz-24 sub-font title">{item.title}</h5>
                  <a href="#" className="color-666 text-capitalize">
                    {item.subTitle}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Award;
