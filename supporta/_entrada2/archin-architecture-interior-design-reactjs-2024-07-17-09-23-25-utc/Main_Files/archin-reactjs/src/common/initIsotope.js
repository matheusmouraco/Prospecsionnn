'use client';
import Isotope from 'isotope-layout';
const initIsotope = (father) => {
  if (typeof window != undefined) {
    var iso;
    let grid = document.querySelectorAll(`.${father}`);
    let filtersElem = document.querySelector('.filter');
    let buttonGroups = document.querySelectorAll('.filter-btn');
    grid.forEach((item) => {
      iso = new Isotope(item, {
        itemSelector: '.mix-item',
      });
    });
    if (grid.length >= 1) {
      grid.forEach((item) => {
        iso = new Isotope(item, {
          itemSelector: '.mix-item',
        });
      });
    }

    // Add Isotope initialization for .gallery2
    // let gallery2Iso = new Isotope('.gallery2', {
    //   itemSelector: '.items',
    //   masonry: {
    //     columnWidth: '.width2',
    //   },
    // });

    if (filtersElem) {
      filtersElem.addEventListener('click', function (event) {
        if (!matchesSelector(event.target, 'span')) {
          return;
        }
        var filterValue = event.target.getAttribute('dataFilter');
        filterValue = filterValue;

        // Update both Isotope instances
        iso.arrange({ filter: filterValue });
        gallery2Iso.arrange({ filter: filterValue });
      });

      const radioButtonGroup = (buttonGroup) => {
        buttonGroup.addEventListener('click', (event) => {
          if (!matchesSelector(event.target, 'span')) {
            return;
          }
          buttonGroup.querySelector('.active').classList.remove('active');
          event.target.classList.add('active');
        });
      };

      for (var i = 0, len = buttonGroups.length; i < len; i++) {
        var buttonGroup = buttonGroups[i];
        radioButtonGroup(buttonGroup);
      }
    }
  }
};

export default initIsotope;
