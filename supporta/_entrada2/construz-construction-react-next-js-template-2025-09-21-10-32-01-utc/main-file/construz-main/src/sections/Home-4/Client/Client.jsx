import Link from "next/link";

const Client = () => {
    return (
        <div className="client-area-4 bg-smoke" style={{ backgroundImage: "url('/main-assets/img/bg/client-bg4-1.png')" }}>
            <div className="container">
                <div className="row global-carousel client-slider2 space text-center" data-slide-show="5" data-lg-slide-show="4" data-md-slide-show="3" data-sm-slide-show="2">
                    <div className="col-lg-auto">
                        <div className="client-logo">
                            <Link href="/pages/homepage/home-1"><img src="/main-assets/img/client/client-2-1.svg" alt="img" /></Link>
                        </div>
                    </div>
                    <div className="col-lg-auto">
                        <div className="client-logo">
                            <Link href="/pages/homepage/home-1"><img src="/main-assets/img/client/client-2-2.svg" alt="img" /></Link>
                        </div>
                    </div>
                    <div className="col-lg-auto">
                        <div className="client-logo">
                            <Link href="/pages/homepage/home-1"><img src="/main-assets/img/client/client-2-3.svg" alt="img" /></Link>
                        </div>
                    </div>
                    <div className="col-lg-auto">
                        <div className="client-logo">
                            <Link href="/pages/homepage/home-1"><img src="/main-assets/img/client/client-2-4.svg" alt="img" /></Link>
                        </div>
                    </div>
                    <div className="col-lg-auto">
                        <div className="client-logo">
                            <Link href="/pages/homepage/home-1"><img src="/main-assets/img/client/client-2-5.svg" alt="img" /></Link>
                        </div>
                    </div>
                    <div className="col-lg-auto">
                        <div className="client-logo">
                            <Link href="/pages/homepage/home-1"><img src="/main-assets/img/client/client-2-1.svg" alt="img" /></Link>
                        </div>
                    </div>
                    <div className="col-lg-auto">
                        <div className="client-logo">
                            <Link href="/pages/homepage/home-1"><img src="/main-assets/img/client/client-2-2.svg" alt="img" /></Link>
                        </div>
                    </div>
                    <div className="col-lg-auto">
                        <div className="client-logo">
                            <Link href="/pages/homepage/home-1"><img src="/main-assets/img/client/client-2-3.svg" alt="img" /></Link>
                        </div>
                    </div>
                    <div className="col-lg-auto">
                        <div className="client-logo">
                            <Link href="/pages/homepage/home-1"><img src="/main-assets/img/client/client-2-4.svg" alt="img" /></Link>
                        </div>
                    </div>
                    <div className="col-lg-auto">
                        <div className="client-logo">
                            <Link href="/pages/homepage/home-1"><img src="/main-assets/img/client/client-2-5.svg" alt="img" /></Link>
                        </div>
                    </div>
                </div>

                <div className="subscribe-area-4" style={{ backgroundImage: "url('/main-assets/img/bg/subscribe-bg4-1.png')" }}>
                    <div className="subscribe-thumb4-1">
                        <img src="/main-assets/img/normal/subscribe_4-1.png" alt="img" />
                    </div>
                    <div className="subscribe-box">
                        <h4 className="subscribe-box_title">Sign up to get the latest updates!</h4>
                        <form className="newsletter-form">
                            <input className="form-control" type="email" placeholder="Enter Your Email..." required="" />
                            <button type="submit" className="btn style3">SUBCRIBE<i className="ri-arrow-right-up-line"></i></button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Client;