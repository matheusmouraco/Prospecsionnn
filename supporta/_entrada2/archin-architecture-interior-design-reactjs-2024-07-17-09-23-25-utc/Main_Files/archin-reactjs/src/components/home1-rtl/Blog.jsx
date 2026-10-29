import React from 'react';
import data from '../../data/home1-rtl/blogs';
function Blog() {
  return (
    <section className="tc-blog-style1">
      <div className="container">
        <div className="mb-80 js-splittext-lines">
          <div className="row">
            <div className="col-lg-9">
              <h2 className="fsz-45"> المدونة </h2>
            </div>
            <div className="col-lg-3 text-lg-end mt-4 mt-lg-0">
              <a
                href="#"
                className="butn border rounded-pill color-orange1 border-orange1 hover-bg-orange1"
              >
                <span>
                  جميع الاخبار <i className="small ms-1 ti-arrow-top-right"></i>
                </span>
              </a>
            </div>
          </div>
        </div>
        <div className="blog-slider position-relative overflow-hidden">
          <div className="swiper-wrapper">
            {data.map((item, i) => (
              <div key={i} className="swiper-slide">
                <div className="blog-card">
                  <div className="img">
                    <img src={item.img} alt="" className="img-cover" />
                  </div>
                  <div className="info">
                    <div className="date">
                      <div className="num fsz-45 mb-2"> 25 </div>
                      <small className="fsz-12 text-uppercase color-666">
                        {item.history.split('<br />')[0]}
                        <br />
                        {item.history.split('<br />')[1]}
                      </small>
                    </div>
                    <div className="cont">
                      <a
                        href="#"
                        className="title d-block fsz-24 hover-orange1 mb-15 fw-600"
                      >
                        {item.title}
                      </a>
                      <small className="fsz-12 color-orange1">
                        {item.subTitle}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="swiper-button-next"></div>
      <div className="swiper-button-prev"></div>
    </section>
  );
}

export default Blog;
