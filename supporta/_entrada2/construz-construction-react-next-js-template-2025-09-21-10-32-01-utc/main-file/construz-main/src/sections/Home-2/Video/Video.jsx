'use client';
import { useState } from "react";
import PopupVideo from "../../Common/PopupVideo/PopupVideo";
const Video = () => {
    const [popup, setPopup] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const openPopup = () => {
        setPopup(true);
        const iframe = document.getElementById("youtube-video");
        if (iframe) {
            iframe.src = "https://www.youtube.com/embed/Mp8IXI1kzvQ?si=UQVMsmBriHPfD6Vf";
        }
        setIsActive(true);
        document.body.style.overflow = 'hidden';
    };
    return (
        <>
            <div className="video-area-1 background-image" style={{ backgroundImage: "url('/main-assets/img/bg/video-bg1-1.png')" }} data-overlay="title" data-opacity="2">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <a onClick={openPopup} className="play-btn-wrap style2">
                                Play Video
                                <span className="play-btn style5">
                                    <i className="ri-play-fill"></i>
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <PopupVideo popup={popup} setPopup={setPopup} isActive={isActive} setIsActive={setIsActive}></PopupVideo>
        </>
    );
};

export default Video;