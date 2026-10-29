import Image from "next/image";
import Link from "next/link";

export default function About() {
    return (
        <div className="about-section padding-top-140">
            <div className="container">
                <div className="about-section__wrapper border-bottom padding-bottom-140">
                    <div className="row gutter-x-40 align-items-center row align-items-center justify-content-center gutter-y-40">
                        <div
                            className="col-xl-5  col-lg-5 col-md-6 col-xs-7 col-8"
                            data-aos-duration={1000}
                            data-aos="fade-right"
                        >
                            <div className="about-image-3">
                                <Image
                                    height={214}
                                    width={210}
                                    src="/image/home-1/about-image.png"
                                    alt="structure"
                                    className="w-100 h-auto"
                                />
                            </div>
                        </div>
                        <div
                            className="offset-xl-1  col-xxl-6 col-xl-6 col-lg-7 col-md-8 col-auto"
                            data-aos-duration={1000}
                            data-aos="fade-left"
                        >
                            <div className="content-text-block-wrapper">
                                <div className="content-text-block">
                                    <span className="subtitle">
                                        about company
                                    </span>
                                    <h2 className="content-title heading-md mb-32">
                                        We design buildings and interiors,
                                        landscapes and streetscapes
                                    </h2>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit. Suspendisse varius enim
                                        in eros elementum tristique. Duis
                                        cursus, mi quis viverra ornare, eros
                                        dolor interdum nulla, ut commodo
                                    </p>
                                </div>
                                <div className="content-button-block">
                                    <Link
                                        href="/about"
                                        className="btn btn-primary hvr-fill-black"
                                    >
                                        about company
                                        <i className="fa-solid fa-arrow-right icon-arrow-corner" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
