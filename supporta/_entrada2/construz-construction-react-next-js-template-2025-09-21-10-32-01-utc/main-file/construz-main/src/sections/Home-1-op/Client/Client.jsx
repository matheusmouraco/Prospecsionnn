import Link from "next/link";

const Client = () => {
  return (
    <div
      className="client-area-1 text-center space overflow-hidden"
      data-overlay="title"
      data-opacity="9"
      style={{ backgroundImage: "url('/main-assets/img/bg/client-bg1-1.png')" }}
    >
      <div
        className="client_shape_1-1 shape-mockup jump-reverse"
        data-bottom="0%"
        data-right="-6%"
      >
        <img src="/main-assets/img/shape/client-bg-shape1.png" alt="img" />
      </div>
      <div className="container">
        <div className="title-area text-center">
          <span className="sub-title text-white">
            <img src="/main-assets/img/icon/section-subtitle-icon.svg" alt="img" />
            Happy Clients
          </span>
          <h2 className="sec-title text-white">Our trusted partners</h2>
        </div>
        <div
          className="row global-carousel client-slider1"
          data-slide-show="5"
          data-lg-slide-show="4"
          data-md-slide-show="3"
          data-sm-slide-show="2"
        >
          <div className="col-lg-auto">
            <div className="client-logo">
              <Link href="/pages/homepage/home-1">
                <img src="/main-assets/img/client/client-1-1.svg" alt="img" />
              </Link>
            </div>
          </div>
          <div className="col-lg-auto">
            <div className="client-logo">
              <Link href="/pages/homepage/home-1">
                <img src="/main-assets/img/client/client-1-2.svg" alt="img" />
              </Link>
            </div>
          </div>
          <div className="col-lg-auto">
            <div className="client-logo">
              <Link href="/pages/homepage/home-1">
                <img src="/main-assets/img/client/client-1-3.svg" alt="img" />
              </Link>
            </div>
          </div>
          <div className="col-lg-auto">
            <div className="client-logo">
              <Link href="/pages/homepage/home-1">
                <img src="/main-assets/img/client/client-1-4.svg" alt="img" />
              </Link>
            </div>
          </div>
          <div className="col-lg-auto">
            <div className="client-logo">
              <Link href="/pages/homepage/home-1">
                <img src="/main-assets/img/client/client-1-5.svg" alt="img" />
              </Link>
            </div>
          </div>
          <div className="col-lg-auto">
            <div className="client-logo">
              <Link href="/pages/homepage/home-1">
                <img src="/main-assets/img/client/client-1-1.svg" alt="img" />
              </Link>
            </div>
          </div>
          <div className="col-lg-auto">
            <div className="client-logo">
              <Link href="/pages/homepage/home-1">
                <img src="/main-assets/img/client/client-1-2.svg" alt="img" />
              </Link>
            </div>
          </div>
          <div className="col-lg-auto">
            <div className="client-logo">
              <Link href="/pages/homepage/home-1">
                <img src="/main-assets/img/client/client-1-3.svg" alt="img" />
              </Link>
            </div>
          </div>
          <div className="col-lg-auto">
            <div className="client-logo">
              <Link href="/pages/homepage/home-1">
                <img src="/main-assets/img/client/client-1-4.svg" alt="img" />
              </Link>
            </div>
          </div>
          <div className="col-lg-auto">
            <div className="client-logo">
              <Link href="/pages/homepage/home-1">
                <img src="/main-assets/img/client/client-1-5.svg" alt="img" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Client;
