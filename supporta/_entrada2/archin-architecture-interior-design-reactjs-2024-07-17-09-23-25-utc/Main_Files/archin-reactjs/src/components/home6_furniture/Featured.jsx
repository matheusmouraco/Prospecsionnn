import React from 'react';
import data from '../../data/home6_furniture/features';
function Featured() {
  return (
    <section className="tc-featured-style6">
      <div className="container">
        <div className="section-title mb-50 text-center">
          <h2 className="js-splittext-lines"> featured items </h2>
        </div>
        <ul className="nav nav-pills" id="pills-tab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active"
              id="pills-tab1-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-tab1"
            >
              Best Seller
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="pills-tab2-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-tab2"
            >
              New Arrival
            </button>
          </li>
        </ul>
        <div
          className="tab-content wow fadeInUp slow"
          data-wow-delay="0.2s"
          id="pills-tabContent"
        >
          <div className="tab-pane fade show active" id="pills-tab1">
            <div className="products-slider">
              <div className="swiper-wrapper">
                {data.new.map((item, i) => (
                  <div key={i} className="swiper-slide">
                    <div className="product-card">
                      <div className="img">
                        <div className="tags">
                          <a href="#"> {item.offer} </a>
                        </div>
                        <img src={item.img} alt="" className="img-contain" />
                        <a
                          href="#"
                          className="butn border hover-bg-black text-uppercase bg-brown2 text-white"
                        >
                          <span> quick buy </span>
                        </a>
                      </div>
                      <div className="info text-center mt-30">
                        <h4 className="fsz-30 fw-400 mb-15">{item.title}</h4>
                        <p className="price d-block fsz-14 color-666">
                          {item.oldPrice && (
                            <span className="old-price color-orange1 text-decoration-line-through me-2">
                              {item.oldPrice}
                            </span>
                          )}
                          <span> {item.price} </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="swiper-button-prev"></div>
              <div className="swiper-button-next"></div>
              <div className="swiper-pagination"></div>
            </div>
          </div>
          <div className="tab-pane fade" id="pills-tab2">
            <div className="products-slider">
              <div className="swiper-wrapper">
                {data.best.map((item, i) => (
                  <div key={i} className="swiper-slide">
                    <div className="product-card">
                      <div className="img">
                        <div className="tags">
                          <a href="#"> {item.offer} </a>
                        </div>
                        <img src={item.img} alt="" className="img-contain" />
                        <a
                          href="#"
                          className="butn border hover-bg-black text-uppercase bg-brown2 text-white"
                        >
                          <span> quick buy </span>
                        </a>
                      </div>
                      <div className="info text-center mt-30">
                        <h4 className="fsz-30 fw-400 mb-15">{item.title}</h4>
                        <p className="price d-block fsz-14 color-666">
                          {item.oldPrice && (
                            <span className="old-price color-orange1 text-decoration-line-through me-2">
                              {item.oldPrice}
                            </span>
                          )}
                          <span> {item.price} </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="swiper-button-prev"></div>
              <div className="swiper-button-next"></div>
              <div className="swiper-pagination"></div>
            </div>
          </div>
        </div>
        <div className="text-center wow fadeInUp slow" data-wow-delay="0.2s">
          <a
            href="#"
            className="butn border radius-4 border-brown2 hover-bg-brown2 text-capitalize color-brown2 mt-80"
          >
            <span> View All Products </span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Featured;
