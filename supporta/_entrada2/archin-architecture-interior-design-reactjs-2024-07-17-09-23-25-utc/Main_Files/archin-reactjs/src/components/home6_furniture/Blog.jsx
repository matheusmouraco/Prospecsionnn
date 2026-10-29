import React from 'react';
import data from '../../data/home6_furniture/blogs';
function Blog() {
  return (
    <section className="tc-blog-style6">
      <div className="container">
        <div className="title mb-30">
          <div className="row">
            <div className="col-lg-9">
              <div className="section-title">
                <h2 className="js-splittext-lines"> news & inspirations </h2>
              </div>
            </div>
            <div className="col-lg-3 text-lg-end mt-5 mt-lg-0">
              <a
                href="#"
                className="butn border radius-4 border-brown2 hover-bg-brown2 text-capitalize color-brown2"
              >
                <span> See All Articles </span>
              </a>
            </div>
          </div>
        </div>
        <div className="row gx-5">
          {data.map((item, i) => (
            <div
              key={i}
              className={`col-lg-4 mt-50  ${
                i != data.length - 1 && 'border-end'
              }`}
            >
              <div
                className="post-card wow fadeInUp slow"
                data-wow-delay="0.2s"
              >
                <a href="#" className="img">
                  <img src={item.img} alt="" className="img-cover" />
                </a>
                <div className="info">
                  <div className="tags">
                    <a href="#"> {item.category} </a>
                    <a href="#"> {item.history} </a>
                  </div>
                  <h3>
                    <a
                      href="#"
                      className="fsz-30 hover-brown2 fw-400 mt-20 pe-lg-4"
                    >
                      {item.title}
                    </a>
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Blog;
