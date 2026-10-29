import React from 'react';
import data from '../../data/home8_portfolio/partners';
function Partners() {
  return (
    <div className="swiper-slide reverse-color">
      <section className="section tc-partners-style8">
        <div className="container">
          <div className="section-head mb-4 mb-lg-0">
            <h3 className="fsz-30 fw-600 text-uppercase">
              our <br /> partners
            </h3>
          </div>
          <div className="section-body">
            <div className="logos">
              {data.map((item, i) => (
                <a key={i} href="#" className="logo-card">
                  <span className="num">1</span>
                  <img src={item.img} alt="" className="logo" />
                  <p> {item.title} </p>
                  <span className="plus-icon">
                    <i className="fal fa-plus"></i>
                  </span>
                  <div className="float-inf">
                    <small>
                      Award winning landscape <br /> design studio in Boston.
                      <br /> Long-term partner in helping <br /> us for
                      sustainable solutions
                    </small>
                  </div>
                </a>
              ))}
            </div>
            <span className="num mt-40"> 05 </span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Partners;
