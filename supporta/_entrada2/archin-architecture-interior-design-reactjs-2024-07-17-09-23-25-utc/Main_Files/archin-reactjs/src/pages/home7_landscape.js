import React from 'react';
import Loader from '../components/common/Loader';
import StartButton from '../components/home5_residence/StartButton';
import Navbar from '../components/home7_landscape/Navbar';
import Header from '../components/home7_landscape/Header';
import About from '../components/home7_landscape/About';
import Services from '../components/home7_landscape/Services';
import Project from '../components/home7_landscape/Project';
import Process from '../components/home7_landscape/Process';
import Testimonials from '../components/home7_landscape/Testimonials';
import Blog from '../components/home7_landscape/Blog';
import Footer from '../components/home7_landscape/Footer';
import { Helmet } from 'react-helmet';

function Home7() {
  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          type="text/css"
          href="/home7_landscape/assets/css/home_7_style.css"
        />
        <script src="/common/assets/js/common_js.js"></script>
        <script src="/home7_landscape/assets/js/home_7_scripts.js"></script>
      </Helmet>
      <body className="home-style7">
        <Loader />
        <div className="smooth-scroll-content" id="scrollsmoother-container">
          <Navbar />
          <Header />
          <main>
            <About />
            <Services />
            <Project />
            <Process />
            <Testimonials />
            <Blog />
          </main>
          <Footer />
        </div>
        <StartButton />
      </body>
    </>
  );
}

export default Home7;
