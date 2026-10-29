import React from 'react';

function Header() {
  return (
    <header className="tc-header-style4">
      <div className="container">
        <div className="rotate-box" data-speed="1" data-lag="0.4">
          <a
            href="#"
            className="rotate-circle fsz-35 rotate-text d-inline-block text-uppercase"
          >
            <svg className="textcircle" viewBox="0 0 500 500">
              <defs>
                <path
                  id="textcircle"
                  d="M250,400 a150,150 0 0,1 0,-300a150,150 0 0,1 0,300Z"
                ></path>
              </defs>
              <text>
                <textPath xlinkHref="#textcircle" textLength="900">
                  {' '}
                  - years of experience - since 1991{' '}
                </textPath>
              </text>
            </svg>
          </a>
          <span className="num"> 12 </span>
        </div>
        <h1> jorger clarkson </h1>
        <span className="float_txt js-title"> Architect </span>
        <div className="info">
          <div className="row">
            <div className="col-lg-4">
              <div
                className="img mb-4 mb-lg-0 wow fadeInUp slow"
                data-wow-delay="0.2s"
              >
                <img
                  src="/home4_personal_architect/assets/img/user1.jpg"
                  alt=""
                  className="img-cover"
                />
              </div>
            </div>
            <div className="col-lg-5 wow fadeInUp slow" data-wow-delay="0.4s">
              <div className="text fsz-24 mb-30">
                I&apos;m Jorger Clarkson, an interior design architect based on
                San Francisco, CA. I&lsquo;m offers a full range of bespoke
                interior design services aimed at a discerning and sophisticated
                international clientele.
              </div>
              <div className="text fsz-24 mb-80">
                The philosophy in my projects is to create a contemporary yet
                timeless luxurious atmospher
              </div>
              <a
                href="#"
                className="fsz-14 text-uppercase text-decoration-underline"
              >
                {' '}
                full profile{' '}
              </a>
            </div>
            <div className="col-lg-2 offset-lg-1">
              <div className="social wow fadeInUp slow" data-wow-delay="0.6s">
                <p className="fsz-12 text-uppercase color-999 mb-30">
                  {' '}
                  social{' '}
                </p>
                <ul className="text-uppercase fsz-18 lh-6">
                  <li>
                    {' '}
                    <a href="#"> Instagram </a>{' '}
                  </li>
                  <li>
                    {' '}
                    <a href="#"> Linked </a>{' '}
                  </li>
                  <li>
                    {' '}
                    <a href="#"> Behance </a>{' '}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
