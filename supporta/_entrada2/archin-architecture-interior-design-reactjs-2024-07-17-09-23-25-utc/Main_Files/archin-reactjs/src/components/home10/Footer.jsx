import React from 'react';

function Footer() {
  return (
    <footer className="tc-footer-style10 section-padding-x">
      <div className="container-fluid">
        <div className="top-content section-padding">
          <div className="row gx-0">
            <div className="col-lg-3">
              <div className="info-side">
                <div className="text fsz-17 color-333 lh-3 fw-500">
                  We believe that architecture has the power to shape lives and
                  uplift communities. Archin&lsquo;s philosophy is passion for
                  innovation, sustainablity and t imeless aesthetics
                </div>
                <div className="foot-social mt-50">
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
            <div className="col-lg-3 offset-lg-3">
              <div className="branch-card">
                <h5 className="mb-20 mt-5 mt-lg-0"> Boston, MA </h5>
                <ul className="fsz-13 lh-5 color-333">
                  <li>
                    <a href="#">Room 505, 49 Brimmer st, Boston, MA 02108</a>
                  </li>
                  <li>
                    <a href="#"> contact@archinstudio.co </a>
                  </li>
                  <li>
                    <a href="#"> (054) 3256 78 87 </a>
                  </li>
                </ul>
              </div>
              <div className="branch-card">
                <h5 className="mb-20 mt-5"> Boston, MA </h5>
                <ul className="fsz-13 lh-5 color-333">
                  <li>
                    <a href="#"> 3D Visualization Architect </a>
                  </li>
                  <li>
                    <a href="#"> Interior Architect </a>
                  </li>
                  <li>
                    <a href="#"> Sustainable Design Architect </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="branch-card">
                <h5 className="mb-20 mt-5 mt-lg-0"> Portland, OR </h5>
                <ul className="fsz-13 lh-5 color-333">
                  <li>
                    <a href="#">2221 Sw Broadway Dr, Portland, OR 97201</a>
                  </li>
                  <li>
                    <a href="#"> contact@archinstudio.co </a>
                  </li>
                  <li>
                    <a href="#"> (021) 4246 63 68 </a>
                  </li>
                </ul>
              </div>
              <div className="branch-card">
                <h5 className="mb-20 mt-5"> Helps </h5>
                <ul className="fsz-13 lh-5 color-333">
                  <li>
                    <a href="#"> Term & Conditions </a>
                  </li>
                  <li>
                    <a href="#"> Partner Policy </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="foot">
          <div className="row">
            <div className="col-lg-6">
              <p className="fsz-13">
                {' '}
                © 2023 Archin Studio. All Right Reserved{' '}
              </p>
            </div>
            <div className="col-lg-6">
              <div className="foot-links mt-4 mt-lg-0">
                <a href="#"> Home </a>
                <a href="#"> Studio </a>
                <a href="#"> Cases </a>
                <a href="#"> News </a>
                <a href="#"> Contact </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
