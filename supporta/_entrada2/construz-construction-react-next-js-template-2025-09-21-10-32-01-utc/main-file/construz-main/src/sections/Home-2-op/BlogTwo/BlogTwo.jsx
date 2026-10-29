import Link from "next/link";

const BlogTwo = () => {
  return (
    <section className="blog-area-2 space" id="blog-sec">
      <div
        className="section-animation-shape1-1 shape-mockup animation-infinite"
        data-top="0"
        style={{ backgroundImage: "url('/main-assets/img/shape/global-line-shape1.png')" }}
      ></div>
      <div className="container">
        <div className="row justify-content-lg-between justify-content-center align-items-center">
          <div className="col-lg-6">
            <div className="title-area text-lg-start text-center">
              <span className="sub-title">
                <img src="/main-assets/img/icon/section-subtitle-icon.svg" alt="img" />
                Daly update
              </span>
              <h2 className="sec-title">OUR LATEST NEWS & BLOG</h2>
            </div>
          </div>
          <div className="col-md-auto">
            <div className="sec-btn">
              <Link href="/pages/innerpage/blog" className="btn">
                View All News <i className="ri-arrow-right-up-line"></i>
              </Link>
            </div>
          </div>
        </div>
        <div
          className="row global-carousel blog-slider slider-shadow"
          data-slide-show="3"
          data-lg-slide-show="2"
          data-md-slide-show="2"
          data-sm-slide-show="1"
          data-xs-slide-show="1"
          data-dots="false"
        >
          <div className="col-md-6 col-lg-4">
            <div className="blog-card style2">
              <div className="blog-img">
                <img src="/main-assets/img/blog/blog_1_1.png" alt="blog image" />
                <div className="blog-date">
                  <Link href="/pages/innerpage/blog">
                    <span>17</span>JUN
                  </Link>
                  <div className="year">2024</div>
                </div>
              </div>
              <div className="blog-content">
                <div className="blog-meta">
                  <Link href="/pages/innerpage/blog">By Rebecca</Link>
                  <Link href="/pages/innerpage/blog">Construction</Link>
                </div>
                <h3 className="blog-title">
                  <Link href="/pages/innerpage/blog-details">
                    How to hire a contractor home renovation service
                  </Link>
                </h3>
                <p className="blog-text">
                  Tortor posuere ac ut consequat. Tellusi elem isis etum sag
                  ittis vitae et leo duis ut diam odio ut sem
                </p>
                <Link href="/pages/innerpage/blog-details" className="btn style2">
                  More Details <i className="ri-arrow-right-up-line"></i>
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="blog-card style2">
              <div className="blog-img">
                <img src="/main-assets/img/blog/blog_1_2.png" alt="blog image" />
                <div className="blog-date">
                  <Link href="/pages/innerpage/blog">
                    <span>17</span>JUN
                  </Link>
                  <div className="year">2024</div>
                </div>
              </div>
              <div className="blog-content">
                <div className="blog-meta">
                  <Link href="/pages/innerpage/blog">By Rebecca</Link>
                  <Link href="/pages/innerpage/blog">Construction</Link>
                </div>
                <h3 className="blog-title">
                  <Link href="/pages/innerpage/blog-details">
                    Started to develop a specific testing programs
                  </Link>
                </h3>
                <p className="blog-text">
                  Tortor posuere ac ut consequat. Tellusi elem isis etum sag
                  ittis vitae et leo duis ut diam odio ut sem
                </p>
                <Link href="/pages/innerpage/blog-details" className="btn style2">
                  More Details <i className="ri-arrow-right-up-line"></i>
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="blog-card style2">
              <div className="blog-img">
                <img src="/main-assets/img/blog/blog_1_3.png" alt="blog image" />
                <div className="blog-date">
                  <Link href="/pages/innerpage/blog">
                    <span>17</span>JUN
                  </Link>
                  <div className="year">2024</div>
                </div>
              </div>
              <div className="blog-content">
                <div className="blog-meta">
                  <Link href="/pages/innerpage/blog">By Rebecca</Link>
                  <Link href="/pages/innerpage/blog">Construction</Link>
                </div>
                <h3 className="blog-title">
                  <Link href="/pages/innerpage/blog-details">
                    How to stay motivated until a project is finished
                  </Link>
                </h3>
                <p className="blog-text">
                  Tortor posuere ac ut consequat. Tellusi elem isis etum sag
                  ittis vitae et leo duis ut diam odio ut sem
                </p>
                <Link href="/pages/innerpage/blog-details" className="btn style2">
                  More Details <i className="ri-arrow-right-up-line"></i>
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="blog-card style2">
              <div className="blog-img">
                <img src="/main-assets/img/blog/blog_1_1.png" alt="blog image" />
                <div className="blog-date">
                  <Link href="/pages/innerpage/blog">
                    <span>17</span>JUN
                  </Link>
                  <div className="year">2024</div>
                </div>
              </div>
              <div className="blog-content">
                <div className="blog-meta">
                  <Link href="/pages/innerpage/blog">By Rebecca</Link>
                  <Link href="/pages/innerpage/blog">Construction</Link>
                </div>
                <h3 className="blog-title">
                  <Link href="/pages/innerpage/blog-details">
                    How to hire a contractor home renovation service
                  </Link>
                </h3>
                <p className="blog-text">
                  Tortor posuere ac ut consequat. Tellusi elem isis etum sag
                  ittis vitae et leo duis ut diam odio ut sem
                </p>
                <Link href="/pages/innerpage/blog-details" className="btn style2">
                  More Details <i className="ri-arrow-right-up-line"></i>
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="blog-card style2">
              <div className="blog-img">
                <img src="/main-assets/img/blog/blog_1_2.png" alt="blog image" />
                <div className="blog-date">
                  <Link href="/pages/innerpage/blog">
                    <span>17</span>JUN
                  </Link>
                  <div className="year">2024</div>
                </div>
              </div>
              <div className="blog-content">
                <div className="blog-meta">
                  <Link href="/pages/innerpage/blog">By Rebecca</Link>
                  <Link href="/pages/innerpage/blog">Construction</Link>
                </div>
                <h3 className="blog-title">
                  <Link href="/pages/innerpage/blog-details">
                    Started to develop a specific testing programs
                  </Link>
                </h3>
                <p className="blog-text">
                  Tortor posuere ac ut consequat. Tellusi elem isis etum sag
                  ittis vitae et leo duis ut diam odio ut sem
                </p>
                <Link href="/pages/innerpage/blog-details" className="btn style2">
                  More Details <i className="ri-arrow-right-up-line"></i>
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="blog-card style2">
              <div className="blog-img">
                <img src="/main-assets/img/blog/blog_1_3.png" alt="blog image" />
                <div className="blog-date">
                  <Link href="/pages/innerpage/blog">
                    <span>17</span>JUN
                  </Link>
                  <div className="year">2024</div>
                </div>
              </div>
              <div className="blog-content">
                <div className="blog-meta">
                  <Link href="/pages/innerpage/blog">By Rebecca</Link>
                  <Link href="/pages/innerpage/blog">Construction</Link>
                </div>
                <h3 className="blog-title">
                  <Link href="/pages/innerpage/blog-details">
                    How to stay motivated until a project is finished
                  </Link>
                </h3>
                <p className="blog-text">
                  Tortor posuere ac ut consequat. Tellusi elem isis etum sag
                  ittis vitae et leo duis ut diam odio ut sem
                </p>
                <Link href="/pages/innerpage/blog-details" className="btn style2">
                  More Details <i className="ri-arrow-right-up-line"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogTwo;
