import React from 'react';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg tc-navbar-style7 navbar-light">
      <div className="container-fluid d-flex d-lg-none">
        <a href="#" className="logo">
          <img src="/home7_landscape/assets/img/logo.png" alt="" />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mt-4 mt-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">
                All Works
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                About
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Contact
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Get Quote
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                hello@jorgerclarkson.com
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                (+068) 5681 96 96
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-fluid align-items-start d-none d-lg-flex">
        <div className="col-lg-6">
          <div className="logo-side">
            <a href="#" className="logo">
              <img src="/home7_landscape/assets/img/logo.png" alt="" />
            </a>
            <ul className="links">
              <li>
                <a href="#"> All Projects </a>
              </li>
              <li>
                <a href="#"> Our Studio </a>
              </li>
              <li>
                <a href="#"> News </a>
              </li>
              <li>
                <a href="#"> Contact </a>
              </li>
            </ul>
            <ul className="links">
              <li>
                <a href="#"> hello@archingarden.com </a>
              </li>
              <li>
                <a href="#"> (+068) 5681 96 96 </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="nav-side mt-4 mt-lg-0 justify-content-lg-end">
            <a
              href="#"
              className="butn border hover-bg-black text-uppercase bg-green1 text-white rounded-pill me-lg-5"
            >
              <span> Get Free Quote </span>
            </a>
            <div className="social-links">
              <a href="#">
                <i className="fab fa-x-twitter"></i>
              </a>
              <a href="#">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#">
                <i className="fab fa-tiktok"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
