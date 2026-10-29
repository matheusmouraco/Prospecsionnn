import React from 'react';

function Portfolio() {
  return (
    <section className="tc-portfolio-style4">
      <div className="container">
        <div className="content">
          <div className="title js-splittext-lines">
            <h2 className="sec-title mb-30"> latest works </h2>
            <p className="fsz-18 color-666">
              Creativity is at the heart in <br /> all my projects
            </p>
          </div>
          <div className="projects">
            <a href="#" className="work-card">
              <div className="img wow">
                <img
                  src="/home4_personal_architect/assets/img/works/wr1.jpg"
                  alt=""
                  className="img-cover"
                />
              </div>
              <h5> skin & spa </h5>
            </a>
            <a href="#" className="work-card">
              <div className="img wow">
                <img
                  src="/home4_personal_architect/assets/img/works/wr2.jpg"
                  alt=""
                  className="img-cover"
                />
              </div>
              <h5> Private villa </h5>
            </a>
            <a href="#" className="work-card">
              <div className="img wow">
                <img
                  src="/home4_personal_architect/assets/img/works/wr3.jpg"
                  alt=""
                  className="img-cover"
                />
              </div>
              <h5> coutryside villa </h5>
            </a>
            <a href="#" className="work-card">
              <div className="img wow">
                <img
                  src="/home4_personal_architect/assets/img/works/wr4.jpg"
                  alt=""
                  className="img-cover"
                />
              </div>
              <h5> seaside house </h5>
            </a>
            <a href="#" className="work-card">
              <div className="img wow">
                <img
                  src="/home4_personal_architect/assets/img/works/wr5.jpg"
                  alt=""
                  className="img-cover"
                />
              </div>
              <h5> city penthouse </h5>
            </a>
            <a href="#" className="work-card">
              <div className="img wow">
                <img
                  src="/home4_personal_architect/assets/img/works/wr6.jpg"
                  alt=""
                  className="img-cover"
                />
              </div>
              <h5> classical pub </h5>
            </a>
          </div>
          <h4 className="pr-link">
            <a href="#" className="js-splittext-lines">
              view all <br /> works
            </a>
            <span className="icon js-splittext-lines">
              <i className="ti-arrow-top-right"></i>
            </span>
          </h4>
        </div>
      </div>
    </section>
  );
}

export default Portfolio;
