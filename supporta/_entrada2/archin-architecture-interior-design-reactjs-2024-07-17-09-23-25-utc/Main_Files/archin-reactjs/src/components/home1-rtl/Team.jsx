import React from 'react';

function Team() {
  return (
    <section className="tc-team-style1">
      <div className="container">
        <div className="mb-80 js-splittext-lines">
          <h2 className="fsz-45"> تعرف على أفضل الخبراء لدينا </h2>
        </div>
        <div className="members">
          <div className="row">
            <div className="col-lg-2">
              <div className="member-colmn">
                <a href="#" className="team-card wow zoomIn">
                  <div className="img">
                    <img
                      src="/home1/assets/img/ar_imgs/t8.jpg"
                      alt=""
                      className="img-cover"
                    />
                  </div>
                  <h5 className="title">
                    سعد <br /> عياد
                  </h5>
                </a>
                <a
                  href="#"
                  className="team-card wow zoomIn"
                  data-wow-delay="0.1s"
                >
                  <div className="img">
                    <img
                      src="/home1/assets/img/ar_imgs/t2.jpg"
                      alt=""
                      className="img-cover"
                    />
                  </div>
                  <h5 className="title">
                    محمد <br /> البريجى
                  </h5>
                </a>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="member-colmn">
                <a
                  href="#"
                  className="team-card wow zoomIn"
                  data-wow-delay="0.2s"
                >
                  <div className="img">
                    <img
                      src="/home1/assets/img/ar_imgs/t3.jpg"
                      alt=""
                      className="img-cover"
                    />
                  </div>
                  <h5 className="title">
                    قاسم <br /> محمد
                  </h5>
                </a>
              </div>
            </div>
            <div className="col-lg-2">
              <div className="member-colmn">
                <a
                  href="#"
                  className="team-card wow zoomIn"
                  data-wow-delay="0.3s"
                >
                  <div className="img">
                    <img
                      src="/home1/assets/img/ar_imgs/t4.jpg"
                      alt=""
                      className="img-cover"
                    />
                  </div>
                  <h5 className="title">
                    فاروق <br /> عبداللة
                  </h5>
                </a>
                <a
                  href="#"
                  className="team-card wow zoomIn"
                  data-wow-delay="0.4s"
                >
                  <div className="img">
                    <img
                      src="/home1/assets/img/ar_imgs/t5.jpg"
                      alt=""
                      className="img-cover"
                    />
                  </div>
                  <h5 className="title">
                    سعيد <br /> محب
                  </h5>
                </a>
              </div>
            </div>
            <div className="col-lg-2 order-last order-lg-0">
              <div className="member-colmn">
                <a
                  href="#"
                  className="team-card wow zoomIn"
                  data-wow-delay="0.5s"
                >
                  <div className="img">
                    <img
                      src="/home1/assets/img/ar_imgs/t6.jpg"
                      alt=""
                      className="img-cover"
                    />
                  </div>
                  <h5 className="title">
                    فادى <br /> العامرى
                  </h5>
                </a>
                <a
                  href="#"
                  className="team-card team-text wow zoomIn"
                  data-wow-delay="0.6s"
                >
                  <div className="img">
                    <h5 className="title">
                      <div className="con">
                        <span>
                          مشاهدة جميع <br /> خبرائنا
                        </span>
                        <span className="arrow">
                          <i className="ti-arrow-top-right"></i>
                        </span>
                      </div>
                    </h5>
                  </div>
                </a>
              </div>
            </div>
            <div className="col-lg-2">
              <div className="member-colmn">
                <a
                  href="#"
                  className="team-card wow zoomIn"
                  data-wow-delay="0.7s"
                >
                  <div className="img">
                    <img
                      src="/home1/assets/img/ar_imgs/t7.jpg"
                      alt=""
                      className="img-cover"
                    />
                  </div>
                  <h5 className="title">
                    فتحى <br /> القاسم
                  </h5>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="numbers">
          <div className="row gx-5">
            <div className="col-lg-4">
              <div className="number-card wow fadeInUp" data-wow-delay="0.2s">
                <h3 className="perc"> 95% </h3>
                <p>
                  عملاء سعداء <br /> ومستمرون
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="number-card wow fadeInUp" data-wow-delay="0.4s">
                <h3 className="perc"> 126 </h3>
                <p>
                  مشاريع مكتمله خلال <br /> 15 عاما
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="number-card wow fadeInUp" data-wow-delay="0.6s">
                <h3 className="perc"> 25 </h3>
                <p>
                  المهندسين المعماريين <br /> والحرفيين المؤهلين تأهيلا عاليا
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Team;
