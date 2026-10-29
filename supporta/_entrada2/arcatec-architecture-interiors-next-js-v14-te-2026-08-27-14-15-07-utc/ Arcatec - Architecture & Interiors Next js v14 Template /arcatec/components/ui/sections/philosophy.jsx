import { philosophyProgress } from "@/data/site";
import classNames from "classnames";

export default function Philosophy({ style }) {
    
    // style of philosophy section
    const className = classNames("content-section", {
        "padding-bottom-140": style === "home-1",
        "section-padding-140": style === "about",
    });

    return (
        <div className={className}>
            <div className="container">
                <div className="row align-items-center justify-content-center gutter-y-40">
                    <div
                        className="col-xl-5 col-lg-6 col-md-8 col-auto"
                        data-aos-duration={1000}
                        data-aos="fade-right"
                    >
                        <div className="content-text-block text-center text-lg-start">
                            <span className="subtitle">our Philosophy</span>
                            <h2 className="content-title heading-md text-black mb-32">
                                Design Studio Specialising in Private Residences
                            </h2>
                            <p>
                                Lorem ipsum dolor sit consectetur adipiscing
                                varius eros elementum tristique. Duis cursus, mi
                                quis viverra
                            </p>
                        </div>
                    </div>
                    <div className=" offset-xl-1 col-xl-6  col-lg-6 col-12">
                        <div className="progressbar-block">
                            {philosophyProgress?.map((item, i) => (
                                <div key={i} className="progressbar-single">
                                    <div className="progressbar-label">
                                        <span>{item.label}</span>
                                        <span>
                                            <span className="counter">
                                                {item.value}
                                            </span>
                                            %
                                        </span>
                                    </div>
                                    <div
                                        className="progressbar aos-init aos-animate"
                                        data-aos-duration="1000"
                                        data-aos="animate-progress"
                                    >
                                        <span
                                            className="bar"
                                            style={{ width: item.value + "%" }}
                                            data-aos-duration="1000"
                                            data-aos="fade-right"
                                        ></span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
