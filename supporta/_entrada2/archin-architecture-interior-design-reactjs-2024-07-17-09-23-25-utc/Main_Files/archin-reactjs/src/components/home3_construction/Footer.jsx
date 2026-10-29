import React from 'react';

function Footer() {
  return (
    <footer className="tc-footer-style3">
      <div className="container">
        <div className="top-info">
          <div className="row gx-0 align-items-end">
            <div className="col-lg-4">
              <a href="#" className="foot-logo mb-5 mb-lg-0">
                <img src="/home3_construction/assets/img/logo.png" alt="" />
              </a>
            </div>
            <div className="col-lg-4">
              <a href="#" className="text-uppercase mb-5 mb-lg-0">
                <span> private client </span>
                <i className="ti-arrow-top-right ms-2"></i>
              </a>
            </div>
            <div className="col-lg-4">
              <div className="top-links text-lg-end mb-5 mb-lg-0">
                <a href="#"> company </a>
                <a href="#"> services </a>
                <a href="#"> works </a>
                <a href="#"> news </a>
                <a href="#"> contact </a>
              </div>
            </div>
          </div>
        </div>
        <div className="main-content">
          <div className="row">
            <div className="col-lg-2 mb-5 mb-lg-0">
              <h5 className="fsz-24 text-uppercase fw-500 lh-5">
                timeless, <br /> sustainable & <br /> stable
              </h5>
            </div>
            <div className="col-lg-3 offset-lg-2 mb-5 mb-lg-0">
              <div className="adresses">
                <div className="adress-card mb-70">
                  <h5 className="fsz-24 text-uppercase fw-500 lh-5 mb-4">
                    Boston, MA
                  </h5>
                  <ul className="color-999 lh-5">
                    <li>
                      <a href="#"> 49 Brimmer St, Boston, MA 02108 </a>
                    </li>
                    <li>
                      <a href="#"> hello@archinconstruction.com </a>
                    </li>
                    <li>
                      <a href="#"> (054) 3256 78 87 </a>
                    </li>
                  </ul>
                </div>
                <div className="adress-card">
                  <h5 className="fsz-24 text-uppercase fw-500 lh-5 mb-4">
                    Portland, OR
                  </h5>
                  <ul className="color-999 lh-5">
                    <li>
                      <a href="#">2221 Sw Broadway Dr, Portland, OR 97201</a>
                    </li>
                    <li>
                      <a href="#"> contact@archinconstruction.com </a>
                    </li>
                    <li>
                      <a href="#"> (021) 4246 63 68 </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-2 offset-lg-1 mb-5 mb-lg-0">
              <div className="links">
                <h5 className="fsz-24 text-uppercase fw-500 lh-5 mb-4">
                  works
                </h5>
                <ul className="color-999 lh-7">
                  <li>
                    <a href="#"> Orlando Park </a>
                  </li>
                  <li>
                    <a href="#"> Dumbarton Bridge </a>
                  </li>
                  <li>
                    <a href="#"> Houston Port </a>
                  </li>
                  <li>
                    <a href="#"> France BMF Terminal </a>
                  </li>
                  <li>
                    <a href="#"> Golden Tower Residence </a>
                  </li>
                  <li>
                    <a href="#"> Oregon Office Building </a>
                  </li>
                  <li>
                    <a href="#"> Dallas Museum </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2">
              <div className="social">
                <h5 className="fsz-24 text-uppercase fw-500 lh-5 mb-4">
                  Social
                </h5>
                <div className="social-links">
                  <a href="#">
                    <i className="lab la-twitter"></i>
                  </a>
                  <a href="#">
                    <i className="lab la-facebook-f"></i>
                  </a>
                  <a href="#">
                    <i className="lab la-instagram"></i>
                  </a>
                  <a href="#">
                    <i className="lab la-linkedin-in"></i>
                  </a>
                  <a href="#">
                    <i className="lab la-youtube"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="foot">
          <div className="row align-items-center">
            <div className="col-lg-4">
              <div className="btn-select">
                <select name="" id="" className="form-select">
                  <option value="">English</option>
                  <option value="">Arabic</option>
                </select>
              </div>
            </div>
            <div className="col-lg-4 mt-4 mt-lg-0">
              <p className="color-999">
                © 2023 Archin Construction. All Right Reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
