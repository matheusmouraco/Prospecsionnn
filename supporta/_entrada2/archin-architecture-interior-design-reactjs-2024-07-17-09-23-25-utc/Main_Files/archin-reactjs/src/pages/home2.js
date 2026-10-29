import React from 'react';
import Loader from '../components/common/Loader';
import Navbar from '../components/home2/Navbar';
import Header from '../components/home2/Header';
import Services from '../components/home2/Services';
import Process from '../components/home2/Process';
import Projects from '../components/home2/Projects';
import Award from '../components/home2/Award';
import Testimonials from '../components/home2/Testimonials';
import Blog from '../components/home2/Blog';
import Contact from '../components/home2/Contact';
import Footer from '../components/home2/Footer';
import { Helmet } from 'react-helmet';

function Home2() {
  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          type="text/css"
          href="/home2/assets/css/home_2_style.css"
        />
        <script src="/common/assets/js/common_js.js"></script>
        <script src="/home2/assets/js/home_2_scripts.js"></script>
      </Helmet>
      <body className="home-style2">
        <Loader />
        <div className="smooth-scroll-content" id="scrollsmoother-container">
          <Navbar />
          <Header />
          <main>
            <Services />
            <Process />
            <Projects />
            <Award />
            <Testimonials />
            <Blog />
            <Contact />
          </main>
          <Footer />
        </div>
      </body>
    </>
  );
}

export default Home2;
