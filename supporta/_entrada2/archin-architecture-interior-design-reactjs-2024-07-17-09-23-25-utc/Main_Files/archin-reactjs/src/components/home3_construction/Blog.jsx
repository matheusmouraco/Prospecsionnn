import React from 'react';
import data from '../../data/home3_construction/blogs';
function Blog() {
  return (
    <section className="tc-blog-style3">
      <div className="container">
        <div className="title mb-80">
          <div className="row">
            <div className="col-lg-8">
              <h5
                className="fsz-30 text-uppercase wow fadeInUp slow"
                data-wow-delay="0.2s"
              >
                news & insights
              </h5>
            </div>
            <div
              className="col-lg-4 text-lg-end mt-4 mt-lg-0 wow fadeInUp slow"
              data-wow-delay="0.4s"
            >
              <a
                href="#"
                className="butn borderd bg-white py-2 px-3 text-uppercase ltspc-1 hover-bg-yellow1"
              >
                <span>
                  All Articles <i className="small ms-1 ti-arrow-top-right"></i>
                </span>
              </a>
            </div>
          </div>
        </div>
        <div className="blogs">
          {data.map((item, i) => (
            <a
              key={i}
              href="#"
              className="blog-card wow fadeInUp slow"
              data-wow-delay="0.2s"
            >
              <div className="row gx-0">
                <div className="col-lg-3">
                  <div className="img">
                    <img src={item.img} alt="" className="img-cover" />
                  </div>
                </div>
                <div className="col-lg-8 offset-lg-1">
                  <div className="info">
                    <h4 className="col-lg-7">{item.title}</h4>
                    <span className="fsz-12 color-666 text-uppercase">
                      {item.subTitle}
                    </span>
                    <span className="date">
                      <i className="la la-clock me-1"></i> {item.history}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Blog;
