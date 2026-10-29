import React from 'react';
import Loader from '../components/common/Loader';
import Menu from '../components/home10/Menu';
import Navbar from '../components/home10/Navbar';
import Header from '../components/home10/Header';
import Services from '../components/home10/Services';
import About from '../components/home10/About';
import Cases from '../components/home10/Cases';
import Team from '../components/home10/Team';
import Video from '../components/home10/Video';
import Awards from '../components/home10/Awards';
import Chat from '../components/home10/Chat';
import Footer from '../components/home10/Footer';
import { Helmet } from 'react-helmet';

function Home10() {
  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          type="text/css"
          href="/home10/assets/css/home_10_style.css"
        />
        <script src="/common/assets/js/common_js.js"></script>
        <script src="/home10/assets/js/home_10_scripts.js"></script>
      </Helmet>
      <body className="home-style10">
        <Loader />
        <Menu />
        <div className="smooth-scroll-content" id="scrollsmoother-container">
          <Navbar />
          <Header />
          <main>
            <Services />
            <About />
            <Cases />
            <Team />
            <Video />
            <Awards />
            <Chat />
          </main>
          <Footer />
        </div>
      </body>
    </>
  );
}

export default Home10;
