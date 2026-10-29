import React from 'react';
import data from '../../data/home5_residence/apartments';
function Apartments() {
  return (
    <section className="tc-apartments-style5">
      <div className="container">
        <h2 className="fsz-70 text-uppercase fw-400 text-center mb-70 js-splittext-lines">
          <span className="color-brown1"> select </span> apartments
        </h2>
        <div className="apartments-accordion">
          <div
            className="accordion-title d-none d-lg-block wow fadeInUp slow"
            data-wow-delay="0.2s"
          >
            <div className="row gx-0">
              <div className="col-lg-2">
                <p className="title-txt"> room </p>
              </div>
              <div className="col-lg-2">
                <p className="title-txt"> plan </p>
              </div>
              <div className="col-lg-3">
                <p className="title-txt"> infomation </p>
              </div>
              <div className="col-lg-2">
                <p className="title-txt"> features </p>
              </div>
              <div className="col-lg-3">
                <p className="title-txt"> price </p>
              </div>
            </div>
          </div>
          <div className="accordion" id="accordionExample">
            {data.map((item, i) => (
              <div
                key={i}
                className="accordion-item wow fadeInUp slow"
                data-wow-delay="0.2s"
              >
                <div className="accordion-header">
                  <div
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${item.id}`}
                  >
                    <div className="row gx-0">
                      <div className="col-lg-2">
                        <h2 className="room-numb"> {item.room} </h2>
                      </div>
                      <div className="col-lg-2">
                        <div className="room-img">
                          <img src={item.roomImg} alt="" className="" />
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="room-info">
                          <h6 className="fsz-24 mb-15"> {item.distance} </h6>
                          <ul>
                            {item.parts.map((part, i) => (
                              <li key={i}> {part} </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="col-lg-2">
                        <div className="feat-icons">
                          <a
                            href="#"
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            data-bs-custom-classname="custom-tooltip"
                            data-bs-title="Basic Interior finishing"
                          >
                            <i className="fat fa-paint-roller"></i>
                          </a>
                          <a href="#">
                            <i className="fat fa-eye"></i>
                          </a>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <p className="price fsz-24"> {item.price} </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  id={item.id}
                  className="accordion-collapse collapse show"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    <div className="row gx-0">
                      <div className="col-lg-8">
                        <div className="row align-items-end">
                          <div className="col-2">
                            <div className="floor-img">
                              <img src={item.apartImg} alt="" />
                            </div>
                          </div>
                          <div className="col-lg-8">
                            <div className="main-img">
                              <img src={item.planImg} alt="" />
                              <div className="text-items">
                                {item.descriptions.map((item, i) => (
                                  <p key={i}> {item} </p>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="col-2">
                            <div className="dial-img">
                              <img src={item.dialImg} alt="" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="info ps-lg-5 justify-content-lg-center">
                          <div className="cont">
                            <p>
                              guaranteed by <br /> {item.owner}
                            </p>
                            <small> MORTGAGE FROM </small>
                            <h2> {item.persent} </h2>
                          </div>
                          <div className="btns">
                            <a href="#" className="pdf-btn">
                              <span>
                                pdf <i className="fat fa-download"></i>
                              </span>
                            </a>
                            <a
                              href="#"
                              className="butn border rounded-pill border-brown1 hover-bg-brown1 text-uppercase color-brown1"
                            >
                              <span> schedule a visit </span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div
            className="text-center mt-150 wow zoomIn slow"
            data-wow-delay="0.2s"
          >
            <a
              href="#"
              className="butn border rounded-pill border-brown1 hover-bg-brown1 text-uppercase color-brown1"
            >
              <span> see all apartments </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Apartments;
