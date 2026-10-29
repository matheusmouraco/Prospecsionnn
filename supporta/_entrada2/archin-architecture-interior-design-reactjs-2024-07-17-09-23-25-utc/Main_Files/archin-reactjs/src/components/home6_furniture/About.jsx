import React from 'react';

function About() {
  return (
    <section className="tc-about-style6">
      <div className="features-items">
        <div className="row">
          <div className="col-lg-3">
            <div className="feat-item wow fadeInUp slow" data-wow-delay="0.2s">
              <p> free shipping all orders over $ </p>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="feat-item wow fadeInUp slow" data-wow-delay="0.4s">
              <p> buy now, pay later with klarna </p>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="feat-item wow fadeInUp slow" data-wow-delay="0.6s">
              <p> 30 days return guarantee </p>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="feat-item wow fadeInUp slow" data-wow-delay="0.8s">
              <p> 100% secure online payment </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="info">
          <h2 className="js-splittext-lines">
            we creating perfect <br /> lines and imposing presence <br /> that
            define spaces
          </h2>
          <p className="js-splittext-lines">
            Choose furniture you can have for life! At Archin, we are proud
            <br /> to work with premium quality local materials to create unique
            wood furniture <br /> that will be with you for every milestone
          </p>
          <a
            href="#"
            className="butn border radius-4 border-brown2 hover-bg-brown2 text-capitalize color-brown2 mt-100"
          >
            <span> More About Us </span>
          </a>
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

export default About;
