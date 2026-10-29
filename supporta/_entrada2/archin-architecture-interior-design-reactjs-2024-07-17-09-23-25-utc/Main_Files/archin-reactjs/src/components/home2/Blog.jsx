import React from 'react';
import data from '../../data/home2/blogs';
function Blog() {
  return (
    <section className="tc-blog-style2">
      <div className="container">
        <div className="row align-items-center mb-40">
          <div className="col-lg-8">
            <h2 className="fsz-45 fw-500">
              Latest
              <span className="sub-font fst-italic color-orange1 fw-400">
                Posts
              </span>
            </h2>
          </div>
          <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
            <a
              href="#"
              className="butn borderd border rounded-pill hover-bg-black bg-white"
            >
              <span>
                All Articles
                <i className="ms-2 fal fa-long-arrow-right ico-45"></i>
              </span>
            </a>
          </div>
        </div>
        <div className="posts">
          <div className="row">
            {data.map((item, i) => (
              <div key={i} className="col-lg-3">
                <div
                  className="blog-card wow fadeInUp slow"
                  data-wow-delay={item.delay}
                >
                  <a href="#" className="img">
                    <img src={item.img} alt="" className="img-cover" />
                    <div className="arrow">
                      <i className="fal fa-long-arrow-right ico-45"></i>
                    </div>
                  </a>
                  <div className="info pt-30">
                    <h5 className="title fsz-24 fw-600">
                      <a href="#" className="hover-orange1">
                        {item.title}
                      </a>
                    </h5>
                    <div className="text mt-3 color-666">{item.desc}</div>
                    <div className="tags">
                      <a href="#"> {item.subTitle} </a>
                      <a href="#"> {item.history} </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Blog;
