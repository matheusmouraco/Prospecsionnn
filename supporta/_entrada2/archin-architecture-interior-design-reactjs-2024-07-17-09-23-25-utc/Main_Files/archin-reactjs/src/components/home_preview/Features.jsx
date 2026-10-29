import React from 'react';

function Features() {
  return (
    <section className="tc-more-features">
      <div className="container">
        <div className="title text-center js-splittext-lines">
          <h2 className="fsz-45 fw-600 mb-30"> More Features </h2>
          <div className="text fsz-16 mb-60 color-666">
            Our goal is making your working process faster and easier. That’s
            why we’ve added tons of flexible options.
          </div>
        </div>
        <div className="cards">
          <div className="row justify-content-center">
            <div className="col-lg-3">
              <div
                className="feat-card wow fadeInUp slow"
                data-wow-delay="0.2s"
              >
                <div className="icon">
                  <i className="fal fa-images"></i>
                </div>
                <div className="info">
                  <h5 className="fsz-24 mb-15"> Image Gallery </h5>
                  <p className="fsz-13 color-666">
                    Allows for the display of multiple images <br /> within an
                    article or on a separate page.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div
                className="feat-card wow fadeInUp slow"
                data-wow-delay="0.4s"
              >
                <div className="icon">
                  <i className="fal fa-code"></i>
                </div>
                <div className="info">
                  <h5 className="fsz-24 mb-15"> CSS Animation </h5>
                  <p className="fsz-13 color-666">
                    Allow using of CSS animations to add <br /> visual effects
                    to the site,
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div
                className="feat-card wow fadeInUp slow"
                data-wow-delay="0.6s"
              >
                <div className="icon">
                  <i className="fal fa-chart-mixed"></i>
                </div>
                <div className="info">
                  <h5 className="fsz-24 mb-15"> SEO Otptimized </h5>
                  <p className="fsz-13 color-666">
                    Archin uses the latest technologies to <br /> growing
                    visibility in search engine results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
