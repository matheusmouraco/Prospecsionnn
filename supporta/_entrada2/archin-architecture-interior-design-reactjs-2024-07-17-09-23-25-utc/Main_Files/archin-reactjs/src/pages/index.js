import React from 'react';
import Loader from '../components/common/Loader';
import Navbar from '../components/home_preview/Navbar';
import Header from '../components/home_preview/Header';
import Demos from '../components/home_preview/Demos';
import DarkSection from '../components/home_preview/DarkSection';
import SaveMoney from '../components/home_preview/SaveMoney';
import Layouts from '../components/home_preview/Layouts';
import WooCommerce from '../components/home_preview/WooCommerce';
import Mobile from '../components/home_preview/Mobile';
import Features from '../components/home_preview/Features';
import DarkSection2 from '../components/home_preview/DarkSection2';
import { Helmet } from 'react-helmet';

function Home() {
  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          type="text/css"
          href="/home_preview/assets/css/home_preview_style.css"
        />
        <script src="/common/assets/js/common_js.js"></script>
        <script src="/home_preview/assets/js/home_preview_scripts.js"></script>
      </Helmet>
      <body className="home-preview">
        <Loader />
        <div className="smooth-scroll-content" id="scrollsmoother-container">
          <Navbar />
          <Header />
          <main>
            <Demos />
            <DarkSection />
            <SaveMoney />
            <Layouts />
            <WooCommerce />
            <Mobile />
            <Features />
            <DarkSection2 />
          </main>
        </div>
      </body>
    </>
  );
}

export default Home;
