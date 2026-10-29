import React from 'react';
import data from '../../data/home6_furniture/bystyle';
function ByStyle() {
  return (
    <section className="tc-by-style-style6">
      <div className="style-slider">
        <div className="swiper-wrapper">
          {data.map((item, i) => (
            <div key={i} className="swiper-slide">
              <div className="slider-card">
                <img src={item.img1} alt="" className="bg" />
                <div className="container">
                  <div className="content">
                    <div className="row justify-content-between">
                      <div className="col-lg-6">
                        <div className="info">
                          <h3 className="tag-title"> by style </h3>
                          <div className="text">
                            {item.desc.split('<br />')[0]}
                            <br /> {item.desc.split('<br />')[1]}
                          </div>
                          <a
                            href="#"
                            className="butn border radius-4 border-white hover-bg-brown2 text-capitalize text-white mt-50"
                          >
                            <span> View Collection </span>
                          </a>
                          <h2 className="title"> {item.title1} </h2>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="product-card">
                          <div className="img">
                            <div className="tags">
                              <a href="#"> new </a>
                            </div>
                            <img
                              src={item.img2}
                              alt=""
                              className="img-contain"
                            />
                          </div>
                          <div className="inf text-center mt-30">
                            <h4 className="fsz-30 fw-400 mb-15">
                              {item.title2}
                            </h4>
                            <p className="price d-block fsz-14 color-666">
                              <span> {item.price} </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>
      </div>
    </section>
  );
}

export default ByStyle;
