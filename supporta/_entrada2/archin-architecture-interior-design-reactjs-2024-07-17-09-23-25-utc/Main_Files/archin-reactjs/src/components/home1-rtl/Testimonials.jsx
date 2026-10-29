import React from 'react';

function Testimonials() {
  return (
    <section className="tc-testimonials-style1">
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <h6 className="fsz-18 text-uppercase lh-4">
              ماذا يقول العملاء <br /> عن شركتنا
            </h6>
            <div className="lg-icon color-orange1">
              <i className="la la-quote-right"></i>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="tc-clients-style1">
              <div className="clients-slider1">
                <div className="swiper-wrapper">
                  <div className="swiper-slide">
                    <div className="clients-card">
                      <div className="text fsz-45 fw-600 lh-2 js-splittext-lines">
                        &quot;قام الفريق بأكمله بتسليم مشروع ذي جودة استثنائية
                        مع الالتزام بالجدول الزمني وفي حدود الميزانية. أكثر مما
                        أتوقع. أنا راضٍ حقًا وأوصي به!.”
                      </div>
                      <div className="author">
                        <div className="au-img">
                          <img
                            src="/home1/assets/img/team/team1.jpg"
                            alt=""
                            className="img-cover"
                          />
                        </div>
                        <div className="au-inf">
                          <h6 className="text-capitalize mb-2 fsz-16 fw-bold">
                            محمد صلاح
                          </h6>
                          <p className="text-capitalize fsz-14 color-666">
                            مشروع فيلا داش الخاصة للمستثمر
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="swiper-slide">
                    <div className="clients-card">
                      <div className="text fsz-45 fw-600 lh-2 js-splittext-lines">
                        &quot;قام الفريق بأكمله بتسليم مشروع ذي جودة استثنائية
                        مع الالتزام بالجدول الزمني وفي حدود الميزانية. أكثر مما
                        أتوقع. أنا راضٍ حقًا وأوصي به!.”
                      </div>
                      <div className="author">
                        <div className="au-img">
                          <img
                            src="/home1/assets/img/team/team1.jpg"
                            alt=""
                            className="img-cover"
                          />
                        </div>
                        <div className="au-inf">
                          <h6 className="text-capitalize mb-2 fsz-16 fw-bold">
                            على خالد
                          </h6>
                          <p className="text-capitalize fsz-14 color-666">
                            مشروع فيلا داش الخاصة للمستثمر
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="swiper-slide">
                    <div className="clients-card">
                      <div className="text fsz-45 fw-600 lh-2 js-splittext-lines">
                        &quot;قام الفريق بأكمله بتسليم مشروع ذي جودة استثنائية
                        مع الالتزام بالجدول الزمني وفي حدود الميزانية. أكثر مما
                        أتوقع. أنا راضٍ حقًا وأوصي به!.”
                      </div>
                      <div className="author">
                        <div className="au-img">
                          <img
                            src="/home1/assets/img/team/team1.jpg"
                            alt=""
                            className="img-cover"
                          />
                        </div>
                        <div className="au-inf">
                          <h6 className="text-capitalize mb-2 fsz-16 fw-bold">
                            غسان العلى
                          </h6>
                          <p className="text-capitalize fsz-14 color-666">
                            مشروع فيلا داش الخاصة للمستثمر
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="slider-controls">
                  <div className="swiper-button-prev"></div>
                  <div className="swiper-pagination"></div>
                  <div className="swiper-button-next"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="marq-slider">
        <div className="swiper-wrapper">
          <div className="swiper-slide">
            <a href="#"> أبداع </a>
          </div>
          <div className="swiper-slide">
            <a href="#"> مرونة </a>
          </div>
          <div className="swiper-slide">
            <a href="#"> تفان </a>
          </div>
        </div>
      </div>
      <img src="/home1/assets/img/c_line3.png" alt="" className="c-line" />
    </section>
  );
}

export default Testimonials;
