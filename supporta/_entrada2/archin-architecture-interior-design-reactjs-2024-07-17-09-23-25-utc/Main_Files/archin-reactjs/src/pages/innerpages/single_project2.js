import React from 'react';
import Loader from '../../components/common/Loader';
import Footer from '../../components/innerpage/Footer';
import Menu from '../../components/innerpage/Menu';
import Navbar2 from '../../components/innerpage/Navbar2';
import StartButton from '../../components/home5_residence/StartButton';
import Header from '../../components/innerpage/single_project2/Header';
import MainInfo from '../../components/innerpage/single_project2/MainInfo';
import Challenge from '../../components/innerpage/single_project2/Challenge';
import Testimonials from '../../components/innerpage/single_project2/Testimonials';
import MainVideo from '../../components/innerpage/single_project2/MainVideo';
import Contact from '../../components/innerpage/single_project2/Contact';
import { Helmet } from 'react-helmet';

function SingleProject2() {
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
      <body className="inner-pages-style1 s-project-pg-style2">
        <Loader />
        <Menu />
        <div className="smooth-scroll-content" id="scrollsmoother-container">
          <Navbar2 />
          <Header />
          <main>
            <MainInfo />
            <Challenge />
            <Testimonials />
            <MainVideo />
            <Contact />
          </main>
          <Footer />
        </div>
        <StartButton />
      </body>
    </>
  );
}

export default SingleProject2;
