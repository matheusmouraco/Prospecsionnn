import React from 'react';

function SideMenu() {
  return (
    <>
      <div className="side_menu style-1" id="side_menu">
        <a href="#0" className="side_menu_cls">
          <i className="fal fa-times fs-3"></i>
        </a>
        <div className="content">
          <div className="logo">
            <a href="#" className="w-100">
              <img src="/home8_portfolio/assets/img/logo_dark.png" alt="" />
            </a>
          </div>
          <div className="pages_links">
            <ul>
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="#">
                  Home.
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  About.
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Services.
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  News.
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Contact.
                </a>
              </li>
            </ul>
          </div>
          <div className="side_foot">
            <h5> get in touch </h5>
            <div className="row">
              <div className="col-lg-6">
                <a href="#">
                  <i className="fal fa-phone me-2"></i> (+23) 5535 68 68
                </a>
              </div>
              <div className="col-lg-6">
                <a href="#">
                  <i className="fal fa-envelope me-2 mt-4 mt-lg-0"></i>
                  contact@archin.co
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="side_overlay"></div>
    </>
  );
}

export default SideMenu;
