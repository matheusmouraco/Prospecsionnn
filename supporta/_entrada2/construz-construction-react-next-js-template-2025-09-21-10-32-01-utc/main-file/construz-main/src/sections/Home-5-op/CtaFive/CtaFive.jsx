import Link from "next/link";

const CtaFive = () => {
    return (
        <div className="cta-area-5">
            <div className="container">
                <div className="cta-wrap5" style={{ backgroundImage: "url('/main-assets/img/bg/cta-bg5-1.png')" }}>
                    <h4 className="cta-title text-white">
                        Roofing & Restoration services that will leave your home better than before
                    </h4>
                    <Link className="btn style4" href="landing-assets/contact">Start your free quote <i className="ri-arrow-right-up-line"></i></Link>
                </div>

            </div>
        </div>
    );
};

export default CtaFive;