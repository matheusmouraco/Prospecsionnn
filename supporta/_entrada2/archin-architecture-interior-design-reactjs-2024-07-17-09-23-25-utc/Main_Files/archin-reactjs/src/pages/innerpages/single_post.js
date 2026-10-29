import React from 'react';
import Loader from '../../components/common/Loader';
import Footer from '../../components/innerpage/Footer';
import Menu from '../../components/innerpage/Menu';
import Navbar2 from '../../components/innerpage/Navbar2';
import StartButton from '../../components/home5_residence/StartButton';
import Slider from '../../components/innerpage/single_post/Slider';
import Content from '../../components/innerpage/single_post/Content';
import Comments from '../../components/innerpage/single_post/Comments';
import { Helmet } from 'react-helmet';

function SinglePost() {
  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          type="text/css"
          href="/innerpages/assets/css/innerpages.css"
        />
        <script src="/common/assets/js/common_js.js"></script>
        <script src="/innerpages/assets/js/innerpages.js"></script>
      </Helmet>
      <body className="inner-pages-style1 post-pg-style1">
        <Loader />
        <Menu />
        <div className="smooth-scroll-content" id="scrollsmoother-container">
          <Navbar2 />
          <main>
            <Slider />
            <Content />
            <Comments />
          </main>
          <Footer />
        </div>
        <StartButton />
      </body>
    </>
  );
}

export default SinglePost;
