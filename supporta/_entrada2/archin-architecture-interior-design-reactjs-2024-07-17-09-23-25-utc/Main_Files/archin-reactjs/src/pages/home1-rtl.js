import React from 'react';
import Loader from '../components/common/Loader';
import Menu from '../components/home1-rtl/Menu';
import Navbar from '../components/home1-rtl/Navbar';
import Header from '../components/home1-rtl/Header';
import Experience from '../components/home1-rtl/Experience';
import Services from '../components/home1-rtl/Services';
import Process from '../components/home1-rtl/Process';
import Projects from '../components/home1-rtl/Projects';
import Testimonials from '../components/home1-rtl/Testimonials';
import Awards from '../components/home1-rtl/Awards';
import Team from '../components/home1-rtl/Team';
import Blog from '../components/home1-rtl/Blog';
import Chat from '../components/home1-rtl/Chat';
import { Helmet } from 'react-helmet';

function Home1RTL() {
  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          type="text/css"
          href="/home1/assets/css/home_1_style.css"
        />
        <script src="/common/assets/js/common_js.js"></script>
        <script src="/home1/assets/js/home_1_scripts.js"></script>
      </Helmet>
      <body className="home-style1">
        <Loader />
        <Menu />
        <div className="smooth-scroll-content" id="scrollsmoother-container">
          <Navbar />
          <Header />
          <main>
            <Experience />
            <Services />
            <Process />
            <Projects />
            <Testimonials />
            <Awards />
            <Team />
            <Blog />
            <Chat />
          </main>
        </div>
      </body>
    </>
  );
}

export default Home1RTL;
