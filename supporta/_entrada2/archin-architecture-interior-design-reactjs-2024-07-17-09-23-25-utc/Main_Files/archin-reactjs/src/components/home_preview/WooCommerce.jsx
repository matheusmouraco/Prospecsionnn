import React from 'react';

function WooCommerce() {
  return (
    <section className="tc-woocommerce">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="img wow zoomIn slow" data-wow-delay="0.2s">
              <img
                src="/home_preview/assets/img/woo1.png"
                alt=""
                className="main-img img-contain mb-50"
              />
              <img
                src="/home_preview/assets/img/woo2.png"
                alt=""
                className="sub-img img-contain"
                data-speed="1.2"
              />
            </div>
          </div>
          <div className="col-lg-4">
            <div className="info wow fadeInUp slow" data-wow-delay="0.4s">
              <h2 className="fsz-45 fw-600 mb-30">
                Easy to <br /> Sell Everything
              </h2>
              <div className="text fsz-16 mb-60 color-666">
                Archin provides all the tools you need to start selling online.
                Let your customers to experience WooCommerce at its
                absolute-best.
              </div>
              <div className="tags">
                <a href="#"> Shop Filter </a>
                <a href="#"> Quick View </a>
                <a href="#"> Sticky Menu </a>
                <a href="#"> Color & Image Swatches </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <img
        src="/home_preview/assets/img/woo_line.png"
        alt=""
        className="line"
      />
    </section>
  );
}

export default WooCommerce;
