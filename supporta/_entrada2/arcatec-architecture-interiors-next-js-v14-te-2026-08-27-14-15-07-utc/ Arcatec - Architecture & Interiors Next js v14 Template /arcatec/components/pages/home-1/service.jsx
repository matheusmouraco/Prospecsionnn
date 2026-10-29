import { services } from "@/data/site";
import ServiceCard from "./ui/service-card";

export default function Service() {
    return (
        <div className="service-section bg-sand section-padding-140">
            <div className="container">
                <div className="section-heading text-center">
                    <span className="subtitle">our services</span>
                    <h2 className="section-heading__title">
                        We shape the life of tomorrow
                    </h2>
                </div>
                <div className="row gutter-y-default justify-content-center justify-content-md-start">
                    {services?.map((item, i) => (
                        <div
                            key={i}
                            className="col-lg-4 col-md-6 col-sm-10"
                            data-aos="fade-up"
                            data-aos-delay={item.animation}
                        >
                            <ServiceCard data={item} />
                        </div>
                    ))}
                </div>
                <div className="section-note-text">
                    Do you have any project on your mind? Call Us:
                    <a>+123 456789</a>
                </div>
            </div>
        </div>
    );
}
