import React from 'react';

function RelatedProjects() {
  return (
    <section className="tc-related-projects-style1">
      <div className="container">
        <div
          className="row align-items-center wow fadeInUp slow"
          data-wow-delay="0.2s"
        >
          <div className="col-lg-9">
            <h3 className="fsz-45 text-capitalize"> featured cases </h3>
          </div>
          <div className="col-lg-3 text-lg-end mt-4 mt-lg-0">
            <a
              href="#"
              className="butn border rounded-pill color-orange1 border-orange1 hover-bg-orange1"
            >
              <span>
                See All Projects <i className="fal fa-arrow-up-right ms-2"></i>
              </span>
            </a>
          </div>
        </div>
      </div>
      <div className="content mt-50">
        <div
          className="tab-content wow fadeInUp slow float_box_container"
          data-wow-delay="0.4s"
          id="pills-tabContent"
        >
          <div className="tab-pane fade show active" id="pills-tab1">
            <div className="cases-slider">
              <div className="swiper-wrapper">
                <div className="swiper-slide">
                  <div className="case-card">
                    <a
                      href="/innerpages/assets/img/portfolio/case1.jpg"
                      className="img"
                      data-fancybox="cases"
                    >
                      <img
                        src="/innerpages/assets/img/portfolio/case1.jpg"
                        alt=""
                        className="img-cover"
                      />
                    </a>
                    <div className="info">
                      <div className="tags mb-30">
                        <a href="#"> Architecture </a>
                        <a href="#"> Furniture </a>
                      </div>
                      <h3 className="title fsz-35 mb-20">
                        <a href="#" className="hover-orange1">
                          Townhouse in San Joe
                        </a>
                      </h3>
                      <div className="text color-666">
                        This area will is short description of project, you can
                        select to show or hide it, <br /> this a sample short
                        paragraph for this.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="case-card">
                    <a
                      href="/innerpages/assets/img/portfolio/case2.jpg"
                      className="img"
                      data-fancybox="cases"
                    >
                      <img
                        src="/innerpages/assets/img/portfolio/case2.jpg"
                        alt=""
                        className="img-cover"
                      />
                    </a>
                    <div className="info">
                      <div className="tags mb-30">
                        <a href="#"> Interior </a>
                        <a href="#"> Furniture </a>
                      </div>
                      <h3 className="title fsz-35 mb-20">
                        <a href="#" className="hover-orange1">
                          Homestay Rennovation and <br /> Interior Design
                        </a>
                      </h3>
                      <div className="text color-666">
                        This area will is short description of project, you can
                        select to show or hide it, <br /> this a sample short
                        paragraph for this.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="case-card">
                    <a
                      href="/innerpages/assets/img/portfolio/case3.jpg"
                      className="img"
                      data-fancybox="cases"
                    >
                      <img
                        src="/innerpages/assets/img/portfolio/case3.jpg"
                        alt=""
                        className="img-cover"
                      />
                    </a>
                    <div className="info">
                      <div className="tags mb-30">
                        <a href="#"> Architecture </a>
                        <a href="#"> Furniture </a>
                      </div>
                      <h3 className="title fsz-35 mb-20">
                        <a href="#" className="hover-orange1">
                          B63 Private Villa
                        </a>
                      </h3>
                      <div className="text color-666">
                        This area will is short description of project, you can
                        select to show or hide it, <br /> this a sample short
                        paragraph for this.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="float-cursor float_box">
            Hold <br /> and Drag
          </div>
        </div>
      </div>
    </section>
  );
}

export default RelatedProjects;
