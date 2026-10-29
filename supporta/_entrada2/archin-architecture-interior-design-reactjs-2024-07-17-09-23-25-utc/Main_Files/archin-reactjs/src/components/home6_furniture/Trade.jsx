import React from 'react';

function Trade() {
  return (
    <section className="tc-trade-style6">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="info">
              <div
                className="rotate-box wow zoomIn slow"
                data-wow-delay="0.2s"
                data-speed="1"
                data-lag="0.4"
              >
                <a
                  href="#"
                  className="rotate-circle fsz-35 rotate-text d-inline-block text-uppercase"
                >
                  <svg className="textcircle" viewBox="0 0 500 500">
                    <defs>
                      <path
                        id="textcircle"
                        d="M250,400 a150,150 0 0,1 0,-300a150,150 0 0,1 0,300Z"
                      ></path>
                    </defs>
                    <text>
                      <textPath xlinkHref="#textcircle" textLength="900">
                        archin design service - trade program -
                      </textPath>
                    </text>
                  </svg>
                </a>
                <img
                  src="/home6_furniture/assets/images/shakehand.png"
                  alt=""
                  className="icon"
                />
              </div>
              <h2 className="js-splittext-lines">
                get advantage benefits <br /> when become member in our <br />
                trade program
              </h2>
              <p className="js-splittext-lines">
                Our trade accounts are exclusive for industry specifiers such as
                interior designers, <br /> architects and builders. By being a
                trade member, you can receive instant project quotes <br /> and
                order online using your exclusive discounted pricing.
              </p>
              <div
                className="btns mt-90 wow fadeInUp slow"
                data-wow-delay="0.2s"
              >
                <a
                  href="#"
                  className="butn border radius-4 border-brown2 hover-bg-brown2 text-capitalize color-brown2 me-3"
                >
                  <span> Our Design Service </span>
                </a>
                <a
                  href="#"
                  className="butn border radius-4 border-brown2 bg-brown2 text-capitalize text-white hover-bg-black"
                >
                  <span> Our Trade Program </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="float-imgs parallaxed wow zoomIn slow"
        data-wow-delay="0.2s"
      >
        <img
          src="/home6_furniture/assets/images/about/ab1.png"
          alt=""
          className="parallaxed"
        />
        <img
          src="/home6_furniture/assets/images/about/ab2.png"
          alt=""
          className=""
        />
        <img
          src="/home6_furniture/assets/images/about/ab3.png"
          alt=""
          className=""
        />
        <img
          src="/home6_furniture/assets/images/about/ab4.png"
          alt=""
          className=""
        />
        <img
          src="/home6_furniture/assets/images/about/ab5.png"
          alt=""
          className="parallaxed"
        />
      </div>
    </section>
  );
}

export default Trade;
