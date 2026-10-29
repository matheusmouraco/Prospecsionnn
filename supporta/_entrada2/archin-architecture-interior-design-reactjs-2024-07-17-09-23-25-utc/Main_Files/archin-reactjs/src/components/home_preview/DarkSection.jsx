import React from 'react';
import data from '../../data/main-page/innerpages';
function DarkSection() {
  return (
    <section className="tc-dark-sections pt-80">
      <div className="tc-inner-pages">
        <div className="container">
          <div
            className="top-info mb-80 wow fadeInUp slow"
            data-wow-delay="0.2s"
          >
            <div className="row justify-content-between">
              <div className="col-lg-5">
                <h3 className="fsz-45 fw-600"> Beautiful Inner Pages </h3>
              </div>
              <div className="col-lg-5">
                <div className="text fsz-16 color-ccc text-lg-end mt-4 mt-lg-0">
                  From Fancy Images to Asymmetric Slider, Archin includes <br />
                  every element you may need to create any kind ofwebsite
                  without 3rd party plugins.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pages-slider wow fadeInUp slow" data-wow-delay="0.4s">
          <div className="swiper-wrapper">
            {data.map((item, i) => (
              <div key={i} className="swiper-slide">
                <a href={item.link} className="img d-block" target="_blank">
                  <img src={item.img} alt="" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default DarkSection;
