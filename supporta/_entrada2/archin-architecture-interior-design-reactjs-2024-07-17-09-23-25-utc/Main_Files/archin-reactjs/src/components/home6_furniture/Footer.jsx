import React from 'react';

function Footer() {
  return (
    <footer className="tc-footer-style6">
      <div className="container">
        <div className="content">
          <div className="foot-links">
            <a href="#"> home </a>
            <a href="#"> shop </a>
            <a href="#"> about </a>
            <a href="#"> news </a>
            <a href="#"> contact </a>
            <a href="#"> trade program </a>
            <a href="#"> faqs </a>
            <a href="#"> policy </a>
            <a href="#"> terms & conditions </a>
          </div>
          <div className="main-content">
            <div className="row justify-content-between">
              <div className="col-lg-3">
                <div className="social-links text-center text-lg-start">
                  <h4 className="foot-title fsz-24 text-uppercase mb-30 mt-70">
                    social
                  </h4>
                  <div className="links">
                    <a href="#">
                      <i className="fab fa-x-twitter"></i>
                    </a>
                    <a href="#">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#">
                      <i className="fab fa-tiktok"></i>
                    </a>
                    <a href="#">
                      <i className="fab fa-youtube"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="foot-info text-center">
                  <h4 className="foot-title fsz-24 text-uppercase mb-30 mt-70">
                    information
                  </h4>
                  <ul className="color-666">
                    <li>
                      <a href="#">268 Elizaberth Ave St, Brooklyn, CA 90005</a>
                    </li>
                    <li>
                      <a href="#"> (054) 3256 78 87 </a>
                    </li>
                    <li>
                      <a href="#"> hello@archinfurniture.com </a>
                    </li>
                    <li>
                      <a href="#"> 9:00AM - 9:00PM Everyday </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="newsletter text-center text-lg-end">
                  <h4 className="foot-title fsz-24 text-uppercase mb-30 mt-70">
                    newsletter
                  </h4>
                  <div className="form-group">
                    <span className="icon me-2">
                      <i className="fal fa-envelope"></i>
                    </span>
                    <input type="text" placeholder="Email Address..." />
                    <button>
                      <i className="fal fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="payment">
            <img src="/home6_furniture/assets/images/payment.png" alt="" />
          </div>
          <div className="copy text-center mt-50">
            <p className="color-666">
              © 2023 Archin Furniture. All Right Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
