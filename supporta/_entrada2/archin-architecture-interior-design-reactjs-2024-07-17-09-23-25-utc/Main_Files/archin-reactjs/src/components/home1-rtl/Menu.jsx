import React from 'react';

function Menu() {
  return (
    <>
      <div className="side_menu4_overlay"></div>
      <div className="side_menu4_overlay2"></div>
      <div className="side_menu_style4">
        <div className="content">
          <div className="main_links">
            <ul>
              <li>
                <a href="#" className="main_link">
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="#" className="main_link">
                  ستوديو
                </a>
              </li>
              <li>
                <a href="#" className="main_link">
                  المشاريع
                </a>
              </li>
              <li>
                <a href="#" className="main_link">
                  المدونة
                </a>
              </li>
              <li>
                <a href="#" className="main_link">
                  تواصل معنا
                </a>
              </li>
            </ul>
          </div>
        </div>
        <img
          src="/home1/assets/img/chat_pat2.png"
          alt=""
          className="side_shape"
        />
        <img
          src="/home1/assets/img/chat_pat2.png"
          alt=""
          className="side_shape2"
        />
        <span className="clss">
          <i className="la  la-times"></i>
        </span>
      </div>
    </>
  );
}

export default Menu;
