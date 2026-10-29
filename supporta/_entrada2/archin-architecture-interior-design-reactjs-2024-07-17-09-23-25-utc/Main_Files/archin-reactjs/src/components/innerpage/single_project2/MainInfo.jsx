import React from 'react';

function MainInfo() {
  return (
    <section className="tc-main-info-style2">
      <div className="container">
        <div className="row gx-0">
          <div className="col-lg-4">
            <h4 className="fsz-45 fw-bold js-splittext-lines">
              Architecture is a visual art and the building speak for themselves
            </h4>
            <a
              href="#"
              className="butn hover-bg-orange1 text-capitalize bg-white rounded-pill mt-90"
            >
              <span>
                View on Behance <i className="fal fa-arrow-up-right ms-2"></i>
              </span>
            </a>
          </div>
          <div className="col-lg-6 offset-lg-2 mt-5 mt-lg-0">
            <h6
              className="fsz-24 fw-500 mt-4 mt-lg-0 wow fadeInUp slow"
              data-wow-delay="0.2s"
            >
              Nestled at the heart of Forest hill in Boston, there stood a villa
              that embodied a profound connection between the natural world and
              the comforts of modern living.
            </h6>
            <h6
              className="fsz-24 fw-500 mt-40 wow fadeInUp slow"
              data-wow-delay="0.4s"
            >
              More than just a home, it was an immersive experience, a testament
              to the spirit of its surroundings.
            </h6>
            <ul className="lh-6 mt-70 wow fadeInUp slow" data-wow-delay="0.6s">
              <li className="fsz-18">
                <span className="color-666"> Location: </span> 2221 Sw Broadway
                Dr, Portland, OR 97201
              </li>
              <li className="fsz-18">
                <span className="color-666"> Services: </span> Interior Design,
                Furniture
              </li>
              <li className="fsz-18">
                <span className="color-666"> Collaboratos: </span> Logan
                Architect, Moussa Engineer
              </li>
              <li className="fsz-18">
                <span className="color-666"> Status: </span> Completed in
                August, 2023
              </li>
            </ul>
          </div>
        </div>
        <div className="imgs">
          <div className="row">
            <div className="col-lg-4">
              <div className="sm-img wow zoomIn slow" data-wow-delay="0.2s">
                <img
                  src="/innerpages/assets/img/s_project2/about1.jpg"
                  alt=""
                  className="img-cover"
                  data-speed="1.5"
                />
              </div>
            </div>
            <div className="col-lg-6 offset-lg-2">
              <div className="lg-img wow zoomIn slow" data-wow-delay="0.4s">
                <img
                  src="/innerpages/assets/img/s_project2/about2.jpg"
                  alt=""
                  className="img-cover"
                  data-speed="1.5"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MainInfo;
