import React from 'react';

function Blog() {
  return (
    <section className="tc-blog-style5">
      <div className="container">
        <h2 className="fsz-70 text-uppercase fw-400 text-center mb-120 js-splittext-lines">
          <span className="color-brown1"> news </span> & offers
        </h2>
        <div className="row gx-5">
          <div className="col-lg-6">
            <div
              className="main-post pe-lg-5 wow fadeInUp slow"
              data-wow-delay="0.2s"
            >
              <a href="#" className="img">
                <img
                  src="/home5_residence/assets/images/blog1.jpg"
                  alt=""
                  className="img-cover"
                />
              </a>
              <div className="info">
                <div className="date">
                  <h3 className="numb"> 25 </h3>
                  <small>
                    december <br /> 2023
                  </small>
                </div>
                <div className="cont">
                  <a
                    href="#"
                    className="title fsz-24 text-uppercase hover-brown1 d-block"
                  >
                    ACTUAL CONSTRUCTION NEWS OF archin RESIDENCES
                  </a>
                  <small className="fsz14 text-uppercase mt-15 color-brown1 fw-300">
                    News
                  </small>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="sub-posts ps-lg-5 mt-5 mt-lg-0">
              <div
                className="post-card wow fadeInUp slow"
                data-wow-delay="0.4s"
              >
                <div className="date">
                  <h3 className="numb"> 12 </h3>
                  <small>
                    december <br /> 2023
                  </small>
                </div>
                <div className="cont">
                  <a
                    href="#"
                    className="title fsz-24 text-uppercase hover-brown1 d-block"
                  >
                    archin apartment: mortgage program from 0.01%
                  </a>
                  <small className="fsz14 text-uppercase mt-15 color-brown1 fw-300">
                    News, Offers
                  </small>
                </div>
              </div>
              <div
                className="post-card wow fadeInUp slow"
                data-wow-delay="0.6s"
              >
                <div className="date">
                  <h3 className="numb"> 7 </h3>
                  <small>
                    october <br /> 2023
                  </small>
                </div>
                <div className="cont">
                  <a
                    href="#"
                    className="title fsz-24 text-uppercase hover-brown1 d-block"
                  >
                    No fee car spot when buy aparment at Archin
                  </a>
                  <small className="fsz14 text-uppercase mt-15 color-brown1 fw-300">
                    News
                  </small>
                </div>
              </div>
              <div
                className="post-card wow fadeInUp slow"
                data-wow-delay="0.8s"
              >
                <div className="date">
                  <h3 className="numb"> 15 </h3>
                  <small>
                    august <br /> 2023
                  </small>
                </div>
                <div className="cont">
                  <a
                    href="#"
                    className="title fsz-24 text-uppercase hover-brown1 d-block"
                  >
                    COMFORT AND CARE AT HIGH
                  </a>
                  <small className="fsz14 text-uppercase mt-15 color-brown1 fw-300">
                    News
                  </small>
                </div>
              </div>
              <a
                href="#"
                className="more-link ms-lg-5 wow fadeInUp slow"
                data-wow-delay="0.2s"
              >
                all articles <i className="fat fa-arrow-up-right ms-2"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Blog;
