import React from 'react';

function Footer() {
  return (
    <footer className="tc-footer-style5">
      <div className="container">
        <div className="title">
          <h2 className=""> the archin </h2>
        </div>
        <div className="info">
          <div className="row">
            <div className="col-lg-6">
              <h4> +068 5681 96 96 </h4>
            </div>
            <div className="col-lg-6 mt-4 mt-lg-0 text-lg-end">
              <p> 298 Ocean Ave st, boston, MA 90028 </p>
              <p> 9AM - 9PM EVERY DAY </p>
            </div>
          </div>
        </div>
        <div className="foot mt-150">
          <div className="row align-items-center">
            <div className="col-lg-4">
              <a
                href="#"
                className="download-link justify-content-center text-center justify-content-lg-start text-lg-start"
              >
                <span className="icon">
                  <i className="fal fa-arrow-to-bottom"></i>
                </span>
                <span className="txt">
                  download <br /> brochure (.pdf)
                </span>
              </a>
            </div>
            <div className="col-lg-4 text-center py-4 py-lg-0">
              <a href="#"> © 2023 archin complex residence </a>
            </div>
            <div className="col-lg-4 text-center text-lg-end">
              <div className="social-icons">
                <a href="#">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#">
                  <i className="fab fa-youtube"></i>
                </a>
                <a href="#">
                  <i className="fab fa-tiktok"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
