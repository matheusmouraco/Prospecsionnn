$( function() {
    

    // projects change background 
    $('.tc-projects-style7 .swiper-slide').on('mouseenter click', function () {
        var tab_id = $(this).attr('data-tab');
        $('.tc-projects-style7 .swiper-slide').removeClass('current');
        $(this).addClass('current');

        $('.glry-img .tab-img ').removeClass('current');
        $("#" + tab_id).addClass('current');

        if ($(this).hasClass('current')) {
            return false;
        }
    });

    $(".tc-projects-style7 .swiper-button-next").on('click' ,function(){
        $(".tc-projects-style7 .swiper-slide-next").click();
    })
    $(".tc-projects-style7 .swiper-button-prev").on('click' ,function(){
        $(".tc-projects-style7 .swiper-slide-prev").click();
    })
    // end projects change background 



    // proccess change img 
    $('.tc-proccess-style7 .accordion-item').on('click', function () {
        var tab_id = $(this).attr('data-tab');
        $('.tc-proccess-style7 .accordion-item').removeClass('current');
        $(this).addClass('current');

        $('.tc-proccess-style7 .prc-img').removeClass('current');
        $("#" + tab_id).addClass('current');

        if ($(this).hasClass('current')) {
            return false;
        }
    });


    


     /* ==  float_box_container button  == */
     $( ".float_box_container" ).mousemove(function(e) {
        var parentOffset = $(this).offset(); 
        var relX = e.pageX - parentOffset.left;
        var relY = e.pageY - parentOffset.top;
        $(".float_box").css({"left": relX, "top": relY });
        $(".float_box").addClass("show");
    });
    $( ".float_box_container" ).mouseleave(function(e) {
        $(".float_box").removeClass("show");
    });

});


// ------------ swiper sliders -----------
$(document).ready(function() {

    var swiper = new Swiper('.tc-projects-style7 .projects-slider', {
        spaceBetween: 0,
        speed: 1000,
        pagination: false,
        navigation: {
            nextEl: '.tc-projects-style7 .swiper-button-next',
            prevEl: '.tc-projects-style7 .swiper-button-prev',
        },
        mousewheel: false,
        keyboard: true,
        autoplay: false,
        loop: false,
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            480: {
                slidesPerView: 2,
            },
            787: {
                slidesPerView: 3,
            },
            991: {
                slidesPerView: 4,
            },
            1200: {
                slidesPerView: 4,
            }
        }
    });


    var swiper = new Swiper('.tc-testimonials-style7 .testi-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        centeredSlides: true,
        speed: 1000,
        pagination: false,
        navigation: {
            nextEl: '.tc-testimonials-style7 .swiper-button-next',
            prevEl: '.tc-testimonials-style7 .swiper-button-prev',
        },
        mousewheel: false,
        keyboard: true,
        autoplay: {
            delay: 5000,
        },
        loop: true,
    });


    // ------------ tc-awards-slider1 -----------
    var swiper = new Swiper('.tc-awards-slider1', {
        spaceBetween: 60,
        centeredSlides: true,
        slidesPerView: "auto",
        speed: 10000,
        autoplay: {
            delay: 1,
        },
        loop: true,
    //   allowTouchMove: false,
        disableOnInteraction: true,
    });

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

    // const tl = gsap.timeline();

    //     tl.from(".title h2", 1.8, {
    //     y: 100,
    //     ease: "power4.out",
    //     delay: 1,
    //     skewY: 7,
    //     stagger: {
    //         amount: 0.3
    //     }
    // })
});

