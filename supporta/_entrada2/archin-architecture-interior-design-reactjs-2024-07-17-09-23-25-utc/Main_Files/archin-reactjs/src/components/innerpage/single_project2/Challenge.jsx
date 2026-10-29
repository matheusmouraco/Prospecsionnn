import React from 'react';

function Challenge() {
  return (
    <section className="tc-challenge-style2">
      <div className="container">
        <h3 className="fsz-45 text-capitalize mb-60 js-splittext-lines">
          Challenge & Concept
        </h3>
        <div
          className="text fsz-24 mb-100 wow fadeInUp slow"
          data-wow-delay="0.2s"
        >
          Create an unconventional yet user-friendly website – innovative, with
          a clean and simple design that communicates brand values and showcases
          multi-media content. Site that spreads the message: &quot;Islamic
          stories your child will love&quot;
        </div>
      </div>
      <div className="content float_box_container">
        <div className="challenge-slider">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <div className="case-card">
                <a
                  href="/innerpages/assets/img/s_project2/ch1.jpg"
                  className="img"
                  data-fancybox="cases"
                >
                  <img
                    src="/innerpages/assets/img/s_project2/ch1.jpg"
                    alt=""
                    className="img-cover"
                  />
                </a>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="case-card">
                <a
                  href="/innerpages/assets/img/s_project2/ch2.jpg"
                  className="img"
                  data-fancybox="cases"
                >
                  <img
                    src="/innerpages/assets/img/s_project2/ch2.jpg"
                    alt=""
                    className="img-cover"
                  />
                </a>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="case-card">
                <a
                  href="/innerpages/assets/img/s_project2/ch3.jpg"
                  className="img"
                  data-fancybox="cases"
                >
                  <img
                    src="/innerpages/assets/img/s_project2/ch3.jpg"
                    alt=""
                    className="img-cover"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="float-cursor float_box">
          Hold <br /> and Drag
        </div>
      </div>
    </section>
  );
}

export default Challenge;
