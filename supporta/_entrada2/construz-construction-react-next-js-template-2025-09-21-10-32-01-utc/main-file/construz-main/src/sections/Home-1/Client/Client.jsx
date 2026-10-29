'use client';
import Link from "next/link";
import Slider from "react-slick";

const Client = () => {
    const settings = {
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        speed: 1500,
        autoplaySpeed: 5000,
        arrows: false,
        centerMode: false,
        dots: false,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };
    return (
        <>
            <div class="client-area-1 home-one-client text-center space overflow-hidden shape-mockup-wrap background-image" style={{ backgroundImage: "url('/main-assets/img/bg/client-bg1-1.png')" }} data-overlay="title" data-opacity="9">
                <div class="client_shape_1-1 shape-mockup jump-reverse" style={{ bottom: '0px', right: '-6%' }}>
                    <img src="/main-assets/img/shape/client-bg-shape1.png" alt="img" />
                </div>
                <div class="container">
                    <div class="title-area text-center">
                        <span class="sub-title text-white"><img src="/main-assets/img/icon/section-subtitle-icon.svg" alt="img" />Happy Clients</span>
                        <h2 class="sec-title text-white">Our trusted partners</h2>
                    </div>
                    <Slider {...settings} className="row global-carousel client-slider1">
                        <div class="col-lg-auto">
                            <div class="client-logo">
                                <Link href="/pages/homepage/home-1"><img src="/main-assets/img/client/client-1-1.svg" alt="img" /></Link>
                            </div>
                        </div>
                        <div class="col-lg-auto">
                            <div class="client-logo">
                                <Link href="/pages/homepage/home-1"><img src="/main-assets/img/client/client-1-2.svg" alt="img" /></Link>
                            </div>
                        </div>
                        <div class="col-lg-auto">
                            <div class="client-logo">
                                <Link href="/pages/homepage/home-1"><img src="/main-assets/img/client/client-1-3.svg" alt="img" /></Link>
                            </div>
                        </div>
                        <div class="col-lg-auto">
                            <div class="client-logo">
                                <Link href="/pages/homepage/home-1"><img src="/main-assets/img/client/client-1-4.svg" alt="img" /></Link>
                            </div>
                        </div>
                        <div class="col-lg-auto">
                            <div class="client-logo">
                                <Link href="/pages/homepage/home-1"><img src="/main-assets/img/client/client-1-5.svg" alt="img" /></Link>
                            </div>
                        </div>
                        <div class="col-lg-auto">
                            <div class="client-logo">
                                <Link href="/pages/homepage/home-1"><img src="/main-assets/img/client/client-1-1.svg" alt="img" /></Link>
                            </div>
                        </div>
                        <div class="col-lg-auto">
                            <div class="client-logo">
                                <Link href="/pages/homepage/home-1"><img src="/main-assets/img/client/client-1-2.svg" alt="img" /></Link>
                            </div>
                        </div>
                        <div class="col-lg-auto">
                            <div class="client-logo">
                                <Link href="/pages/homepage/home-1"><img src="/main-assets/img/client/client-1-3.svg" alt="img" /></Link>
                            </div>
                        </div>
                        <div class="col-lg-auto">
                            <div class="client-logo">
                                <Link href="/pages/homepage/home-1"><img src="/main-assets/img/client/client-1-4.svg" alt="img" /></Link>
                            </div>
                        </div>
                        <div class="col-lg-auto">
                            <div class="client-logo">
                                <Link href="/pages/homepage/home-1"><img src="/main-assets/img/client/client-1-5.svg" alt="img" /></Link>
                            </div>
                        </div>
                    </Slider>
                </div>
            </div>
        </>
    );
};

export default Client;