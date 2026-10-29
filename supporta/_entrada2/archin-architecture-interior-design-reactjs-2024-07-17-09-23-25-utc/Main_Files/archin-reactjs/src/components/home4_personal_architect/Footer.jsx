import React from 'react';

function Footer() {
  return (
    <footer className="tc-footer-style4">
      <div className="container">
        <div className="top-content wow fadeInUp slow" data-wow-delay="0.4s">
          <h2> Hire me! </h2>
          <h6 className="float_txt js-title"> Connect </h6>
        </div>
        <div className="main-content">
          <div className="row justify-content-between">
            <div className="col-lg-3">
              <div className="text fsz-18 color-666">
                I would be delighted to <br /> help you for create your <br />
                dream interior!
              </div>
            </div>
            <div className="col-lg-5">
              <a href="#" className="contact-number fsz-60 lh-1">
                +068 5681 96 96
              </a>
              <ul className="fsz-24 mt-50">
                <li>
                  <a href="#"> hello@jorgerclarkson.com </a>
                </li>
                <li>
                  <a href="#"> 268 Ocean Ave St, San Francisco, CA </a>
                </li>
              </ul>
              <div className="social-icons">
                <a href="#">
                  <i className="lab la-instagram"></i>
                </a>
                <a href="#">
                  <i className="lab la-linkedin-in"></i>
                </a>
                <a href="#">
                  <i className="lab la-behance"></i>
                </a>
              </div>
            </div>
            <div className="col-lg-2 text-lg-end mt-4 mt-lg-0">
              <a href="#" className="text-uppercase border-bottom border-dark">
                <i className="la la-map-marker me-2 fs-5"></i>
                <span> Get Direction </span>
              </a>
            </div>
          </div>
        </div>
        <div className="foot">
          <div className="row justify-content-between">
            <div className="col-lg-1">
              <a href="#" className="foot-logo">
                <img
                  src="/home4_personal_architect/assets/img/logo.png"
                  alt=""
                />
              </a>
            </div>
            <div className="col-lg-3">
              <div className="links">
                <a href="#"> All Works </a>
                <a href="#"> About </a>
                <a href="#"> Contact </a>
              </div>
            </div>
            <div className="col-lg-2 text-lg-end">
              <p>
                © 2023 Jorger Clarson. <br /> All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="foot-img">
        <img
          src="/home4_personal_architect/assets/img/foot_img.png"
          alt=""
          className="img-cover"
        />
      </div>
    </footer>
  );
}

export default Footer;
