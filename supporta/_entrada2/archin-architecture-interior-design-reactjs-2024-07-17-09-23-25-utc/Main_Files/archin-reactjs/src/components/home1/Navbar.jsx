import React from 'react';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark tc-navbar-style1 section-padding-x">
      <div className="container-fluid content">
        <a className="navbar-brand" href="#">
          <img src="/home1/assets/img/logo.png" alt="" className="logo" />
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
            <a href="#" className="icon ms-3">
              <span> EN </span>
            </a>
            <a href="#" className="icon ms-3">
              <span> FR </span>
            </a>
            <a href="#" className="icon ms-5 fsz-21">
              <span>
                <i className="la la-search"></i>{' '}
              </span>
            </a>
            <a href="#" className="icon ms-3 side_menu_btn fsz-21">
              <span>
                <i className="la la-grip-lines"></i>{' '}
              </span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
