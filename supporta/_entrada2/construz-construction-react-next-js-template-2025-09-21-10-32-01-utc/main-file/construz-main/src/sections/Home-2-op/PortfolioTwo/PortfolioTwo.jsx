import Link from "next/link";

const PortfolioTwo = () => {
  return (
    <div className="portfolio-area-2 space" id="project-sec">
      <div className="container">
        <div className="row justify-content-between">
          <div className="col-lg-7">
            <div className="title-area text-lg-start text-center">
              <span className="sub-title">
                <img src="/main-assets/img/icon/section-subtitle-icon.svg" alt="img" />
                Recent Work
              </span>
              <h2 className="sec-title">CHECK OUR LATEST PROJECTS</h2>
            </div>
          </div>
          <div className="col-lg-auto">
            <div className="sec-btn">
              <Link href="/pages/innerpage/project" className="btn">
                View All Projects <i className="ri-arrow-right-up-line"></i>
              </Link>
            </div>
          </div>
        </div>
        <div className="portfolio-slider2 overflow-hidden">
          <div
            className="row gy-30 gx-30 global-carousel"
            data-slide-show="3"
            data-md-slide-show="2"
          >
            <div className="col-lg-4">
              <div className="portfolio-card style2">
                <div className="portfolio-card-thumb">
                  <img src="/main-assets/img/project/project2_1.png" alt="img" />
                  <span className="portfolio-card-number">01</span>
                  <Link
                    className="icon-btn popup-image"
                    href="/main-assets/img/project/project2_1.png"
                  >
                    <i className="ri-eye-line"></i>
                  </Link>
                </div>
                <div className="portfolio-card-details">
                  <span className="portfolio-card-subtitle">Building</span>
                  <h4 className="portfolio-card-title">
                    <Link href="/pages/innerpage/project-details">Building Construction</Link>
                  </h4>
                  <p className="portofolio-card-text">
                    Building since 09,01,2024
                  </p>
                  <Link href="/pages/innerpage/project-details" className="btn-with-icon">
                    VIEW DETAILS
                    <span className="btn-icon">
                      <i className="ri-arrow-right-up-line"></i>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="portfolio-card style2">
                <div className="portfolio-card-thumb">
                  <img src="/main-assets/img/project/project2_2.png" alt="img" />
                  <span className="portfolio-card-number">02</span>
                  <Link
                    className="icon-btn popup-image"
                    href="/main-assets/img/project/project2_2.png"
                  >
                    <i className="ri-eye-line"></i>
                  </Link>
                </div>
                <div className="portfolio-card-details">
                  <span className="portfolio-card-subtitle">Construction</span>
                  <h4 className="portfolio-card-title">
                    <Link href="/pages/innerpage/project-details">General Construction</Link>
                  </h4>
                  <p className="portofolio-card-text">
                    Building since 09,01,2024
                  </p>
                  <Link href="/pages/innerpage/project-details" className="btn-with-icon">
                    VIEW DETAILS
                    <span className="btn-icon">
                      <i className="ri-arrow-right-up-line"></i>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="portfolio-card style2">
                <div className="portfolio-card-thumb">
                  <img src="/main-assets/img/project/project2_3.png" alt="img" />
                  <span className="portfolio-card-number">03</span>
                  <Link
                    className="icon-btn popup-image"
                    href="/main-assets/img/project/project2_3.png"
                  >
                    <i className="ri-eye-line"></i>
                  </Link>
                </div>
                <div className="portfolio-card-details">
                  <span className="portfolio-card-subtitle">Remodeling</span>
                  <h4 className="portfolio-card-title">
                    <Link href="/pages/innerpage/project-details">Renovation & Remodeling</Link>
                  </h4>
                  <p className="portofolio-card-text">
                    Building since 09,01,2024
                  </p>
                  <Link href="/pages/innerpage/project-details" className="btn-with-icon">
                    VIEW DETAILS
                    <span className="btn-icon">
                      <i className="ri-arrow-right-up-line"></i>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="portfolio-card style2">
                <div className="portfolio-card-thumb">
                  <img src="/main-assets/img/project/project2_1.png" alt="img" />
                  <span className="portfolio-card-number">01</span>
                  <Link
                    className="icon-btn popup-image"
                    href="/main-assets/img/project/project2_1.png"
                  >
                    <i className="ri-eye-line"></i>
                  </Link>
                </div>
                <div className="portfolio-card-details">
                  <span className="portfolio-card-subtitle">Building</span>
                  <h4 className="portfolio-card-title">
                    <Link href="/pages/innerpage/project-details">Building Construction</Link>
                  </h4>
                  <p className="portofolio-card-text">
                    Building since 09,01,2024
                  </p>
                  <Link href="/pages/innerpage/project-details" className="btn-with-icon">
                    VIEW DETAILS
                    <span className="btn-icon">
                      <i className="ri-arrow-right-up-line"></i>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="portfolio-card style2">
                <div className="portfolio-card-thumb">
                  <img src="/main-assets/img/project/project2_2.png" alt="img" />
                  <span className="portfolio-card-number">02</span>
                  <Link
                    className="icon-btn popup-image"
                    href="/main-assets/img/project/project2_2.png"
                  >
                    <i className="ri-eye-line"></i>
                  </Link>
                </div>
                <div className="portfolio-card-details">
                  <span className="portfolio-card-subtitle">Construction</span>
                  <h4 className="portfolio-card-title">
                    <Link href="/pages/innerpage/project-details">General Construction</Link>
                  </h4>
                  <p className="portofolio-card-text">
                    Building since 09,01,2024
                  </p>
                  <Link href="/pages/innerpage/project-details" className="btn-with-icon">
                    VIEW DETAILS
                    <span className="btn-icon">
                      <i className="ri-arrow-right-up-line"></i>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="portfolio-card style2">
                <div className="portfolio-card-thumb">
                  <img src="/main-assets/img/project/project2_3.png" alt="img" />
                  <span className="portfolio-card-number">03</span>
                  <Link
                    className="icon-btn popup-image"
                    href="/main-assets/img/project/project2_3.png"
                  >
                    <i className="ri-eye-line"></i>
                  </Link>
                </div>
                <div className="portfolio-card-details">
                  <span className="portfolio-card-subtitle">Remodeling</span>
                  <h4 className="portfolio-card-title">
                    <Link href="/pages/innerpage/project-details">Renovation & Remodeling</Link>
                  </h4>
                  <p className="portofolio-card-text">
                    Building since 09,01,2024
                  </p>
                  <Link href="/pages/innerpage/project-details" className="btn-with-icon">
                    VIEW DETAILS
                    <span className="btn-icon">
                      <i className="ri-arrow-right-up-line"></i>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioTwo;
