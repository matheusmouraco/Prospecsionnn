import React from 'react';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark tc-navbar-style10 section-padding-x">
      <div className="container-fluid content">
        <a className="navbar-brand" href="#">
          <img src="/home10/assets/img/logo.png" alt="" className="logo" />
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
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Studio
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Cases
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                News
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Contact
              </a>
            </li>
          </ul>
          <div className="nav-side">
            <a
              href="#"
              className="butn bg-white rounded-pill hover-bg-black md-butn"
            >
              <span>
                Get Quote <i className="small ms-1 ti-arrow-top-right"></i>
              </span>
            </a>
            <a
              href="#"
              className="butn border rounded-pill text-white hover-bg-white ms-3 md-butn"
            >
              <span>
                <i className="la la-globe me-1"></i> Eng
              </span>
            </a>
            <a href="#" className="menu-btn hover-bg-white ms-3 side_menu_btn">
              <span>
                <i className="la la-grip-lines"></i>
              </span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
