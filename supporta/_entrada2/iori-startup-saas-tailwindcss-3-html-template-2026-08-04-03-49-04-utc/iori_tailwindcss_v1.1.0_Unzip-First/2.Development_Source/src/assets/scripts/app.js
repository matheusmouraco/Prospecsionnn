function homepageScrollImage(el) {
  const $this = el;
  const imgArr = $this.find('.flex-image .gallery-box');

  const leftImg = imgArr.eq(0);
  const rightImg = imgArr.eq(1);

  const leftDfValue = parseInt(leftImg.css('top'));
  const rightDfValue = parseInt(rightImg.css('top'));

  if ($(window).width() <= 1279.98) return;

  $(window).on('scroll', function () {
    let currScroll = $(this).scrollTop();
    if (currScroll > 1200) return;

    let leftCalc = currScroll / 7.25 + leftDfValue;
    let rightCalc = currScroll / 7.25 + rightDfValue;
    leftImg.css('top', `-${leftCalc}px`);
    rightImg.css('top', `${rightCalc}px`);
  });
}

const homepage7 = $('.homepage-7');
homepageScrollImage(homepage7);

$(function () {
  $('.accordion').hover(
    function () {
      $(this).addClass('hover');
    },
    function () {
      $(this).removeClass('hover');
    },
  );

  $('.accordion').click(function () {
    var elm = $(this);
    if (elm.next('.accordionBox').is(':visible')) {
      elm.removeClass('active').next('.accordionBox').slideUp(0);
    } else {
      elm
        .next('.accordionBox')
        .slideDown(0)
        .siblings('.accordionBox')
        .slideUp(0)
        .siblings('.accordion')
        .removeClass('active');
      elm.addClass('active');
    }
  });
});

$('.card-quotes').owlCarousel({
  loop: true,
  margin: 30,
  nav: false,
  dots: false,
  responsive: {
    0: {
      items: 1,
    },
    1281: {
      items: 2,
    },
  },
});

$('.card-guide').owlCarousel({
  loop: true,
  margin: 30,
  nav: false,
  dots: false,
  responsive: {
    0: {
      items: 1,
    },
    1000: {
      items: 2,
    },
    1281: {
      items: 3,
    },
  },
});

$(function () {
  $('.tab a').click(function () {
    var elm = $(this);
    if (!elm.parent('li').hasClass('active')) {
      elm.parent('li').siblings().removeClass('active');
      elm.parent('li').addClass('active');
      elm.parents('.tab').next().children('.tabBox').hide();
      $(this.hash).fadeIn();
    }
    return false;
  });
});

$(function () {
  $('.tabMarketing a').click(function () {
    var elm = $(this);
    if (!elm.parent('li').hasClass('active')) {
      elm.parent('li').siblings().removeClass('active');
      elm.parent('li').addClass('active');
      elm.parents('.tabMarketing').next().children('.tabBox').hide();
      $(this.hash).fadeIn();
    }
    return false;
  });
});

$(function () {
  $('.tabHeader a').click(function () {
    var elm = $(this);
    if (!elm.parent('li').hasClass('active')) {
      elm.parent('li').siblings().removeClass('active');
      elm.parent('li').addClass('active');
      elm.parents('.tabHeader').next().children('.tabBox').hide();
      $(this.hash).fadeIn();
    }
    return false;
  });
});

$(function () {
  $('.tabLastestArticles a').click(function () {
    var elm = $(this);
    if (!elm.parent('li').hasClass('active')) {
      elm.parent('li').siblings().removeClass('active');
      elm.parent('li').addClass('active');
      elm.parents('.tabLastestArticles').next().children('.tabBox').hide();
      $(this.hash).fadeIn();
    }
    return false;
  });
});

$(function () {
  $('.tabPlanTime a').click(function () {
    var elm = $(this);
    if (!elm.parent('li').hasClass('active')) {
      elm.parent('li').siblings().removeClass('active');
      elm.parent('li').addClass('active');
      elm.parents('.tabPlanTime').next().children('.tabBox').hide();
      $(this.hash).fadeIn();
    }
    return false;
  });
});

$(function () {
  $('.tabPlan01Time a').click(function () {
    var elm = $(this);
    if (!elm.parent('li').hasClass('active')) {
      elm.parent('li').siblings().removeClass('active');
      elm.parent('li').addClass('active');
      elm.parents('.tabPlan01Time').next().children('.tabBox').hide();
      $(this.hash).fadeIn();
    }
    return false;
  });
});

$(function () {
  $('.tabAskedQuestions a').click(function () {
    var elm = $(this);
    if (!elm.parent('li').hasClass('active')) {
      elm.parent('li').siblings().removeClass('active');
      elm.parent('li').addClass('active');
      elm
        .parents('.tabAskedQuestions')
        .parents('.tabAskedQuestionsParent')
        .next()
        .children('.tabBox')
        .hide();

      $(this.hash).fadeIn();
    }
    return false;
  });
});

$('.image-auto-play').owlCarousel({
  items: 8,
  loop: true,
  margin: 0,
  autoplay: true,
  autoplayTimeout: 0,
  slideTransition: 'linear',
  autoplaySpeed: 3000,
  autoplayHoverPause: false,
  responsive: {
    0: {
      items: 4,
    },
    640: {
      items: 6,
    },
    1024: {
      items: 8,
    },
  },
});

$('.brand-owl').owlCarousel({
  loop: true,
  nav: false,
  dots: true,
  responsive: {
    0: {
      items: 3,
      margin: 24,
    },
    500: {
      items: 5,
      margin: 16,
    },
    1000: {
      items: 6,
      margin: 50,
    },
    1280: {
      items: 8,
      margin: 60,
    },
  },
});

$('.custommers-saying-owl').owlCarousel({
  loop: true,
  margin: 30,
  nav: false,
  dots: true,
  autoHeight: true,
  responsive: {
    0: {
      items: 1,
    },
    1000: {
      items: 3,
    },
  },
});

$('.offer-btn-carousel').owlCarousel({
  loop: true,
  margin: 30,
  nav: true,
  navText: [$('.custom-prev'), $('.custom-next')],
  responsive: {
    0: {
      items: 1,
    },
    800: {
      items: 2,
    },
    1281: {
      items: 4,
    },
  },
});

$('.thumb-img-owl').owlCarousel({
  items: 1,
  loop: true,
  nav: false,
  dots: true,
});

$(document).ready(function () {
  $('body').modal({
    disableScroll: true,
  });
});

var cbCustomCheckboxButtonChangeHandle = function (e) {
  if (e.next().is(':checked')) {
    e.addClass('checked');
  } else {
    e.removeClass('checked');
  }
};
var cbCustomCheckboxButtonClickHandle = function (e) {
  if (!e.is('checked')) {
    e.removeClass('checked');
  } else {
    e.addClass('checked');
  }
};
$.fn.cbCustomCheckbox = function (opts) {
  $(this).filter(function (i) {
    if ($(this).hasClass('cbCustomButton')) return;
    var id = $(this).attr('id'),
      checked = $(this).is(':checked');
    name = $(this).attr('name');

    if (navigator.userAgent.match(/MSIE 8.0/)) {
      $(this)
        .addClass('cbCustomHidden')
        .before('<label for="' + id + '" class="cbCustomCheckbox cbCustom">&nbsp;</label>');
    } else {
      $(this)
        .css('display', 'none')
        .before('<label for="' + id + '" class="cbCustomCheckbox cbCustom">&nbsp;</label>');
    }
    var $jqDBtn = $(this).prev();
    $(this).addClass('cbCustomButton');
    if (checked) {
      $jqDBtn.addClass('checked');
    }

    $jqDBtn.click(function (e) {
      cbCustomCheckboxButtonClickHandle($(this).next());
    });

    $(this).change(function (e) {
      cbCustomCheckboxButtonChangeHandle($(this).prev());
    });
  });
};
$('input[type="checkbox"]').cbCustomCheckbox();

$(document).ready(function () {
  $('.dropdown-language-select').click(function () {
    $('.dropdown-language-list').toggle();
  });
  $('.dropdown-language-item').click(function () {
    $('.dropdown-language-select span').text($(this).text());
    $('.dropdown-language-list').hide();
  });
});

$(document).ready(function () {
  $('.dropdown-product-select').click(function () {
    $('.dropdown-product-list').toggle();
  });
  $('.dropdown-product-item').click(function () {
    $('.dropdown-product-select span').text($(this).text());
    $('.dropdown-product-list').hide();
  });
});

$(document).ready(function () {
  $('.hamburger-menu').click(function () {
    $('.menu-mobile-iori').toggleClass('show');
    $('.overlay').fadeToggle();
  });

  $('.overlay').click(function () {
    $('.menu-mobile-iori').removeClass('show');
    $('.overlay').fadeOut();
  });

  $('.close-menu-icon').click(function () {
    $('.menu-mobile-iori').removeClass('show');
    $('.overlay').fadeOut();
  });
});

window.addEventListener('scroll', function () {
  var header = document.querySelector('.fixed-header');
  if (window.pageYOffset > 0) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

$(document).ready(function () {
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('#go-top-btn').fadeIn();
    } else {
      $('#go-top-btn').fadeOut();
    }
  });

  $('#go-top-btn').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 0);
    return false;
  });
});

// $(document).ready(function () {
//   $('.hamburger-menu').click(function () {
//     $('.menu-mobile-iori').toggleClass('show');
//     $('.overlay').fadeToggle();
//   });

//   $('.overlay').click(function () {
//     $('.menu-mobile-iori').removeClass('show');
//     $('.overlay').fadeOut();
//   });
// });

var productSlider = new Swiper('.product-slider', {
  spaceBetween: 0,
  centeredSlides: false,
  loop: true,
  direction: 'horizontal',
  loopedSlides: 5,
  resizeObserver: true,
});
var productThumbs = new Swiper('.product-thumbs', {
  spaceBetween: 0,
  centeredSlides: true,
  spaceBetween: 16,
  loop: true,
  slideToClickedSlide: true,
  direction: 'horizontal',
  slidesPerView: 2,
  loopedSlides: 2,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    501: {
      slidesPerView: 3,
      loopedSlides: 3,
    },
    769: {
      slidesPerView: 5,
      loopedSlides: 5,
    },
  },
});
productSlider.controller.control = productThumbs;
productThumbs.controller.control = productSlider;

var homepageEightImageSlider = new Swiper('.homepage-8-image-slider', {
  slidesPerView: 1.5,
  spaceBetween: 30,
  freeMode: false,
  loop: true,
  centeredSlides: true,
  navigation: {
    nextEl: null,
    prevEl: null,
  },
  breakpoints: {
    641: {
      slidesPerView: 2.5,
    },
    1000: {
      slidesPerView: 3.5,
    },
    1281: {
      slidesPerView: 5.5,
    },
  },
});

$('#prevButtonHomepage8').click(function () {
  homepageEightImageSlider.slidePrev();
});

$('#nextButtonHomepage8').click(function () {
  homepageEightImageSlider.slideNext();
});

const playButton = $('.play-video');
const iframeVideo = $('.video-iframe');
const closeIframe = $('.close-video');
const video = $('.video');

playButton.on('click', function () {
  iframeVideo.removeClass('hidden');
});

closeIframe.on('click', function () {
  iframeVideo.addClass('hidden');
});

$(document).ready(function () {
  var input01 = $('.product-input01');
  var incrementButton01 = $('.increment-button01');
  var decrementButton01 = $('.decrement-button01');

  incrementButton01.click(function () {
    var value = parseInt(input01.val());
    input01.val(value + 1);
  });

  decrementButton01.click(function () {
    var value = parseInt(input01.val());
    if (value > 1) {
      input01.val(value - 1);
    }
  });
});

$(document).ready(function () {
  var input02 = $('.product-input02');
  var incrementButton02 = $('.increment-button02');
  var decrementButton02 = $('.decrement-button02');

  incrementButton02.click(function () {
    var value = parseInt(input02.val());
    input02.val(value + 1);
  });

  decrementButton02.click(function () {
    var value = parseInt(input02.val());
    if (value > 1) {
      input02.val(value - 1);
    }
  });
});

$(document).ready(function () {
  var daysElement = $('.days-element');
  var hoursElement = $('.hours-element');
  var minsElement = $('.mins-element');
  var secsElement = $('.secs-element');

  var countdown = setInterval(function () {
    var endDate = new Date('2023-03-31 23:59:59').getTime();
    var now = new Date().getTime();
    var timeLeft = endDate - now;

    var days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    var hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var mins = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    var secs = Math.floor((timeLeft % (1000 * 60)) / 1000);

    daysElement.text(days);
    hoursElement.text(hours);
    minsElement.text(mins);
    secsElement.text(secs);

    if (timeLeft < 0) {
      clearInterval(countdown);
      $('.gap-4').hide();
    }
  }, 1000);
});

$('.search-icon01').click(function () {
  $('.search-form01').toggle();
});

$('.x-close-icon').click(function () {
  $('.green-bar').hide();
});
