import Image from "next/image";
import AwardWidget from "../../pages/home-2/ui/award-widget";
import { awards } from "@/data/site";
import classNames from "classnames";

export default function Award({ style }) {
    // style of award section
    const className = classNames(
        "award-section bg-sand section-padding-140",
        {}
    );

    return (
        <div className={className}>
            <div className="award-section__shape">
                <Image
                    height={354}
                    width={369}
                    src="/image/home-2/award-section-shape.png"
                    alt="shape"
                    className="h-auto"
                />
            </div>
            <div className="container">
                <div className="section-heading text-center mb-res-60">
                    <span className="subtitle">What we achieved</span>
                    <h2 className="section-heading__title heading-md">
                        We Proud of our Awards
                    </h2>
                </div>
                <div className="award-content-wrapper">
                    {awards?.map((item, i) => (
                        <AwardWidget key={i} data={item} />
                    ))}
                </div>
            </div>
        </div>
    );
}
