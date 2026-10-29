import React from 'react';

function MainVideo() {
  return (
    <div className="main-video">
      <video
        className="video"
        width="100%"
        height="100%"
        autoPlay=""
        muted=""
        loop=""
      >
        <source
          src="/innerpages/assets/img/s_project2/video.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
}

export default MainVideo;
