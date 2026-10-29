import React from 'react';

function Footer() {
  return (
    <footer className="tc-footer-style2">
      <div className="container">
        <div className="foot-main-content">
          <div className="row">
            <div className="col-lg-4">
              <div className="foot-info">
                <h3 className="fsz-35 fw-500">
                  Space. Aesthetic. Life. Moments.
                  <span className="sub-font color-orange1 fst-italic">
                    Yourself
                  </span>
                </h3>
                <a
                  href="#"
                  className="butn borderd border rounded-pill hover-bg-black mt-80"
                >
                  <span>
                    <i className="me-2 fal fa-globe"></i> English
                  </span>
                </a>
              </div>
            </div>
            <div className="col-lg-3 offset-lg-1">
              <div className="links-group">
                <h5 className="sub-title fsz-24 fw-500 mb-30 mt-5 mt-lg-0">
                  Asheville, NC
                </h5>
                <ul>
                  <li>
                    <a href="#"> 952 Bad Hill St, Asheville, NC 28803 </a>
                  </li>
                  <li>
                    <a href="#"> contact@archininterior.com </a>
                  </li>
                  <li>
                    <a href="#"> (+706) 856 01 95 </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2">
              <div className="links-group">
                <h5 className="sub-title fsz-24 fw-500 mb-30 mt-5 mt-lg-0">
                  Company
                </h5>
                <ul>
                  <li>
                    <a href="#"> Services </a>
                  </li>
                  <li>
                    <a href="#"> Works </a>
                  </li>
                  <li>
                    <a href="#"> Studio </a>
                  </li>
                  <li>
                    <a href="#"> News </a>
                  </li>
                  <li>
                    <a href="#"> Contact </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2">
              <div className="links-group">
                <h5 className="sub-title fsz-24 fw-500 mb-30 mt-5 mt-lg-0">
                  Helps
                </h5>
                <ul>
                  <li>
                    <a href="#"> Terms & Conditions </a>
                  </li>
                  <li>
                    <a href="#"> Partner Policy </a>
                  </li>
                  <li>
                    <a href="#"> Affiliate Program </a>
                  </li>
                  <li>
                    <a href="#"> FAQs </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="foot">
          <div className="row align-items-center">
            <div className="col-lg-2">
              <a href="#" className="logo">
                <img src="/home2/assets/img/logo.png" alt="" />
              </a>
            </div>
            <div className="col-lg-3">
              <p className="copy">
                © 2023 Archin Interior Studio. <br /> All Right Reserved
              </p>
            </div>
            <div className="col-lg-5">
              <div className="social-links">
                <a href="#">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
            <div className="col-lg-2">
              <a
                href="#"
                className="butn borderd border rounded-pill hover-bg-black"
                id="to_top"
              >
                <span>
                  Back to Top <i className="ms-2 fal fa-chevron-up"></i>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <img src="/home2/assets/img/foot_shap.svg" alt="" className="shap" />
    </footer>
  );
}

export default Footer;
