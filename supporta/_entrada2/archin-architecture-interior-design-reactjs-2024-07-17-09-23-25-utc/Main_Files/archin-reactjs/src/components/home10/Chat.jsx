import React from 'react';

function Chat() {
  return (
    <section className="tc-chat-style10 section-padding-x">
      <div className="container-fluid">
        <div className="content section-padding border-top borderd">
          <h5 className="color-666 mb-50"> Get a free consultation? </h5>
          <a
            href="#"
            className="xl-text js-title"
            data-speed="1"
            data-lag="0.7"
          >
            let’s chat!
          </a>
        </div>
      </div>
      <img
        src="/home10/assets/img/chat_pat.png"
        alt=""
        className="pattern wow zoomIn"
      />
    </section>
  );
}

export default Chat;
