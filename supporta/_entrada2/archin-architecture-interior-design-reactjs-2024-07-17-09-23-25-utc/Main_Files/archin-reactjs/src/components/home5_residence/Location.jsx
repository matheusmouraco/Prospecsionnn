import React from 'react';
import data from '../../data/home5_residence/location';
function Location() {
  return (
    <section className="tc-location-style5">
      <div className="location-slider">
        <div className="swiper-wrapper">
          {data.map((item, i) => (
            <div key={i} className="swiper-slide">
              <div className="slider-card">
                <img src={item.img} alt="" className="bg" />
                <div className="container">
                  <div className="content">
                    <div className="row justify-content-between">
                      <div className="col-lg-5">
                        <div className="info">
                          <div className="num-cont">
                            <span className="number"> {item.num} </span>
                            <p className="fsz-18 text-uppercase">
                              {item.subTitle.split('<br />')[0]} <br />
                              {item.subTitle.split('<br />')[1]}
                            </p>
                          </div>
                          <h2>
                            {item.title.split('<br />')[0]} <br />
                            {item.title.split('<br />')[1]}
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="arrows">
          <div className="swiper-button-prev"></div>
          <div className="swiper-button-next"></div>
        </div>
      </div>
    </section>
  );
}

export default Location;
