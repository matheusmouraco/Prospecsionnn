import React from 'react';
import data from '../../data/home7_landscape/projects';
function Project() {
  return (
    <section className="tc-projects-style7">
      <div className="container">
        <div className="title mb-80">
          <div className="row">
            <div className="col-lg-8">
              <h2 className="fsz-60 text-capitalize fw-400 js-splittext-lines">
                Featured Projects
              </h2>
            </div>
            <div className="col-lg-4 text-lg-end mt-5 mt-lg-0 js-splittext-lines">
              <a
                href="#"
                className="butn border rounded-pill border-green1 hover-bg-green1 text-capitalize color-green1"
              >
                <span> See All Projects </span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="projects-content">
        <div className="projects-slider">
          <div className="swiper-wrapper">
            {data.map((item, i) => (
              <div key={i} className="swiper-slide" data-tab={item.tab}>
                <a href="#" className="project-card">
                  <div className="info">
                    <h6 className="fsz-13 text-uppercase mb-3">
                      {item.location}
                    </h6>
                    <h3 className="fsz-28 text-capitalize fw-400">
                      {item.title}
                    </h3>
                  </div>
                </a>
              </div>
            ))}
          </div>
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </div>
        <div className="glry-img">
          {data.map((item, i) => (
            <img
              key={i}
              id={item.tab}
              src={item.img}
              alt=""
              className={`tab-img ${i == 0 && 'current'} `}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Project;
