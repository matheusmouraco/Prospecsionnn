import React from 'react';

function Projects() {
  return (
    <section className="tc-projects-style2">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <h2 className="fsz-45 fw-500">
              Latest{' '}
              <span className="sub-font fst-italic color-orange1 fw-400">
                projects
              </span>
            </h2>
          </div>
          <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
            <a
              href="#"
              className="butn borderd border rounded-pill hover-bg-black"
            >
              <span>
                See All Projects
                <i className="ms-2 fal fa-long-arrow-right ico-45"></i>
              </span>
            </a>
          </div>
        </div>
        <div className="tabs-links mt-40">
          <ul className="nav nav-pills" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="pills-proj1-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-proj1"
                type="button"
              >
                Interior Design
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="pills-proj2-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-proj2"
                type="button"
              >
                Landscape
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="pills-proj3-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-proj1"
                type="button"
              >
                Rennovation
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="pills-proj4-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-proj2"
                type="button"
              >
                Furniture
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="tab-content" id="pills-tabContent">
        <div
          className="tab-pane fade show active"
          id="pills-proj1"
          role="tabpanel"
          aria-labelledby="pills-proj1-tab"
        >
          <div className="projects-slider-content mt-100">
            <div className="projects-slider">
              <div className="swiper-wrapper">
                <div className="swiper-slide">
                  <div className="project-card">
                    <a href="#" className="img">
                      <img
                        src="/innerpages/assets/img/projects/proj1.jpg"
                        alt=""
                        className="img-cover"
                      />
                      <div className="year">
                        <span className="txt"> 2023 </span>
                        <img
                          src="/innerpages/assets/img/project_shape.png"
                          alt=""
                          className="bg"
                        />
                      </div>
                      <div className="arrow">
                        <i className="fal fa-long-arrow-right ico-45"></i>
                      </div>
                    </a>
                    <div className="info">
                      <div className="tags">
                        <a href="#"> Interior Design </a>
                        <a href="#"> Furniture </a>
                      </div>
                      <h3 className="title">
                        <a href="#"> ABERY Apartment Master Bedroom </a>
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="project-card">
                    <a href="#" className="img">
                      <img
                        src="/innerpages/assets/img/projects/proj2.jpg"
                        alt=""
                        className="img-cover"
                      />
                      <div className="year">
                        <span className="txt"> 2022 </span>
                        <img
                          src="/innerpages/assets/img/project_shape.png"
                          alt=""
                          className="bg"
                        />
                      </div>
                      <div className="arrow">
                        <i className="fal fa-long-arrow-right ico-45"></i>
                      </div>
                    </a>
                    <div className="info">
                      <div className="tags">
                        <a href="#"> Furniture </a>
                      </div>
                      <h3 className="title">
                        <a href="#"> Neoclassical Sofa </a>
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="project-card">
                    <a href="#" className="img">
                      <img
                        src="/innerpages/assets/img/projects/proj3.jpg"
                        alt=""
                        className="img-cover"
                      />
                      <div className="year">
                        <span className="txt"> 2022 </span>
                        <img
                          src="/innerpages/assets/img/project_shape.png"
                          alt=""
                          className="bg"
                        />
                      </div>
                      <div className="arrow">
                        <i className="fal fa-long-arrow-right ico-45"></i>
                      </div>
                    </a>
                    <div className="info">
                      <div className="tags">
                        <a href="#"> Interior Design </a>
                        <a href="#"> Furniture </a>
                      </div>
                      <h3 className="title">
                        <a href="#"> Salone Skin & Spa </a>
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="project-card">
                    <a href="#" className="img">
                      <img
                        src="/innerpages/assets/img/projects/proj4.jpg"
                        alt=""
                        className="img-cover"
                      />
                      <div className="year">
                        <span className="txt"> 2022 </span>
                        <img
                          src="/innerpages/assets/img/project_shape.png"
                          alt=""
                          className="bg"
                        />
                      </div>
                      <div className="arrow">
                        <i className="fal fa-long-arrow-right ico-45"></i>
                      </div>
                    </a>
                    <div className="info">
                      <div className="tags">
                        <a href="#"> Interior Design </a>
                        <a href="#"> Furniture </a>
                      </div>
                      <h3 className="title">
                        <a href="#"> Boston D53 Deluxe Apartment </a>
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="controls">
                <div className="container">
                  <div className="swiper-pagination"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="tab-pane fade"
          id="pills-proj2"
          role="tabpanel"
          aria-labelledby="pills-proj2-tab"
        >
          <div className="projects-slider-content mt-100">
            <div className="projects-slider">
              <div className="swiper-wrapper">
                <div className="swiper-slide">
                  <div className="project-card">
                    <a href="#" className="img">
                      <img
                        src="/innerpages/assets/img/projects/proj3.jpg"
                        alt=""
                        className="img-cover"
                      />
                      <div className="year">
                        <span className="txt"> 2022 </span>
                        <img
                          src="/innerpages/assets/img/project_shape.png"
                          alt=""
                          className="bg"
                        />
                      </div>
                      <div className="arrow">
                        <i className="fal fa-long-arrow-right ico-45"></i>
                      </div>
                    </a>
                    <div className="info">
                      <div className="tags">
                        <a href="#"> Interior Design </a>
                        <a href="#"> Furniture </a>
                      </div>
                      <h3 className="title">
                        <a href="#"> Salone Skin & Spa </a>
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="project-card">
                    <a href="#" className="img">
                      <img
                        src="/innerpages/assets/img/projects/proj4.jpg"
                        alt=""
                        className="img-cover"
                      />
                      <div className="year">
                        <span className="txt"> 2022 </span>
                        <img
                          src="/innerpages/assets/img/project_shape.png"
                          alt=""
                          className="bg"
                        />
                      </div>
                      <div className="arrow">
                        <i className="fal fa-long-arrow-right ico-45"></i>
                      </div>
                    </a>
                    <div className="info">
                      <div className="tags">
                        <a href="#"> Interior Design </a>
                        <a href="#"> Furniture </a>
                      </div>
                      <h3 className="title">
                        <a href="#"> Boston D53 Deluxe Apartment </a>
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="project-card">
                    <a href="#" className="img">
                      <img
                        src="/innerpages/assets/img/projects/proj1.jpg"
                        alt=""
                        className="img-cover"
                      />
                      <div className="year">
                        <span className="txt"> 2023 </span>
                        <img
                          src="/innerpages/assets/img/project_shape.png"
                          alt=""
                          className="bg"
                        />
                      </div>
                      <div className="arrow">
                        <i className="fal fa-long-arrow-right ico-45"></i>
                      </div>
                    </a>
                    <div className="info">
                      <div className="tags">
                        <a href="#"> Interior Design </a>
                        <a href="#"> Furniture </a>
                      </div>
                      <h3 className="title">
                        <a href="#"> ABERY Apartment Master Bedroom </a>
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="project-card">
                    <a href="#" className="img">
                      <img
                        src="/innerpages/assets/img/projects/proj2.jpg"
                        alt=""
                        className="img-cover"
                      />
                      <div className="year">
                        <span className="txt"> 2022 </span>
                        <img
                          src="/innerpages/assets/img/project_shape.png"
                          alt=""
                          className="bg"
                        />
                      </div>
                      <div className="arrow">
                        <i className="fal fa-long-arrow-right ico-45"></i>
                      </div>
                    </a>
                    <div className="info">
                      <div className="tags">
                        <a href="#"> Furniture </a>
                      </div>
                      <h3 className="title">
                        <a href="#"> Neoclassical Sofa </a>
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="controls">
                <div className="container">
                  <div className="swiper-pagination"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Projects;
