import React from 'react';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg tc-navbar-style4 navbar-light">
      <div className="container-fluid d-flex d-lg-none">
        <a href="#" className="logo">
          <img src="/home4_personal_architect/assets/img/logo.png" alt="" />
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
        <div className="col-lg-5">
          <div className="logo-side">
            <a href="#" className="logo">
              <img src="/home4_personal_architect/assets/img/logo.png" alt="" />
            </a>
            <ul className="links">
              <li>
                <a href="#"> All Works </a>
              </li>
              <li>
                <a href="#"> About </a>
              </li>
              <li>
                <a href="#"> Contact </a>
              </li>
            </ul>
            <ul className="links">
              <li>
                <a href="#"> hello@jorgerclarkson.com </a>
              </li>
              <li>
                <a href="#"> (+068) 5681 96 96 </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="nav-side text-lg-end mt-4 mt-lg-0">
            <a href="#">
              <i className="la la-envelope me-2 fs-5"></i>
              <span> Get Quote </span>
            </a>
            <a href="#" className="side_menu_btn ms-50">
              <i className="la la-grip-lines fs-5"></i>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
