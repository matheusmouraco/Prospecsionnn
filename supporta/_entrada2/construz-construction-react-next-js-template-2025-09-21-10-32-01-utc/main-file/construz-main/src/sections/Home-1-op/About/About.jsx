import Link from "next/link";

const About = () => {
  return (
    <div className="about-area-1 space overflow-hidden" id="about-sec">
      <div
        className="section-animation-shape1-1 shape-mockup animation-infinite"
        data-bottom="0"
        style={{ backgroundImage: "url('/main-assets/img/shape/global-line-shape2.png')" }}
      ></div>
      <div
        className="about_shape_1-1 shape-mockup jump-reverse"
        data-bottom="0"
        data-right="0"
      >
        <img src="/main-assets/img/normal/about_shape_1-2.png" alt="img" />
      </div>
      <div className="container">
        <div className="row gx-60 align-items-center">
          <div className="col-xl-6">
            <div className="about-thumb1 mb-40 mb-lg-0">
              <div className="about-img-1">
                <img src="/main-assets/img/normal/about_1-1.png" alt="img" />
              </div>
              <div className="about-counter-wrap jump">
                <h3 className="about-counter-number">
                  <span className="counter-number">1.2</span>k
                </h3>
                <p className="about-counter-text">Happy Customers</p>
                <div className="about-counter-shape">
                  <img src="/main-assets/img/normal/about_shape_1-1.png" alt="img" />
                </div>
                <div className="client-group-thumb">
                  <img src="/main-assets/img/normal/client_group_1-1.png" alt="img" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="about-content-wrap1">
              <div className="title-area mb-25">
                <span className="sub-title">
                  <img src="/main-assets/img/icon/section-subtitle-icon.svg" alt="img" />
                  ABOUT US
                </span>
                <h2 className="sec-title">
                  We building everything Tthat you needed
                </h2>
                <p className="sec-text">
                  We craft unique digital experiences. With more than 7 years of
                  expertise we design and code clean websites.
                </p>
              </div>
              <div className="checklist mb-35">
                <ul>
                  <li>
                    <img
                      src="/main-assets/img/icon/about-checklsit-icon1-1.svg"
                      alt="img"
                    />
                    Providing Solutions For Construction, Management
                  </li>
                  <li>
                    <img
                      src="/main-assets/img/icon/about-checklsit-icon1-1.svg"
                      alt="img"
                    />
                    Engineers design and build the structure
                  </li>
                </ul>
              </div>
              <div className="about-grid-wrap">
                <div className="icon">
                  <img src="/main-assets/img/icon/about-grid-icon1-1.svg" alt="img" />
                </div>
                <div className="about-grid-details">
                  <h4 className="title">Our Mission</h4>
                  <p className="text">
                    We craft unique digital experiences. With more years of
                    expertise we design{" "}
                  </p>
                </div>
              </div>
              <div className="about-grid-wrap">
                <div className="icon">
                  <img src="/main-assets/img/icon/about-grid-icon1-2.svg" alt="img" />
                </div>
                <div className="about-grid-details">
                  <h4 className="title">Our Vision</h4>
                  <p className="text">
                    We craft unique digital experiences. With more years of
                    expertise we design{" "}
                  </p>
                </div>
              </div>
              <div className="btn-group mt-60">
                <Link href="/pages/innerpage/about" className="btn style3">
                  Explore Our Company <i className="ri-arrow-right-up-line"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
