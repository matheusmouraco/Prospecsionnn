'use client';
import mixitup from 'mixitup';
import data from '../../../data/innerpages/blog/filter';
import React, { useEffect, useRef, useState } from 'react';
function FilterPosts() {
  const [activeFilter, setActiveFilter] = useState('All');
  const mixitupContainerRef = useRef(null);

  useEffect(() => {
    const initializeMixitup = () => {
      mixitup(mixitupContainerRef.current, {
        load: {
          sort: 'order:asc',
        },
        animation: {
          duration: 700,
        },
        classNames: {
          block: 'filter',
          elementFilter: 'filter-btn',
          elementSort: 'sort-btn',
        },
        selectors: {
          target: '.mix-item',
        },
      });
    };

    initializeMixitup();
  }, []);
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);

    // Remove 'active' class from all filter buttons
    document.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.classList.remove('active');
    });

    // Add 'active' class to the clicked filter button, if it exists
    const clickedButton = document.querySelector(`[data-filter="${filter}"]`);
    if (clickedButton) {
      clickedButton.classList.add('active');
    }
  };

  return (
    <section className="tc-filter-posts-style1">
      <div className="container">
        <div className="filter-row wow fadeInUp slow" data-wow-delay="0.2s">
          <div className="row align-items-center">
            <div className="col-lg-9">
              <div className="filter">
                <div className="links">
                  <a
                    onClick={() => handleFilterClick('All')}
                    href="#0"
                    className={`filter-btn ${
                      activeFilter === 'All' ? 'active' : ''
                    }`}
                    data-filter="*"
                  >
                    All
                  </a>
                  <a
                    onClick={() => handleFilterClick('news')}
                    href="#0"
                    className={`filter-btn ${
                      activeFilter === 'news' ? 'active' : ''
                    }`}
                    data-filter=".news"
                  >
                    news
                  </a>
                  <a
                    onClick={() => handleFilterClick('.Architecture')}
                    href="#0"
                    className={`filter-btn ${
                      activeFilter === 'Architecture' ? 'active' : ''
                    }`}
                    data-filter=".Architecture"
                  >
                    Architecture
                  </a>

                  <a
                    href="#0"
                    onClick={() => handleFilterClick('Interior')}
                    className={`filter-btn ${
                      activeFilter === 'Interior' ? 'active' : ''
                    }`}
                    data-filter=".Interior"
                  >
                    Interior
                  </a>
                  <a
                    href="#0"
                    onClick={() => handleFilterClick('guide')}
                    className={`filter-btn ${
                      activeFilter === 'guide' ? 'active' : ''
                    }`}
                    data-filter=".guide"
                  >
                    guide
                  </a>
                  <a
                    href="#0"
                    onClick={() => handleFilterClick('inspiration')}
                    className={`filter-btn ${
                      activeFilter === 'inspiration' ? 'active' : ''
                    }`}
                    data-filter=".inspiration"
                  >
                    inspiration
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-3 mt-5 mt-lg-0">
              <div className="search-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search in blog"
                />
                <button>
                  <i className="fal fa-search"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="posts-content">
          <div className="row mixitup" ref={mixitupContainerRef}>
            {data.map((item, i) => (
              <div key={i} className={`col-lg-4 mix-item ${item.subTitle}`}>
                <div
                  className="post-card mt-70 wow fadeInUp slow"
                  data-wow-delay="0.2s"
                >
                  <a
                    href="#"
                    className="img th-280 radius-7 overflow-hidden d-block"
                  >
                    <img src={item.img} alt="" className="img-cover" />
                  </a>
                  <div className="info pt-30">
                    <div className="tags color-666 text-uppercase fsz-12">
                      <a href="#" className="color-orange1">
                        {item.subTitle}
                      </a>
                      <span className="circle icon-3 bg-666 rounded-circle mx-3"></span>
                      <a href="#"> {item.history} </a>
                    </div>
                    <h3 className="title mt-15">
                      <a href="#" className="hover-orange1 fsz-24">
                        {item.title}
                      </a>
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center wow fadeInUp slow" data-wow-delay="0.2s">
          <a
            href="#"
            className="butn border rounded-pill color-orange1 border-orange1 hover-bg-orange1 mt-100 px-5"
          >
            <span> Load More (6) </span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default FilterPosts;
