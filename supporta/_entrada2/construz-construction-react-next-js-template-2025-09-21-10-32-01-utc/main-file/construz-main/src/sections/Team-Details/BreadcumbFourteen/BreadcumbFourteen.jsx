import Link from "next/link";

const BreadcumbFourteen = () => {
    return (
        <div className="breadcumb-wrapper" style={{ backgroundImage: "url('/main-assets/img/bg/breadcrumb-bg.png')" }}>
            <div className="section-animation-shape1-1 shape-mockup animation-infinite" data-top="0" style={{ backgroundImage: "url('/main-assets/img/shape/global-line-shape1.png')" }}>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="breadcumb-content">
                            <h1 className="breadcumb-title">Team Details</h1>
                            <ul className="breadcumb-menu">
                                <li><Link href="/pages/homepage/home-1"><i className="ri-home-4-fill"></i> HOME</Link></li>
                                <li><Link href="/pages/innerpage/team">TEAM</Link></li>
                                <li className="active">TEAM DETAILS </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BreadcumbFourteen;