import React from 'react';
import data1 from '../../data/home1/projects/projects1';
function Projects() {
  return (
    <section className="tc-projects-style1">
      <div className="container">
        <div className="title mb-70">
          <h2 className="fsz-45"> Featured Projects </h2>
        </div>
        <div className="tabs-links mb-50">
          <div className="row align-items-center">
            <div className="col-lg-9">
              <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="pills-proj1-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-proj1"
                    type="button"
                  >
                    Featured
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
                    Architecture
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
                    Interior
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
                    Landscape
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="pills-proj5-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-proj1"
                    type="button"
                  >
                    Furniture
                  </button>
                </li>
              </ul>
            </div>
            <div className="col-lg-3 mt-4 mt-lg-0 text-lg-end">
              <a
                href="#"
                className="butn border rounded-pill color-orange1 border-orange1 hover-bg-orange1"
              >
                <span>
                  See All Projects
                  <i className="small ms-1 ti-arrow-top-right"></i>
                </span>
              </a>
            </div>
          </div>
        </div>
        <div className="projects">
          <div className="tab-content" id="pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="pills-proj1"
              role="tabpanel"
              aria-labelledby="pills-proj1-tab"
            >
              <div className="projects-content float_box_container">
                <div className="projects-slider">
                  <div className="swiper-wrapper">
                    {data1.map((item, i) => (
                      <div key={i} className="swiper-slide">
                        <div className="project-card">
                          <a
                            href={item.img}
                            className="img"
                            data-fancybox="proj"
                          >
                            <img src={item.img} alt="" className="img-cover" />
                          </a>
                          <div className="info">
                            <div className="tags">
                              <a href="#"> {item.sub1} </a>
                              <a href="#"> {item.sub2} </a>
                            </div>
                            <h3 className="title">
                              <a href="#"> {item.title} </a>
                            </h3>
                            <div className="text">{item.desc}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="float-cursor float_box">
                  Hold <br /> and Drag
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-proj2"
              role="tabpanel"
              aria-labelledby="pills-proj2-tab"
            >
              <div className="projects-content float_box_container">
                <div className="projects-slider">
                  <div className="swiper-wrapper">
                    {data1.map((item, i) => (
                      <div key={i} className="swiper-slide">
                        <div className="project-card">
                          <a
                            href={item.img}
                            className="img"
                            data-fancybox="proj"
                          >
                            <img src={item.img} alt="" className="img-cover" />
                          </a>
                          <div className="info">
                            <div className="tags">
                              <a href="#"> {item.sub1} </a>
                              <a href="#"> {item.sub2} </a>
                            </div>
                            <h3 className="title">
                              <a href="#"> {item.title} </a>
                            </h3>
                            <div className="text">{item.desc}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="float-cursor float_box">
                  Hold <br /> and Drag
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
