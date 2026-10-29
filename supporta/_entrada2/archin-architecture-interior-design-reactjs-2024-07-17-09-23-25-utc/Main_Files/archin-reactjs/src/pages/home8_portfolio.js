import React from 'react';
import SideMenu from '../components/home8_portfolio/SideMenu';
import Starting from '../components/home8_portfolio/Starting';
import About from '../components/home8_portfolio/About';
import Services from '../components/home8_portfolio/Services';
import Portfolio from '../components/home8_portfolio/Portfolio';
import Clients from '../components/home8_portfolio/Clients';
import Partners from '../components/home8_portfolio/Partners';
import Team from '../components/home8_portfolio/Team';
import Contact from '../components/home8_portfolio/Contact';
import Control from '../components/home8_portfolio/Control';
import { Helmet } from 'react-helmet';

function Home8() {
  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          type="text/css"
          href="/home8_portfolio/assets/css/home_8_style.css"
        />
        <script src="/common/assets/js/common_js.js"></script>
        <script src="/home8_portfolio/assets/js/home_8_scripts.js"></script>
      </Helmet>
      <body className="home-style8">
        <SideMenu />
        <Starting />
        <main className="fullpage-slider8">
          <div className="swiper-wrapper">
            <About />
            <Services />
            <Portfolio />
            <Clients />
            <Partners />
            <Team />
            <Contact />
          </div>
          <Control />
        </main>
      </body>
    </>
  );
}

export default Home8;
