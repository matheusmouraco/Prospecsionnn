import React from 'react';
import Loader from '../components/common/Loader';
import StartButton from '../components/home5_residence/StartButton';
import Menu from '../components/home6_furniture/Menu';
import Navbar from '../components/home6_furniture/Navbar';
import Header from '../components/home6_furniture/Header';
import About from '../components/home6_furniture/About';
import Featured from '../components/home6_furniture/Featured';
import ByStyle from '../components/home6_furniture/ByStyle';
import Categories from '../components/home6_furniture/Categories';
import Banners from '../components/home6_furniture/Banners';
import Trade from '../components/home6_furniture/Trade';
import Blog from '../components/home6_furniture/Blog';
import Subscribe from '../components/home6_furniture/Subscribe';
import Instagram from '../components/home6_furniture/Instagram';
import Footer from '../components/home6_furniture/Footer';
import { Helmet } from 'react-helmet';

function Home6() {
  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          type="text/css"
          href="/home6_furniture/assets/css/home_6_style.css"
        />
        <script src="/common/assets/js/common_js.js"></script>
        <script src="/home6_furniture/assets/js/home_6_scripts.js"></script>
      </Helmet>
      <body className="home-style6">
        <Loader />
        <Menu />
        <div className="smooth-scroll-content" id="scrollsmoother-container">
          <Navbar />
          <Header />
          <main>
            <About />
            <Featured />
            <ByStyle />
            <Categories />
            <Banners />
            <Trade />
            <Blog />
            <Subscribe />
            <Instagram />
          </main>
          <Footer />
        </div>
        <StartButton />
      </body>
    </>
  );
}

export default Home6;
