import React from 'react';

function Services() {
  return (
    <section className="tc-services-style1">
      <div className="content section-padding section-padding-x">
        <div className="container">
          <div className="title mb-80 text-center">
            <p className="color-666 text-uppercase wow"> خدماتنا </p>
          </div>
          <div className="services">
            <div className="row">
              <div className="col-lg-3">
                <a
                  href="#"
                  className="service-card wow fadeInUp"
                  data-wow-delay="0.2s"
                >
                  <div className="icon">
                    <i className="la la-hard-hat"></i>
                  </div>
                  <h5 className="fsz-24 mb-20"> الهندسة المعمارية والبناء </h5>
                  <div className="img">
                    <img
                      src="/home1/assets/img/services/ser1.jpg"
                      alt=""
                      className="img-cover"
                    />
                  </div>
                  <div className="text color-666 mt-50">
                    التخطيط، التصور ثلاثي الأبعاد، تصميم المناظر الطبيعية، الرسم
                    الهيكلي، الصور الحاسوبية، الإشراف على البناء
                  </div>
                  <span className="arrow">
                    <i className="ti-arrow-top-right"></i>
                  </span>
                </a>
              </div>
              <div className="col-lg-3">
                <a
                  href="#"
                  className="service-card mt-150 wow fadeInUp"
                  data-wow-delay="0.4s"
                >
                  <div className="icon">
                    <i className="la la-bezier-curve"></i>
                  </div>
                  <h5 className="fsz-24 mb-20"> التصميم الداخلي والخارجي </h5>
                  <div className="img">
                    <img
                      src="/home1/assets/img/services/ser2.jpg"
                      alt=""
                      className="img-cover"
                    />
                  </div>
                  <div className="text color-666 mt-50">
                    التصميم الداخلي، التصميم الخارجي، التجديد، التصميم المستدام،
                    التركيب، نظام السباكة، تجربة ثلاثية الأبعاد
                  </div>
                  <span className="arrow">
                    <i className="ti-arrow-top-right"></i>
                  </span>
                </a>
              </div>
              <div className="col-lg-3">
                <a
                  href="#"
                  className="service-card wow fadeInUp"
                  data-wow-delay="0.6s"
                >
                  <div className="icon">
                    <i className="la la-bed"></i>
                  </div>
                  <h5 className="fsz-24 mb-20"> إنتاج الأثاث </h5>
                  <div className="img">
                    <img
                      src="/home1/assets/img/services/ser3.jpg"
                      alt=""
                      className="img-cover"
                    />
                  </div>
                  <div className="text color-666 mt-50">
                    الأثاث حسب الطلب، توريد المواد، المتجر الإلكتروني، التوزيع،
                    النمذجة ثلاثية الأبعاد
                  </div>
                  <span className="arrow">
                    <i className="ti-arrow-top-right"></i>
                  </span>
                </a>
              </div>
              <div className="col-lg-3">
                <a
                  href="#"
                  className="service-card mt-150 wow fadeInUp"
                  data-wow-delay="0.8s"
                >
                  <div className="icon">
                    <i className="la la-comments"></i>
                  </div>
                  <h5 className="fsz-24 mb-20"> استشارات ومشرف المشروع </h5>
                  <div className="img">
                    <img
                      src="/home1/assets/img/services/ser4.jpg"
                      alt=""
                      className="img-cover"
                    />
                  </div>
                  <div className="text color-666 mt-50">
                    تحليل المشروع، توثيق العطاءات، مشرف البناء
                  </div>
                  <span className="arrow">
                    <i className="ti-arrow-top-right"></i>
                  </span>
                </a>
              </div>
            </div>
          </div>
          <div className="text-center">
            <a
              href="#"
              className="butn rounded-pill mt-80 hover-bg-black bg-orange1 text-white"
            >
              <span>
                احصل على عرض أسعار الآن
                <i className="small ms-1 ti-arrow-top-right"></i>
              </span>
            </a>
          </div>
        </div>
      </div>
      <div className="ser-img">
        <img src="/home1/assets/img/services/ser.jpg" alt="" />
      </div>
    </section>
  );
}

export default Services;
