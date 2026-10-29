import React from 'react';

function Navbar() {
  return (
    <nav className="tc-top-nav-style6">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="text-slider">
              <div className="swiper-wrapper">
                <div className="swiper-slide">
                  <div className="slider-card text-uppercase">
                    <p>
                      10% OFF for New Member!
                      <a
                        href="#"
                        className="text-decoration-underline fst-italic"
                      >
                        Register Now
                      </a>
                    </p>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="slider-card text-uppercase">
                    <p>
                      10% OFF for New Member!
                      <a
                        href="#"
                        className="text-decoration-underline fst-italic"
                      >
                        Register Now
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="swiper-button-next"></div>
              <div className="swiper-button-prev"></div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
