/**
* Swiper Slider
* Enables carousels and sliders
* Requires swiper-bundle.min.js
*/



import Swiper from 'swiper/bundle';


const swiper = new Swiper(".workspaceSwiper", {
    slidesPerView: 1,
    spaceBetween: 50,
    loop: true,

    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },

    breakpoints: {
        640: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 4,
        },
    },
});

document.addEventListener("DOMContentLoaded", function () {
    const swiper = new Swiper(".locationSwiper", {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        speed: 600,
        grabCursor: true,

        navigation: {
            nextEl: ".swiper-next",
            prevEl: ".swiper-prev",
        },

        breakpoints: {
            640: { slidesPerView: 1 },
            1024: { slidesPerView: 2 },
            1280: { slidesPerView: 2 },
        },
    });
});

new Swiper(".storySwiper", {
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 15,
    loop: true,
    speed: 700,

    navigation: {
      nextEl: ".story-next",
      prevEl: ".story-prev",
    },

    breakpoints: {
      768: {
        slidesPerView: 3,
      },

      1024: {
        slidesPerView: 3,
      },
    },
  });