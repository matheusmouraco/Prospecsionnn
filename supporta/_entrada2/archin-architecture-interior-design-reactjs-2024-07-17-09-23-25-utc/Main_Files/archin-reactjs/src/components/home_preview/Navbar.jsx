import React from 'react';
import demos from '../../data/main-page/demos';
import pages from '../../data/main-page/innerpages';
function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark tc-navbar-preview">
      <div className="container-fluid content">
        <a className="navbar-brand" href="#">
          <img
            src="/home_preview/assets/img/logo.png"
            alt=""
            className="logo"
          />
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
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Homes
              </a>
              <ul className="dropdown-menu">
                {demos.map((item, i) => (
                  <li key={i}>
                    <a className="dropdown-item" href={item.link}>
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Pages
              </a>
              <ul className="dropdown-menu">
                {pages.map((item, i) => (
                  <li key={i}>
                    <a className="dropdown-item" href={item.link}>
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Cases
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a
                    className="dropdown-item"
                    href="../innerpages/portfolio.html"
                  >
                    page portfolio
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="../innerpages/single_project.html"
                  >
                    page single project
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="../innerpages/single_project2.html"
                  >
                    page single project 2
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                News
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="../innerpages/blog.html">
                    page blog
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="../innerpages/single_post.html"
                  >
                    page single post
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                shop
              </a>
            </li>
          </ul>
          <div className="nav-side">
            <a
              href="#"
              className="butn hover-bg-black text-capitalize bg-orange1 rounded-pill text-white"
            >
              <span> Purchase Now </span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
