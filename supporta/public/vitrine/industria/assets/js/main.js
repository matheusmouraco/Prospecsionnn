(function ($) {
    'use strict';

    ///////////////////////////////////////////////////////
    // Preloader
    $('.preloader').delay(800).fadeOut('slow');
    // Preloader End

    $(window).on('scroll', function () {
        if ($(window).scrollTop() > 150) {
            $('#sticky-menu').addClass('sticky-header');
        } else {
            $('#sticky-menu').removeClass('sticky-header');
        }
    });
    /**************************************
     *****  Set Background Image *****
     **************************************/
    if ($('[data-bg-src]').length > 0) {
        $('[data-bg-src]').each(function () {
            var src = $(this).attr('data-bg-src');
            $(this).css('background-image', 'url(' + src + ')');
            $(this).removeAttr('data-bg-src').addClass('background-image');
        });
    }

    ///////////////////////////////////////////////////////
    // Sticky Menu
    $(window).on('scroll', function () {
        var scroll = $(window).scrollTop();
        if (scroll >= 20) {
            $('.structa-menu-area').addClass('sticky');
        } else {
            $('.structa-menu-area').removeClass('sticky');
        }
    });
    // Sticky Menu End

    // Custom Cursor
    const cursor = document.querySelector('.cursor');

    if (cursor) {
        const editCursor = (e) => {
            const { clientX: x, clientY: y } = e;
            cursor.style.left = x + 'px';
            cursor.style.top = y + 'px';
        };
        window.addEventListener('mousemove', editCursor);

        document.querySelectorAll('a, .cursor-pointer').forEach((item) => {
            item.addEventListener('mouseover', () => {
                cursor.classList.add('cursor-active');
            });

            item.addEventListener('mouseout', () => {
                cursor.classList.remove('cursor-active');
            });
        });
    }

    // Custom Cursor End

    // Odometer Counter

    $('.counter-item').each(function () {
        var $counterItem = $(this);
        $counterItem.isInViewport(function (status) {
            if (status === 'entered') {
                $counterItem.find('.odometer').each(function () {
                    var el = this;
                    el.innerHTML = el.getAttribute('data-odometer-final');
                });
            }
        });
    });
    // Odometer Counter End
    // Check if thumbnail slider exists

    // Marquee
    $('.marquee').each(function () {
        var $marquee = $(this);
        var $itemContainer = $marquee.find('.marquee-item-container');
        var elements = $itemContainer.find('.marquee-item').length;
        var repeatCount = elements < 5 ? 5 : elements;

        for (var i = 0; i < repeatCount; i++) {
            $itemContainer.clone().appendTo($marquee);
        }
    });

    // Marquee End

    jQuery(window).on('load', function () {
        //wow Animation
        new WOW().init();
        window.wow = new WOW({
            boxClass: 'wow',
            animateClass: 'animated',
            offset: 0,
            mobile: true,
            live: true,
            offset: 100,
        });
        window.wow.init();
    });

    /* Service Slide */

    var serviceSlider = new Swiper('.service-slider', {
        spaceBetween: 28,
        loop: true,
        speed: 1000,
        breakpoints: {
            320: {
                slidesPerView: 1,
            },
            480: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 2.7,
            },
            1200: {
                slidesPerView: 3.7,
            },
            1400: {
                slidesPerView: 3.9,
            },
        },
        navigation: {
            nextEl: '.service-button-next',
            prevEl: '.service-button-prev',
        },
    });

    /*service two*/
    var serviceSlider = new Swiper('.service-slider-two', {
        spaceBetween: 28,
        loop: true,
        speed: 1000,
        breakpoints: {
            320: {
                slidesPerView: 1,
            },
            480: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 2,
            },
            1200: {
                slidesPerView: 3,
            },
            1400: {
                slidesPerView: 3,
            },
        },
        navigation: {
            nextEl: '.service-two-button-next',
            prevEl: '.service-two-button-prev',
        },
    });

    /* Service End */

    /* Project Slide */

    var projectTwoSlider = new Swiper('.project-slider-two', {
        spaceBetween: 28,
        loop: true,
        speed: 2000,
        centeredSlides: true,
        breakpoints: {
            320: {
                slidesPerView: 1,
                speed: 1000,
                autoplay: {
                    delay: 3000,
                },
            },
            480: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 1.5,
            },
            992: {
                slidesPerView: 1.6,
            },
            1200: {
                slidesPerView: 1.8,
            },
            1400: {
                slidesPerView: 1.8,
            },
        },

        navigation: {
            nextEl: '.project-button-next',
            prevEl: '.project-button-prev',
        },
    });

    var projectThreeSlider = new Swiper('.project-slider-three', {
        spaceBetween: 24,
        loop: true,
        speed: 1000,
        autoplay: {
            delay: 3000,
        },
        centeredSlides: true,
        breakpoints: {
            320: {
                slidesPerView: 1,
            },
            480: {
                slidesPerView: 1.2,
            },
            768: {
                slidesPerView: 2.5,
            },
            992: {
                slidesPerView: 2.8,
            },
            1200: {
                slidesPerView: 3.3,
            },
            1400: {
                slidesPerView: 3.5,
            },
        },
    });

    var projectSlider = new Swiper('.project-slider', {
        spaceBetween: 48,
        loop: true,
        speed: 1000,
        autoplay: {
            delay: 3000,
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
            },
            480: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 2.3,
            },
            1200: {
                slidesPerView: 2.3,
            },
            1400: {
                slidesPerView: 2.3,
            },
        },
        navigation: {
            nextEl: '.project-three-button-next',
            prevEl: '.project-three-button-prev',
        },
    });

    /* Project End */

    /* Testimonial Slide */

    var testimonialSlider = new Swiper('.testimonial-slider', {
        loop: true,
        slidesPerView: 1,
        speed: 500,
        fadeEffect: { crossFade: true },
        effect: 'fade',
        runCallbacksOnInit: true,
        pagination: {
            el: '.testimonial-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.testimonial-button-next',
            prevEl: '.testimonial-button-prev',
        },
        320: {
            allowTouchMove: true,
        },
        992: {
            allowTouchMove: false,
        },
    });

    /* Testimonial End */

    /* Hero Slide */

    var heroSlider = new Swiper('.hero-slider', {
        loop: true,
        slidesPerView: 1,
        speed: 1000,
        fadeEffect: { crossFade: true },
        effect: 'fade',
        navigation: {
            nextEl: '.hero-button-next',
            prevEl: '.hero-button-prev',
        },
        breakpoints: {
            320: {
                autoplay: {
                    delay: 1000,
                },
            },
            992: {
                autoplay: false,
            },
        },
    });

    /* Hero End */

    // Partners Slide

    var partnersSlider = new Swiper('.brand-slide-wrap', {
        centeredSlides: true,
        speed: 4000,
        autoplay: {
            delay: 1,
        },
        loop: true,
        slidesPerView: 'auto',
        allowTouchMove: false,
        disableOnInteraction: true,
    });

    // Partners Slide End

    /* Search */

    document.addEventListener('DOMContentLoaded', function () {
        // Select both desktop and mobile search buttons
        const searchBtns = document.querySelectorAll('.search-btn');
        const searchFormOverlay = document.querySelector('.search-form-overlay');
        const searchCloseBtn = document.querySelector('.search-close-btn');
        const searchForm = document.querySelector('.search-form');
        const searchInput = document.querySelector('.search-input');

        // Add click event to all search buttons (both desktop and mobile versions)
        searchBtns.forEach((btn) => {
            btn.addEventListener('click', function () {
                searchFormOverlay.classList.add('active');
                // Focus on input after animation completes
                setTimeout(() => {
                    searchInput.focus();
                }, 300);
            });
        });

        // Close search form when close button is clicked
        searchCloseBtn.addEventListener('click', function () {
            searchFormOverlay.classList.remove('active');
        });

        // Close search form when clicking outside the form
        searchFormOverlay.addEventListener('click', function (e) {
            if (e.target === searchFormOverlay) {
                searchFormOverlay.classList.remove('active');
            }
        });

        // Prevent form submission event from closing the overlay (handle form submission)
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                // Implement your search functionality here
                console.log('Searching for:', searchTerm);

                // Optional: Close the form after search
                // searchFormOverlay.classList.remove('active');
            }
        });

        // Close search form when pressing Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && searchFormOverlay.classList.contains('active')) {
                searchFormOverlay.classList.remove('active');
            }
        });
    });

    /* Search End */

    /* Video Player */

    function initializeVideoPlayers(videoSelector, playBtnSelector) {
        const videos = document.querySelectorAll(videoSelector);
        const playBtns = document.querySelectorAll(playBtnSelector);

        videos.forEach((video, index) => {
            const playBtn = playBtns[index];
            if (video && playBtn) {
                video.pause();

                playBtn.addEventListener('click', () => {
                    if (video.paused) {
                        video.play();
                        playBtn.classList.add('disabled');
                        video.classList.add('pointer');
                    } else {
                        video.pause();
                        playBtn.classList.remove('disabled');
                        video.classList.remove('pointer');
                    }
                });

                video.addEventListener('click', () => {
                    console.log('clicked');
                    if (playBtn.classList.contains('disabled')) {
                        video.pause();
                        playBtn.classList.remove('disabled');
                        video.classList.remove('pointer');
                    }
                });
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        initializeVideoPlayers('.video-player', '.play-btn');
    });

    /* Video Player End */

    // Hover Active
    document.addEventListener('DOMContentLoaded', function () {
        // Select all wraps on the page
        const teamWraps = document.querySelectorAll('.active-wrap');

        // Set the first item as active by default (if there are any items)
        if (teamWraps.length > 0) {
            teamWraps[0].classList.add('active');
        }

        // Add mouseenter event to each wrap
        teamWraps.forEach((teamWrap) => {
            teamWrap.addEventListener('mouseenter', function () {
                // First remove active class from all wraps
                teamWraps.forEach((tw) => {
                    tw.classList.remove('active');
                });

                // Add active class to the currently hovered wrap
                this.classList.add('active');
            });
        });
    });

    $(window).on('scroll', function () {
        // Progress Bar
        $('.skill-progress .progres').each(function () {
            var bottom_of_object = $(this).offset().top + $(this).outerHeight();
            var bottom_of_window = $(window).scrollTop() + $(window).height();
            var myVal = $(this).attr('data-value');
            if (bottom_of_window > bottom_of_object) {
                $(this).css({
                    width: myVal,
                });
            }
        });

        // Progress Bar End
    });

    /* Service Tab */

    $(document).ready(function () {
        // Assign dynamic IDs to tabs and content
        $('.columns').each(function (index) {
            $(this).attr('data-tab', 'tab' + (index + 1));
        });

        $('.tab-img').each(function (index) {
            // Calculate which tab group this image belongs to
            var tabGroup = Math.floor(index / 2) + 1;
            $(this).attr('data-tab-group', 'tab' + tabGroup);
        });

        // Tab functionality
        $('.columns').on('mouseenter', function () {
            var tab_id = $(this).attr('data-tab');

            // Remove current class from all columns
            $('.columns').removeClass('current');
            $(this).addClass('current');

            // Remove current class from all images
            $('.tab-img').removeClass('current');

            // Add current class to both images that belong to this tab group
            $('.tab-img[data-tab-group="' + tab_id + '"]').addClass('current');
        });

        // Background image functionality
        $('.bg-img').each(function () {
            if ($(this).attr('data-background')) {
                $(this).css('background-image', 'url(' + $(this).data('background') + ')');
            }
        });
    });

    /* Service Tab End */

    // Bottom to top start
    $(document).ready(function () {
        $(window).on('scroll', function () {
            if ($(this).scrollTop() > 100) {
                $('#scroll-top').fadeIn();
            } else {
                $('#scroll-top').fadeOut();
            }
        });
        $('#scroll-top').on('click', function () {
            $('html, body').animate({ scrollTop: 0 }, 600);
            return false;
        });
    });
    // Bottom to top End

    //Mixitup
    $('.work-mixi').mixItUp();

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
})(jQuery);
