import React from 'react';
import Loader from '../components/common/Loader';
import Menu from '../components/home4_personal_architect/Menu';
import Navbar from '../components/home4_personal_architect/Navbar';
import Header from '../components/home4_personal_architect/Header';
import Portfolio from '../components/home4_personal_architect/Portfolio';
import Clients from '../components/home4_personal_architect/Clients';
import Career from '../components/home4_personal_architect/Career';
import Insatgram from '../components/home4_personal_architect/Insatgram';
import Footer from '../components/home4_personal_architect/Footer';
import Blog from '../components/home4_personal_architect/Blog';
import Contact from '../components/home4_personal_architect/Contact';
import { Helmet } from 'react-helmet';

function Home4() {
  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          type="text/css"
          href="/home4_personal_architect/assets/css/home_4_style.css"
        />
        <script src="/common/assets/js/common_js.js"></script>
        <script src="/home4_personal_architect/assets/js/home_4_scripts.js"></script>
      </Helmet>
      <body className="home-style4">
        <Loader />
        <Menu />
        <div className="smooth-scroll-content" id="scrollsmoother-container">
          <Navbar />
          <Header />
          <main>
            <Portfolio />
            <Clients />
            <Career />
            <Insatgram />
            <Blog />
            <Contact />
          </main>
          <Footer />
        </div>
      </body>
    </>
  );
}

export default Home4;
