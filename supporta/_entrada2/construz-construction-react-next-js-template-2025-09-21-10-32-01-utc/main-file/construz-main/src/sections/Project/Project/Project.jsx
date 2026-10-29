'use client';

import { useState, useEffect } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

const images = [
    "/main-assets/img/project/project2_1.png",
    "/main-assets/img/project/project2_2.png",
    "/main-assets/img/project/project2_3.png",
    "/main-assets/img/project/project2_4.png",
    "/main-assets/img/project/project2_5.png",
    "/main-assets/img/project/project2_6.png",
    "/main-assets/img/project/project2_7.png",
    "/main-assets/img/project/project2_8.png",
    "/main-assets/img/project/project2_9.png"
];

const Project = () => {
    const [photoIndex, setPhotoIndex] = useState(-1); // Set initial index to -1

    const handleOpen = (index) => {
        setPhotoIndex(index);
    };

    useEffect(() => {
        if (photoIndex >= 0) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [photoIndex]);

    return (
        <section className="project-page space-top space-extra-bottom">
            <div className="container">
                <div className="row gy-40 justify-content-center">
                    {images.map((src, index) => (
                        <div className="col-md-6 col-lg-4" key={index}>
                            <div className="portfolio-card style2">
                                <div className="portfolio-card-thumb">
                                    <img src={src} alt={`img ${index + 1}`} />
                                    <span className="portfolio-card-number">0{index + 1}</span>
                                    <button className="icon-btn popup-image" onClick={() => handleOpen(index)}>
                                        <i className="ri-eye-line"></i>
                                    </button>
                                </div>
                                <div className="portfolio-card-details">
                                    <span className="portfolio-card-subtitle">Category</span>
                                    <h4 className="portfolio-card-title">
                                        <a href="/pages/innerpage/project-details">Project Title</a>
                                    </h4>
                                    <p className="portofolio-card-text">Building since 09,01,2024</p>
                                    <a href="/pages/innerpage/project-details" className="btn-with-icon">
                                        VIEW DETAILS
                                        <span className="btn-icon">
                                            <i className="ri-arrow-right-up-line"></i>
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="pagination justify-content-center">
                    <ul>
                        <li><a className="active" href="/pages/innerpage/blog">01</a></li>
                        <li><a href="/pages/innerpage/blog">02</a></li>
                        <li><a href="/pages/innerpage/blog">03</a></li>
                        <li><a href="/pages/innerpage/blog"><i className="ri-arrow-right-line"></i></a></li>
                    </ul>
                </div>
            </div>
            {photoIndex >= 0 && (
                <Lightbox
                    mainSrc={images[photoIndex]}
                    nextSrc={images[(photoIndex + 1) % images.length]}
                    prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                    onCloseRequest={() => setPhotoIndex(-1)}
                    onMovePrevRequest={() =>
                        setPhotoIndex((photoIndex + images.length - 1) % images.length)
                    }
                    onMoveNextRequest={() =>
                        setPhotoIndex((photoIndex + 1) % images.length)
                    }
                />
            )}
        </section>
    );
};

export default Project;
