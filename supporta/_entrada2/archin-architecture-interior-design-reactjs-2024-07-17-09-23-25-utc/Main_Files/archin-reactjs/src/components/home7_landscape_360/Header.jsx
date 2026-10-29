'use client';
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import PANOLENS
// const PANOLENS = dynamic(
//   () => {
//     return import('panolens');
//   },
//   { ssr: false } // This line is important. It disables server-side rendering for this module.
// );

function Header() {
  return (
    <header className="tc-header-style7">
      <div className="container">
        <h1> Creating Timeless Landscapes </h1>
        <div className="head-features">
          <p> Sustainable Solutions </p>
          <p> Competitive & Flexiable Price </p>
          <p> Innovative & Inspiring Designers </p>
        </div>
      </div>

      {/* <div id="img_360"></div> */}
    </header>
  );
}

export default Header;
