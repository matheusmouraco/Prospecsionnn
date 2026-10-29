import React from 'react';

function Testimonials() {
  return (
    <section className="tc-testimonial-style5">
      <div className="container">
        <div className="content">
          <h2 className="fsz-70 text-uppercase fw-400 mb-120 js-splittext-lines">
            <span className="color-brown1"> from </span> project architect
          </h2>
          <div className="row">
            <div className="col-lg-4">
              <div
                className="img th-600 wow fadeInUp slow"
                data-wow-delay="0.2s"
              >
                <img
                  src="/home5_residence/assets/images/testi.png"
                  alt=""
                  className="img-cover"
                />
              </div>
            </div>
            <div className="col-lg-5 offset-lg-1">
              <div
                className="info mt-5 mt-lg-0 wow fadeInUp slow"
                data-wow-delay="0.4s"
              >
                <h6 className="fsz-24 fw-400 text-uppercase color-brown1 lh-5">
                  &ldquo;we tried to preserve the heritage that essentially
                  defines our lives and we took into account the location of the
                  project. It&lsquo;s a big responsibility to build next to
                  these iconic objects, the new house should convey all the
                  grandeur and power of this place.&quot;
                </h6>
                <div className="user-inf mt-100">
                  <p className="fsz-18 fw-500 mb-2"> Logan Dang </p>
                  <small className="fsz-12 text-uppercase color-999">
                    project architect at TORF architects
                  </small>
                </div>
              </div>
            </div>
          </div>
          <img
            src="/home5_residence/assets/images/quote.svg"
            alt=""
            className="quote"
            data-speed="1"
            data-lag="0.8"
          />
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
