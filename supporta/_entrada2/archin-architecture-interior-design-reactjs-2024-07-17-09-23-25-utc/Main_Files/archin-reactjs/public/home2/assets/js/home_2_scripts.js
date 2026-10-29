$( function() {

    // ----------- side menu -----------
    $(".side_menu_btn").on("click", function () {
        $(this).toggleClass("active");
        $(".side_menu4_overlay").toggleClass("show");
        $(".side_menu4_overlay2").toggleClass("show");
        $(".side_menu_style4").toggleClass("show");
    });

    $(".side_menu_style4 .clss").on("click", function () {
        $(".side_menu4_overlay").toggleClass("show");
        $(".side_menu4_overlay2").toggleClass("show");
        $(".side_menu_style4").toggleClass("show");
    });  


    // ---------- search box -----------
    $(".navbar .search_btn").on("click" , function(){
        $(".nav-search-box").toggleClass("show");
    })
    

});


// ------------ swiper sliders -----------
$(document).ready(function() {

    // head-slider
    var swiper = new Swiper('.tc-header-style2 .head-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        centeredSlides: true,
        speed: 1000,
        pagination: {
            el: '.tc-header-style2 .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.tc-header-style2 .swiper-button-next',
            prevEl: '.tc-header-style2 .swiper-button-prev',
        },
        mousewheel: false,
        keyboard: true,
        autoplay: {
            delay: 6000,
        },
        loop: true,
    });

    // projects-style2
    var swiper = new Swiper('.tc-projects-style2 .projects-slider', {
        slidesPerView: 3,
        spaceBetween: 30,
        centeredSlides: true,
        speed: 1000,
        pagination: {
            el: '.tc-projects-style2 .swiper-pagination',
            clickable: true,
        },
        navigation: false,
        mousewheel: false,
        keyboard: true,
        autoplay: {
            delay: 7000,
        },
        loop: true,
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            480: {
                slidesPerView: 2,
            },
            787: {
                slidesPerView: 2,
            },
            991: {
                slidesPerView: 2,
            },
            1200: {
                slidesPerView: 3,
            }
        }
    });

    // testimonials img slider
    var swiper = new Swiper('.tc-testimonials-style2 .img-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        // centeredSlides: true,
        speed: 1000,
        pagination: false,
        navigation: {
            nextEl: '.tc-testimonials-style2 .img-slider .swiper-button-next',
            prevEl: '.tc-testimonials-style2 .img-slider .swiper-button-prev',
        },
        mousewheel: false,
        keyboard: true,
        autoplay: {
            delay: 6000,
        },
        loop: true,
    });

    // ------------ tc-testimonials-style2 -----------
    var swiper = new Swiper(".tc-testimonials-style2 .text-slider", {
        slidesPerView: 1,
        spaceBetween: 30,
        centeredSlides: true,
        speed: 1000,
        pagination: {
        el: ".text-side .swiper-pagination",
        type: "fraction",
        },
        navigation: {
        nextEl: ".text-side .swiper-button-next",
        prevEl: ".text-side .swiper-button-prev",
        },
        mousewheel: false,
        keyboard: true,
        autoplay: {
        delay: 6000,
        },
        loop: true,
    });

});


// ------------ scripts -----------
$(document).ready(function(){
    // ------------  File upload BEGIN ------------
    $('.file__input--file').on('change', function(event) {
        var files = event.target.files;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            $("<div class='file__value'> <div class='file__value--text'>" + file.name + "</div><div class='file__value--remove' data-id='" + file.name + "' > <i class='fa fa-times'></i> </div></div>").appendTo('.file__value_content');
        }
    });

    //Click to remove item
    $('body').on('click', '.file__value', function() {
        $(this).remove();
    });
    // ------------ File upload END ------------ 
});


// ------------ gsap scripts -----------
$(function () {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  
    // create the smooth scroller FIRST!
    const smoother = ScrollSmoother.create({
      content: "#scrollsmoother-container",
      smooth: 2,
      normalizeScroll: true,
      ignoreMobileResize: true,
      effects: true,
      //preventDefault: true,
      //ease: 'power4.out',
      //smoothTouch: 0.1,
    });
  
    // smoother.effects("img", { speed: "auto" });
  
    let headings = gsap.utils.toArray(".js-title").reverse();
    headings.forEach((heading, i) => {
      let headingIndex = i + 1;
      let mySplitText = new SplitText(heading, { type: "chars" });
      let chars = mySplitText.chars;
  
      chars.forEach((char, i) => {
        smoother.effects(char, { lag: (i + headingIndex) * 0.1, speed: 1 });
      });
    });
  
    let splitTextLines = gsap.utils.toArray(".js-splittext-lines");
  
    splitTextLines.forEach((splitTextLine) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: splitTextLine,
          start: "top 90%",
          duration: 2,
          end: "bottom 60%",
          scrub: false,
          markers: false,
          toggleActions: "play none none none",
          // toggleActions: 'play none play reset'
        },
      });
  
      const itemSplitted = new SplitText(splitTextLine, { type: "lines" });
      gsap.set(splitTextLine, { perspective: 400 });
      itemSplitted.split({ type: "lines" });
      // tl.from(itemSplitted.lines, { y: 100, delay: 0.2, opacity: 0, stagger: 0.1, duration: 1, ease: 'inOut' });
      // tl.from(itemSplitted.lines, { y: 100, opacity: 0, stagger: 0.05, duration: 1, ease: 'back.inOut' });
      tl.from(itemSplitted.lines, {
        duration: 1,
        delay: 0.5,
        opacity: 0,
        rotationX: -80,
        force3D: true,
        transformOrigin: "top center -50",
        stagger: 0.1,
      });
    });
  });

