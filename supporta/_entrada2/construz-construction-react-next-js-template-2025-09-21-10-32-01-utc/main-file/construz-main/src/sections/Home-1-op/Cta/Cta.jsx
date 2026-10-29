const Cta = () => {
  return (
    <div className="cta-area-1">
      <div className="container">
        <div className="row gx-0 align-items-center">
          <div className="col-lg-7">
            <div className="cta-wrap-1 position-relative">
              <div
                className="section-animation-shape1-1 shape-mockup animation-infinite"
                data-top="0"
                data-left="0"
                style={{
                  backgroundImage: "url('/main-assets/img/shape/global-line-shape1.png')",
                }}
              ></div>
              <div className="title-area mb-40 text-md-start text-center">
                <span className="sub-title">
                  <img src="/main-assets/img/icon/section-subtitle-icon.svg" alt="img" />
                  GET FREE QUOTE
                </span>
                <h3 className="sec-title">Have a project in mind?</h3>
              </div>
              <form
                action="mail.php"
                method="POST"
                className="cta-contact-form ajax-contact"
              >
                <div className="row gy-15">
                  <div className="col-12">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        id="name"
                        placeholder="Full Name"
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        id="email"
                        placeholder="Email Address"
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <select
                        name="subject"
                        id="subject"
                        className="single-select nice-select form-select"
                      >
                        <option value="" disabled selected hidden>
                          Your Inquiry
                        </option>
                        <option value="Web Design">Web Design</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Engine Diagnostics">
                          Engine Diagnostics
                        </option>
                        <option value="Digital Marketing">
                          Digital Marketing
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="form-btn col-12">
                    <button type="submit" className="btn w-100">
                      SUBMIT NOW<i className="ri-arrow-right-up-line"></i>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="cta-thumb1-1">
              <img src="/main-assets/img/normal/cta-thumb1-1.png" alt="img" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cta;
