import React from 'react';

function Footer() {
  return (
    <footer className="tc-footer-style7">
      <div className="container">
        <div className="top-content">
          <div className="row justify-content-between gx-5">
            <div className="col-lg-2">
              <div className="links-group mt-5 mt-lg-0">
                <h6 className="fsz-24 fw-400 mb-30"> Featured Works </h6>
                <ul className="links">
                  <li>
                    <a href="#"> Ecohaus Residence </a>
                  </li>
                  <li>
                    <a href="#"> Aikira Ecological Area </a>
                  </li>
                  <li>
                    <a href="#"> Japan Park </a>
                  </li>
                  <li>
                    <a href="#"> Rustic Backyard </a>
                  </li>
                  <li>
                    <a href="#"> All Projects </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2">
              <div className="links-group mt-5 mt-lg-0">
                <h6 className="fsz-24 fw-400 mb-30"> Studio </h6>
                <ul className="links">
                  <li>
                    <a href="#"> About </a>
                  </li>
                  <li>
                    <a href="#"> Services </a>
                  </li>
                  <li>
                    <a href="#"> Contact </a>
                  </li>
                  <li>
                    <a href="#"> News </a>
                  </li>
                  <li>
                    <a href="#"> Career </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2">
              <div className="links-group mt-5 mt-lg-0">
                <h6 className="fsz-24 fw-400 mb-30"> Help </h6>
                <ul className="links">
                  <li>
                    <a href="#"> Privacy Policy </a>
                  </li>
                  <li>
                    <a href="#"> Terms & Conditions </a>
                  </li>
                  <li>
                    <a href="#"> FAQs </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="foot-subscribe ms-lg-5 mt-5 mt-lg-0">
                <h6 className="fsz-24 fw-400 mb-30">
                  Subscribe Our Newsletter
                </h6>
                <div className="form-group">
                  <span className="icon">
                    <i className="fal fa-envelope me-2"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your emaill address"
                  />
                  <button> subscribe </button>
                </div>
                <p>
                  By scubcribing, you’re accepted the
                  <a href="#" className="text-decoration-underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="btm-content mt-100">
          <div className="row justify-content-between">
            <div className="col-lg-7">
              <div className="links-group mt-5 mt-lg-0">
                <h6 className="fsz-24 fw-400 mb-30"> Inquire </h6>
                <ul className="links">
                  <li>
                    <a href="#"> (+068) 5681 96 96 </a>
                  </li>
                  <li>
                    <a href="#">
                      2221 Sw Broadway Dr, Portland, OR 97201, United States
                    </a>
                  </li>
                  <li>
                    <a href="#"> hello@archingarden.com </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="social-content ms-lg-5 mt-5 mt-lg-0">
                <div className="social-links">
                  <a href="#">
                    <i className="fab fa-x-twitter"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-tiktok"></i>
                  </a>
                </div>
                <p> © 2023 Archin Garden Studio. All Right Reserved </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
