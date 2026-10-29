import React from 'react';

function Portfolio() {
  return (
    <div className="swiper-slide">
      <section className="section tc-portfolio-style8">
        <div className="container">
          <div className="section-head mb-4 mb-lg-0">
            <h3 className="fsz-30 fw-600 text-uppercase">
              featured <br /> works
            </h3>
          </div>
          <div className="section-body">
            <div className="row">
              <div className="col-lg-11">
                <div className="projects">
                  <div className="tab-content" id="pills-tabContent">
                    <div className="tab-pane fade show active" id="pills-work1">
                      <div className="project-content">
                        <div className="text fsz-16">
                          This area is a short description for the project.
                          <br /> This text paragraph just a sample
                        </div>
                        <a
                          href="#"
                          className="butn border rounded-pill border-white hover-bg-orange1 text-capitalize text-white mt-20 fsz-13 pt-15 pb-15"
                        >
                          <span> View Project </span>
                        </a>
                        <h2 className="title"> Dallas Ecolodge </h2>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="pills-work2">
                      <div className="project-content">
                        <div className="text fsz-16">
                          This area is a short description for the project.
                          <br /> This text paragraph just a sample
                        </div>
                        <a
                          href="#"
                          className="butn border rounded-pill border-white hover-bg-orange1 text-capitalize text-white mt-20 fsz-13 pt-15 pb-15"
                        >
                          <span> View Project </span>
                        </a>
                        <h2 className="title"> Torres Villa </h2>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="pills-work3">
                      <div className="project-content">
                        <div className="text fsz-16">
                          This area is a short description for the project.
                          <br /> This text paragraph just a sample
                        </div>
                        <a
                          href="#"
                          className="butn border rounded-pill border-white hover-bg-orange1 text-capitalize text-white mt-20 fsz-13 pt-15 pb-15"
                        >
                          <span> View Project </span>
                        </a>
                        <h2 className="title"> Alex’s Estate </h2>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="pills-work4">
                      <div className="project-content">
                        <div className="text fsz-16">
                          This area is a short description for the project.
                          <br /> This text paragraph just a sample
                        </div>
                        <a
                          href="#"
                          className="butn border rounded-pill border-white hover-bg-orange1 text-capitalize text-white mt-20 fsz-13 pt-15 pb-15"
                        >
                          <span> View Project </span>
                        </a>
                        <h2 className="title"> Olso College </h2>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="pills-work5">
                      <div className="project-content">
                        <div className="text fsz-16">
                          This area is a short description for the project.
                          <br /> This text paragraph just a sample
                        </div>
                        <a
                          href="#"
                          className="butn border rounded-pill border-white hover-bg-orange1 text-capitalize text-white mt-20 fsz-13 pt-15 pb-15"
                        >
                          <span> View Project </span>
                        </a>
                        <h2 className="title"> C16 Apartment </h2>
                      </div>
                    </div>
                  </div>
                  <ul className="nav nav-pills" id="pills-tab" role="tablist">
                    <li
                      className="nav-item"
                      role="presentation"
                      data-tab="tab-1"
                    >
                      <button
                        className="nav-link active"
                        id="pills-work1-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-work1"
                        type="button"
                      >
                        Dallas Ecolodge
                      </button>
                    </li>
                    <li
                      className="nav-item"
                      role="presentation"
                      data-tab="tab-2"
                    >
                      <button
                        className="nav-link"
                        id="pills-work2-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-work2"
                      >
                        Torres Villa
                      </button>
                    </li>
                    <li
                      className="nav-item"
                      role="presentation"
                      data-tab="tab-3"
                    >
                      <button
                        className="nav-link"
                        id="pills-work3-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-work3"
                      >
                        Alex’s Estate
                      </button>
                    </li>
                    <li
                      className="nav-item"
                      role="presentation"
                      data-tab="tab-4"
                    >
                      <button
                        className="nav-link"
                        id="pills-work4-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-work4"
                      >
                        Olso College
                      </button>
                    </li>
                    <li
                      className="nav-item"
                      role="presentation"
                      data-tab="tab-5"
                    >
                      <button
                        className="nav-link"
                        id="pills-work5-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-work5"
                      >
                        C16 Apartment
                      </button>
                    </li>
                    <li className="">
                      <a
                        href="#"
                        className="text-capitalize text-decoration-underline"
                      >
                        All Projects
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="imgs">
          <img
            id="tab-1"
            src="/home8_portfolio/assets/img/portfolio/pr1.jpg"
            alt=""
            className="tab-img current"
          />
          <img
            id="tab-2"
            src="/home8_portfolio/assets/img/portfolio/pr2.jpg"
            alt=""
            className="tab-img"
          />
          <img
            id="tab-3"
            src="/home8_portfolio/assets/img/portfolio/pr3.jpg"
            alt=""
            className="tab-img"
          />
          <img
            id="tab-4"
            src="/home8_portfolio/assets/img/portfolio/pr4.jpg"
            alt=""
            className="tab-img"
          />
          <img
            id="tab-5"
            src="/home8_portfolio/assets/img/portfolio/pr5.jpg"
            alt=""
            className="tab-img"
          />
        </div>
      </section>
    </div>
  );
}

export default Portfolio;
