import React from 'react';
import Loader from '../components/common/Loader';
import StartButton from '../components/home5_residence/StartButton';
import Menu from '../components/home5_residence/Menu';
import Navbar from '../components/home5_residence/Navbar';
import Header from '../components/home5_residence/Header';
import About from '../components/home5_residence/About';
import Flawless from '../components/home5_residence/Flawless';
import Location from '../components/home5_residence/Location';
import Apartments from '../components/home5_residence/Apartments';
import Testimonials from '../components/home5_residence/Testimonials';
import Services from '../components/home5_residence/Services';
import Blog from '../components/home5_residence/Blog';
import Footer from '../components/home5_residence/Footer';
import { Helmet } from 'react-helmet';

function Home5() {
  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          type="text/css"
          href="/home5_residence/assets/css/home_5_style.css"
        />
        <script src="/common/assets/js/common_js.js"></script>
        <script src="/home5_residence/assets/js/home_5_scripts.js"></script>
      </Helmet>
      <body className="home-style5">
        <Loader />
        <Menu />
        <div className="smooth-scroll-content" id="scrollsmoother-container">
          <Navbar />
          <Header />
          <main>
            <About />
            <Flawless />
            <Location />
            <Apartments />
            <Testimonials />
            <Services />
            <Blog />
          </main>
          <Footer />
        </div>
        <StartButton />
      </body>
    </>
  );
}

export default Home5;
