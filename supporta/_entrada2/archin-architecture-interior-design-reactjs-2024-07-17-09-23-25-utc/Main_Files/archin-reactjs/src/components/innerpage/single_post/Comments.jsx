import React from 'react';

function Comments() {
  return (
    <section className="tc-comments-style1">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="comments-content">
              <div className="content">
                <h3
                  className="fsz-45 text-capitalize mb-30  wow fadeInUp slow"
                  data-wow-delay="0.2s"
                >
                  3 Comments
                </h3>
                <div className="comments-cards">
                  <div
                    className="comment-replay-cont border-bottom border-1 brd-gray2 pb-40 pt-40 wow fadeInUp slow"
                    data-wow-delay="0.2s"
                  >
                    <div className="d-flex comment-cont">
                      <div className="icon-60 rounded-circle overflow-hidden me-3 flex-shrink-0">
                        <img
                          src="/innerpages/assets/img/team/team1.jpg"
                          alt=""
                          className="img-cover"
                        />
                      </div>
                      <div className="inf w-100">
                        <div className="title d-flex justify-content-between">
                          <h6 className="fw-bold fsz-14">David Bowie</h6>
                          <span className="time fsz-12 text-uppercase color-999">
                            3 hours ago
                          </span>
                        </div>
                        <div className="text color-666 fsz-14 mt-10">
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua. Atume nusaate staman utra phone
                          limo sumeria
                        </div>
                        <a
                          href="#"
                          className="butn rounded-pill hover-bg-orange1 bg-white mt-20 pt-0 pb-1 px-3"
                        >
                          <span className="fsz-11 text-uppercase"> reply </span>
                        </a>
                      </div>
                    </div>
                    <div className="d-flex comment-replay mt-30 ms-90 border-top pt-40 brd-gray2">
                      <div className="icon-40 rounded-circle overflow-hidden me-3 flex-shrink-0">
                        <img
                          src="/innerpages/assets/img/team/team2.jpg"
                          alt=""
                          className="img-cover"
                        />
                      </div>
                      <div className="inf w-100">
                        <div className="title d-flex justify-content-between">
                          <h6 className="fw-bold fsz-14">Logan Cee</h6>
                          <span className="time fsz-12 text-uppercase color-999">
                            2 dayes ago
                          </span>
                        </div>
                        <div className="text color-666 fsz-14 mt-10">
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua. Atume nusaate staman utra phone
                          limo sumeria
                        </div>
                        <a
                          href="#"
                          className="butn rounded-pill hover-bg-orange1 bg-white mt-20 pt-0 pb-1 px-3"
                        >
                          <span className="fsz-11 text-uppercase"> reply </span>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div
                    className="comment-replay-cont pb-40 pt-40 border-bottom border-1 brd-gray2 wow fadeInUp slow"
                    data-wow-delay="0.2s"
                  >
                    <div className="d-flex comment-cont">
                      <div className="icon-60 rounded-circle overflow-hidden me-3 flex-shrink-0">
                        <img
                          src="/innerpages/assets/img/team/team3.jpg"
                          alt=""
                          className="img-cover"
                        />
                      </div>
                      <div className="inf w-100">
                        <div className="title d-flex justify-content-between">
                          <h6 className="fw-bold fsz-14">Luis Diaz</h6>
                          <span className="time fsz-12 text-uppercase color-999">
                            December 25, 2023
                          </span>
                        </div>
                        <div className="text color-000 fsz-14 mt-10">
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit, sed do eiusmod tempor incididunt
                        </div>
                        <a
                          href="#"
                          className="butn rounded-pill hover-bg-orange1 bg-white mt-20 pt-0 pb-1 px-3"
                        >
                          <span className="fsz-11 text-uppercase"> reply </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <form
                  className="comment-form d-block pt-100 wow fadeInUp slow"
                  data-wow-delay="0.2s"
                >
                  <h3 className="mb-60 fw-bold text-capitalize fsz-45">
                    Leave A Comment
                  </h3>
                  <p className="color-666 mb-90">
                    Your email address will not published. Required fields are
                    marked <span className="text-danger"> * </span>
                  </p>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="form-group mb-40">
                        <label htmlFor="" className="fsz-13 text-uppercase">
                          message
                        </label>
                        <textarea
                          className="form-control"
                          name="message"
                          rows="6"
                          placeholder="Write your message here"
                        ></textarea>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group mb-40">
                        <label htmlFor="" className="fsz-13 text-uppercase">
                          Your Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          placeholder="you name here"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group mb-40">
                        <label htmlFor="" className="fsz-13 text-uppercase">
                          Your Email <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="email"
                          placeholder="your email adress"
                        />
                      </div>
                    </div>
                    <div className="col-12 mt-50">
                      <a
                        href="#"
                        className="butn rounded-pill hover-bg-orange1 bg-white mt-20 fsz-16 text-capitalize"
                      >
                        <span className="">
                          Post Comment
                          <i className="fal fa-arrow-up-right ms-2"></i>
                        </span>
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Comments;
