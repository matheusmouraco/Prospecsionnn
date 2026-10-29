import React from 'react';
import Loader from '../../components/common/Loader';
import Footer from '../../components/innerpage/Footer';
import Menu from '../../components/innerpage/Menu';
import Navbar2 from '../../components/innerpage/Navbar2';
import Header from '../../components/innerpage/blog/Header';
import Slider from '../../components/innerpage/blog/Slider';
import LatestPosts from '../../components/innerpage/blog/LatestPosts';
import FilterPosts from '../../components/innerpage/blog/FilterPosts';
import StartButton from '../../components/home5_residence/StartButton';
import { Helmet } from 'react-helmet';

function BlogPage() {
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
        <script src="/common/assets/js/lib/mixitup.min.js"></script>
      </Helmet>
      <body className="inner-pages-style1 blog-pg-style1">
        <Loader />
        <Menu />
        <div className="smooth-scroll-content" id="scrollsmoother-container">
          <Navbar2 />
          <Header />
          <main>
            <Slider />
            <LatestPosts />
            <FilterPosts />
          </main>
          <Footer />
        </div>
        <StartButton />
      </body>
    </>
  );
}

export default BlogPage;
