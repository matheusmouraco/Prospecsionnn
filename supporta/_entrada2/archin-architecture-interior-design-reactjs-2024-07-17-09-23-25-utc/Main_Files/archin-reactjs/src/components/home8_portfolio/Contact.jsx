import React from 'react';

function Contact() {
  return (
    <div className="swiper-slide">
      <section className="section tc-contact-style8">
        <div className="container">
          <div className="section-head mb-4 mb-lg-0">
            <h3 className="fsz-30 fw-600 text-uppercase">
              contact <br /> us
            </h3>
          </div>
          <div className="section-body">
            <div className="section-body">
              <div className="text fsz-16">
                2221 Sw Broadway Dr, Portland, OR 97201 <br />
                hello@archinstudio.co
              </div>
              <a
                href="#"
                className="butn border rounded-pill border-white hover-bg-orange1 text-capitalize text-white mt-20 fsz-13 pt-15 pb-15"
              >
                <span> Let’s Talk! </span>
              </a>
              <h1> (021) 566 5732 </h1>
              <span className="num mt-40"> 07 </span>
            </div>
          </div>
        </div>
        <video
          className="bg-video"
          width="100%"
          height="100%"
          autoPlay={true}
          muted={true}
          loop={true}
        >
          <source
            src="/home8_portfolio/assets/img/contact_vid.mp4"
            type="video/mp4"
          />
        </video>
      </section>
    </div>
  );
}

export default Contact;
