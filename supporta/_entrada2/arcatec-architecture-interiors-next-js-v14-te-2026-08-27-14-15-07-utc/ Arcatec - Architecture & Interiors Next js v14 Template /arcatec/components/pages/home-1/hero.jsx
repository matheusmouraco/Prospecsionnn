import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="hero-section-01 bg-black">
            <div className="container">
                <div className="row row--hero-content">
                    <div className="col-xxl-auto ">
                        <div className="hero-content mb-140">
                            <h1 className="hero-content__title heading-xl text-sand">
                                CREATING ARCHITECTURE THAT REFLECTS YOUR VISION
                            </h1>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Suspendisse varius enim in eros
                                elementum tristique. Duis cursus, mi quis
                                viverra ornare, eros dolor interdum nulla, ut
                                commodo diam libero vitae erat.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-auto">
                    <div className="hero-content__image">
                        <Image
                            height={640}
                            width={1504}
                            src="/image/home-1/hero-image.png"
                            alt="hero image"
                            className="w-100 h-auto"
                        />
                        <div className="hero-content__navigation-circle-wrapper">
                            <div className="hero-content__navigation-circle">
                                <Image
                                    height={258}
                                    width={258}
                                    src="/image/home-1/navigation-image.png"
                                    alt="icon"
                                    className="w-100 h-auto"
                                />
                                <Link
                                    href="/contact"
                                    className="hero-content__navigation-circle-text d-block"
                                >
                                    <Image
                                        height={258}
                                        width={258}
                                        src="/image/home-1/text-circle.png"
                                        alt="text circle"
                                        className="w-100 h-auto"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
