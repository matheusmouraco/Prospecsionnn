import React from 'react';
import data from '../../data/main-page/save';

function SaveMoney() {
  return (
    <section className="tc-save-money">
      <div className="container">
        <div className="title text-center mb-40 js-splittext-lines">
          <h2 className="fsz-45 fw-600 mb-30"> Save Your Money </h2>
          <div className="text fsz-16 mb-60 color-666">
            Archin compatible with popular Html plugins, help you save more
            money
          </div>
        </div>
        <div className="cards">
          <div className="row justify-content-around">
            {data.map((item, i) => (
              <div key={i} className="col-lg-2">
                <div
                  className="item text-center mt-40 wow fadeInUp slow"
                  data-wow-delay={item.delay}
                >
                  <div className="icon-80 mb-30 mx-auto">
                    <img src={item.img} alt="" />
                  </div>
                  <h5 className="fsz-20 mb-10 fw-600">{item.title} </h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SaveMoney;
