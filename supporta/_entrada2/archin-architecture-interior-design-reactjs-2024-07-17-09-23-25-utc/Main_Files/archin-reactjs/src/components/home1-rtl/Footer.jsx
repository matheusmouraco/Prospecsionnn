import React from 'react';

function Footer() {
  return (
    <footer className="tc-footer-style1">
      <div className="container">
        <div className="top-content section-padding">
          <div className="row gx-0">
            <div className="col-lg-4">
              <div className="info-side">
                <div className="text fsz-24 color-333 lh-3 fw-600">
                  نحن نؤمن بأن الهندسة المعمارية لديها القدرة على تشكيل الحياة
                  والارتقاء بالمجتمعات. فلسفة أرشين هي شغف بالابتكار والاستدامة
                  والجماليات الخالدة
                </div>
                <div className="foot-social mt-50">
                  <a href="#">
                    <i className="fab fa-x-twitter"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-3 offset-lg-2">
              <div className="branch-card">
                <h5 className="mb-20 mt-5 mt-lg-0 fw-600"> بوسطن، MA </h5>
                <ul className="footer-links">
                  <li>
                    <a href="#">غرفة 505، 49 شارع بريمر، بوسطن، MA 02108</a>
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
                <h5 className="mb-20 mt-5 mt-lg-0 fw-600"> بوسطن، MA </h5>
                <ul className="footer-links">
                  <li>
                    <a href="#"> مهندس التصور ثلاثي الأبعاد </a>
                  </li>
                  <li>
                    <a href="#"> هندسة معمارية </a>
                  </li>
                  <li>
                    <a href="#"> مهندس التصميم المستدام </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="branch-card">
                <h5 className="mb-20 mt-5 mt-lg-0 fw-600"> بورتلاند، أو </h5>
                <ul className="footer-links">
                  <li>
                    <a href="#">2221 دكتور برودواي، بورتلاند، أو 97201</a>
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
                <h5 className="mb-20 mt-5 fw-600"> مساعدة </h5>
                <ul className="footer-links">
                  <li>
                    <a href="#"> الشروط والأحكام </a>
                  </li>
                  <li>
                    <a href="#"> سياسة الشركاء </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="foot">
          <div className="row">
            <div className="col-lg-6">
              <p className="fsz-13">© 2023 استوديو اركين. جميع الحقوق محفوظة</p>
            </div>
            <div className="col-lg-6">
              <div className="foot-links mt-4 mt-lg-0">
                <a href="#"> الرئيسية </a>
                <a href="#"> ستوديو </a>
                <a href="#"> مشاريعنا </a>
                <a href="#"> المدونة </a>
                <a href="#"> تواصل معنا </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
