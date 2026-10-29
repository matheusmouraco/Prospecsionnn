import React from 'react';

function Team() {
  return (
    <section className="tc-team-style10 section-padding-x section-padding">
      <div className="container-fluid">
        <div className="section-head-style10 mb-100 js-splittext-lines">
          <div className="sub-title mb-30"> team member </div>
          <h2> Meet our top-notch experts </h2>
        </div>
        <div className="members">
          <div className="row">
            <div className="col-lg-2">
              <div className="member-colmn">
                <a href="#" className="team-card wow zoomIn">
                  <div className="img">
                    <img
                      src="/home10/assets/img/team/team1.jpg"
                      alt=""
                      className="img-cover"
                    />
                  </div>
                  <h5 className="title">
                    jhon <br /> handerson
                  </h5>
                </a>
                <a
                  href="#"
                  className="team-card wow zoomIn"
                  data-wow-delay="0.1s"
                >
                  <div className="img">
                    <img
                      src="/home10/assets/img/team/team2.jpg"
                      alt=""
                      className="img-cover"
                    />
                  </div>
                  <h5 className="title">
                    jhon <br /> handerson
                  </h5>
                </a>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="member-colmn">
                <a
                  href="#"
                  className="team-card wow zoomIn"
                  data-wow-delay="0.2s"
                >
                  <div className="img">
                    <img
                      src="/home10/assets/img/team/team3.jpg"
                      alt=""
                      className="img-cover"
                    />
                  </div>
                  <h5 className="title">
                    jhon <br /> handerson
                  </h5>
                </a>
              </div>
            </div>
            <div className="col-lg-2">
              <div className="member-colmn">
                <a
                  href="#"
                  className="team-card wow zoomIn"
                  data-wow-delay="0.3s"
                >
                  <div className="img">
                    <img
                      src="/home10/assets/img/team/team4.jpg"
                      alt=""
                      className="img-cover"
                    />
                  </div>
                  <h5 className="title">
                    jhon <br /> handerson
                  </h5>
                </a>
                <a
                  href="#"
                  className="team-card wow zoomIn"
                  data-wow-delay="0.4s"
                >
                  <div className="img">
                    <img
                      src="/home10/assets/img/team/team5.jpg"
                      alt=""
                      className="img-cover"
                    />
                  </div>
                  <h5 className="title">
                    jhon <br /> handerson
                  </h5>
                </a>
              </div>
            </div>
            <div className="col-lg-2 order-last order-lg-0">
              <div className="member-colmn">
                <a
                  href="#"
                  className="team-card wow zoomIn"
                  data-wow-delay="0.5s"
                >
                  <div className="img">
                    <img
                      src="/home10/assets/img/team/team6.jpg"
                      alt=""
                      className="img-cover"
                    />
                  </div>
                  <h5 className="title">
                    jhon <br /> handerson
                  </h5>
                </a>
                <a
                  href="#"
                  className="team-card team-text wow zoomIn"
                  data-wow-delay="0.6s"
                >
                  <div className="img">
                    <h5 className="title">
                      <div className="con">
                        <span>
                          See All Our <br /> Member
                        </span>
                        <span className="arrow">
                          <i className="ti-arrow-top-right"></i>
                        </span>
                      </div>
                    </h5>
                  </div>
                </a>
              </div>
            </div>
            <div className="col-lg-2">
              <div className="member-colmn">
                <a
                  href="#"
                  className="team-card wow zoomIn"
                  data-wow-delay="0.7s"
                >
                  <div className="img">
                    <img
                      src="/home10/assets/img/team/team7.jpg"
                      alt=""
                      className="img-cover"
                    />
                  </div>
                  <h5 className="title">
                    jhon <br /> handerson
                  </h5>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="numbers">
          <div className="row gx-5">
            <div className="col-lg-4">
              <div className="number-card wow fadeInUp" data-wow-delay="0.2s">
                <h3 className="perc"> 95% </h3>
                <p>
                  Happy Customer and <br /> Repeating
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="number-card wow fadeInUp" data-wow-delay="0.4s">
                <h3 className="perc"> 180% </h3>
                <p>
                  Projects Completed in <br /> 15 Years
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="number-card wow fadeInUp" data-wow-delay="0.6s">
                <h3 className="perc"> 35 </h3>
                <p>
                  Architects and <br /> High Qualified Crafters
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Team;
