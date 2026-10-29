import React from 'react';

function Header() {
  return (
    <header className="s-header-style2">
      <div className="container">
        <div className="info">
          <div className="tags mb-50">
            <a href="#"> Architecture </a>
            <a href="#"> Landscape </a>
          </div>
          <div className="text mt-30">
            This area will is short description of project, you can <br />
            select to show or hide it
          </div>
          <h1 className="title"> Dallas Homestay Redesign </h1>
        </div>
      </div>
      <img
        src="/innerpages/assets/img/s_project2/header_bg.jpg"
        alt=""
        className="bg img-cover"
        data-speed="1.25"
      />
    </header>
  );
}

export default Header;
