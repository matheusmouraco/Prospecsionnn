import Link from "next/link";

const Video = () => {
  return (
    <div
      className="video-area-1"
      data-overlay="title"
      data-opacity="2"
      style={{ backgroundImage: "url('/main-assets/img/bg/video-bg1-1.png')" }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <Link
              href="https://www.youtube.com/watch?v=Mp8IXI1kzvQ"
              className="popup-video play-btn-wrap style2"
            >
              Play Video
              <span className="play-btn style5">
                <i className="ri-play-fill"></i>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
