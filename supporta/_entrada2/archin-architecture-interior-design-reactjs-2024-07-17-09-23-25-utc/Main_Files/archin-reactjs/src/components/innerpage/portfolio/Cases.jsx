import React from 'react';
import data from '../../../data/innerpages/portfolio/case';
function Cases() {
  return (
    <section className="tc-featured-cases-style1">
      <div className="content">
        <h3 className="fsz-45 text-capitalize mb-60 js-splittext-lines">
          featured cases
        </h3>
        <ul
          className="nav nav-pills mb-50 wow fadeInUp slow"
          data-wow-delay="0.2s"
          id="pills-tab"
          role="tablist"
        >
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active"
              id="pills-tab1-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-tab1"
            >
              All
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="pills-tab2-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-tab2"
            >
              Architecture
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="pills-tab3-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-tab1"
            >
              Interior
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="pills-tab4-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-tab2"
            >
              Landscape
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="pills-tab5-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-tab1"
            >
              Furniture
            </button>
          </li>
        </ul>
        <div
          className="tab-content wow fadeInUp slow float_box_container"
          data-wow-delay="0.4s"
          id="pills-tabContent"
        >
          <div className="tab-pane fade show active" id="pills-tab1">
            <div className="cases-slider">
              <div className="swiper-wrapper">
                {data.case1.map((item, i) => (
                  <div key={i} className="swiper-slide">
                    <div className="case-card">
                      <a href={item.img} className="img" data-fancybox="cases">
                        <img src={item.img} alt="" className="img-cover" />
                      </a>
                      <div className="info">
                        <div className="tags mb-30">
                          <a href="#"> {item.sub1} </a>
                          <a href="#"> {item.sub2} </a>
                        </div>
                        <h3 className="title fsz-35 mb-20">
                          <a href="#" className="hover-orange1">
                            {item.title}
                          </a>
                        </h3>
                        <div className="text color-666">
                          {item.desc.split('<br />')[0]} <br />{' '}
                          {item.desc.split('<br />')[2]}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="tab-pane fade" id="pills-tab2">
            <div className="cases-slider">
              <div className="swiper-wrapper">
                {data.case2.map((item, i) => (
                  <div key={i} className="swiper-slide">
                    <div className="case-card">
                      <a href={item.img} className="img" data-fancybox="cases">
                        <img src={item.img} alt="" className="img-cover" />
                      </a>
                      <div className="info">
                        <div className="tags mb-30">
                          <a href="#"> {item.sub1} </a>
                          <a href="#"> {item.sub2} </a>
                        </div>
                        <h3 className="title fsz-35 mb-20">
                          <a href="#" className="hover-orange1">
                            {item.title}
                          </a>
                        </h3>
                        <div className="text color-666">
                          {item.desc.split('<br />')[0]} <br />{' '}
                          {item.desc.split('<br />')[2]}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="float-cursor float_box">
            Hold <br /> and Drag
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cases;
