import React from 'react';

function Subscribe() {
  return (
    <section className="tc-subscribe-style6">
      <div className="container">
        <div className="content">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="form">
                <div className="section-title">
                  <h2 className="js-splittext-lines">
                    get <span className="color-orange1"> 10% </span> discount
                  </h2>
                  <p className="fsz-18 mt-30 color-666">
                    Subscribe our newsletter and get 10% Off for your first
                    order
                  </p>
                </div>
                <div
                  className="form-group wow fadeInUp slow"
                  data-wow-delay="0.2s"
                >
                  <span className="icon fsz-20 me-2">
                    <i className="fal fa-envelope"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your emaill address"
                  />
                  <button> subscribe </button>
                </div>
                <p className="color-666 text-capitalize mt-30">
                  By scubcribing, you’re accepted the
                  <a href="#" className="color-000 text-decoration-underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Subscribe;
