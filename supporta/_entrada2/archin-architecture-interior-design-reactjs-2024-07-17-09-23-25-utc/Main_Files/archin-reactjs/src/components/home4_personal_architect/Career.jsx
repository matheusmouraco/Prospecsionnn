import React from 'react';
import data from '../../data/hom4_personal_architect/career';
function Career() {
  return (
    <section className="tc-career-style4">
      <div className="container">
        <div className="title">
          <h2 className="sec-title mb-20 js-splittext-lines"> edu & career </h2>
        </div>
        <div className="row">
          {data.map((item, i) => (
            <div key={i} className="col-lg-4">
              <div
                className="career-card mt-100 wow fadeInUp slow"
                data-wow-delay="0.3s"
              >
                <small className="year fsz-14 text-uppercase color-666 d-block mb-50">
                  {item.history}
                </small>
                {item.works.map((work, i) => (
                  <div key={i} className="year-item mt-30">
                    <h6 className="fsz-24 sub-font mb-10">{work.p1}</h6>
                    <p className="fsz-14 color-666"> {work.p2} </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Career;
