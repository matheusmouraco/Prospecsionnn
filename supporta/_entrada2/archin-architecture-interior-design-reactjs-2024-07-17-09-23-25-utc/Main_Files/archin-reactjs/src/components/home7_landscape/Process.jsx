import React from 'react';

function Process() {
  return (
    <section className="tc-proccess-style7">
      <div className="container">
        <h2 className="fsz-60 text-center text-capitalize fw-400 mb-100 js-splittext-lines">
          Our Process
        </h2>
        <div className="content">
          <div className="row gx-0">
            <div className="col-lg-5">
              <div
                className="accordion wow fadeInUp slow"
                data-wow-delay="0.2s"
                id="accordionExample"
              >
                <div className="accordion-item" data-tab="tab-10">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse1"
                    >
                      <span className="num"> 1. </span> Consultation
                    </button>
                  </h2>
                  <div
                    id="collapse1"
                    className="accordion-collapse collapse show"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <div className="text">
                        The process begins with an initial consultation <br />
                        between the landscaper and the client.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item" data-tab="tab-11">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse2"
                    >
                      <span className="num"> 2. </span> Site Analysis
                    </button>
                  </h2>
                  <div
                    id="collapse2"
                    className="accordion-collapse collapse"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <div className="text">
                        The process begins with an initial consultation <br />
                        between the landscaper and the client.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item" data-tab="tab-12">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse3"
                    >
                      <span className="num"> 3. </span> Design & Installation
                    </button>
                  </h2>
                  <div
                    id="collapse3"
                    className="accordion-collapse collapse"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <div className="text">
                        The process begins with an initial consultation <br />
                        between the landscaper and the client.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item" data-tab="tab-13">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse4"
                    >
                      <span className="num"> 4. </span> Handover
                    </button>
                  </h2>
                  <div
                    id="collapse4"
                    className="accordion-collapse collapse"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <div className="text">
                        The process begins with an initial consultation <br />
                        between the landscaper and the client.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <a
                href="#"
                className="butn border rounded-pill border-green1 hover-bg-green1 text-capitalize color-green1 mt-80"
              >
                <span> Request A Consultation </span>
              </a>
            </div>
            <div className="col-lg-4 offset-lg-2 mt-5 mt-lg-0">
              <div className="img wow zoomIn slow" data-wow-delay="0.4s">
                <img
                  id="tab-10"
                  src="/home7_landscape/assets/img/proccess/prc1.jpg"
                  alt=""
                  className="prc-img current"
                />
                <img
                  id="tab-11"
                  src="/home7_landscape/assets/img/proccess/prc2.jpg"
                  alt=""
                  className="prc-img"
                />
                <img
                  id="tab-12"
                  src="/home7_landscape/assets/img/proccess/prc3.jpg"
                  alt=""
                  className="prc-img"
                />
                <img
                  id="tab-13"
                  src="/home7_landscape/assets/img/proccess/prc4.jpg"
                  alt=""
                  className="prc-img"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <img
        src="/home7_landscape/assets/img/curve2.png"
        alt=""
        className="curve"
      />
    </section>
  );
}

export default Process;
