(function ($) {
    'use strict';
    /*=============================================
    =     Offcanvas Menu      =
    =============================================*/
    function offcanvasMenu() {
        $('.menu-tigger').on('click', function () {
            $('.offCanvas__info, .offCanvas__overly').addClass('active');
            return false;
        });
        $('.menu-close, .offCanvas__overly').on('click', function () {
            $('.offCanvas__info, .offCanvas__overly').removeClass('active');
        });
    }
    /*=============================================
    =           Go to top       =
    =============================================*/
    function progressPageLoad() {
        var progressWrap = document.querySelector('.btn-scroll-top');
        if (progressWrap != null) {
            var progressPath = document.querySelector('.btn-scroll-top path');
            var pathLength = progressPath.getTotalLength();
            var offset = 50;
            progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
            progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
            progressPath.style.strokeDashoffset = pathLength;
            progressPath.getBoundingClientRect();
            progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
            window.addEventListener('scroll', function (event) {
                var scroll = document.body.scrollTop || document.documentElement.scrollTop;
                var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                var progress = pathLength - (scroll * pathLength) / height;
                progressPath.style.strokeDashoffset = progress;
                var scrollElementPos = document.body.scrollTop || document.documentElement.scrollTop;
                if (scrollElementPos >= offset) {
                    progressWrap.classList.add('active-progress');
                } else {
                    progressWrap.classList.remove('active-progress');
                }
            });
            progressWrap.addEventListener('click', function (e) {
                e.preventDefault();
                window.scroll({
                    top: 0,
                    left: 0,
                    behavior: 'smooth',
                });
            });
        }
    }


    function mobileHeaderActive() {
        var navbarTrigger = $('.burger-icon'),
            navCanvas = $('.burger-icon-2'),
            closeCanvas = $('.close-canvas'),
            endTrigger = $('.mobile-menu-close'),
            container = $('.mobile-header-active'),
            containerCanvas = $('.sidebar-canvas-wrapper'),
            wrapper4 = $('body');
        wrapper4.prepend('<div class="body-overlay-1"></div>');
        navbarTrigger.on('click', function (e) {
            navbarTrigger.toggleClass('burger-close');
            e.preventDefault();
            container.toggleClass('sidebar-visible');
            wrapper4.toggleClass('mobile-menu-active');
        });
        endTrigger.on('click', function () {
            container.removeClass('sidebar-visible');
            wrapper4.removeClass('mobile-menu-active');
        });
        var $offCanvasNav = $('.mobile-menu'),
            $offCanvasNavSubMenu = $offCanvasNav.find('.sub-menu');
        /*Add Toggle Button With Off Canvas Sub Menu*/
        $offCanvasNavSubMenu.parent().prepend('<span class="menu-expand"><i class="arrow-small-down"></i></span>');
        /*Close Off Canvas Sub Menu*/
        $offCanvasNavSubMenu.slideUp();
        /*Category Sub Menu Toggle*/
        $offCanvasNav.on('click', 'li a, li .menu-expand', function (e) {
            var $this = $(this);
            if (
                $this
                    .parent()
                    .attr('class')
                    .match(/\b(menu-item-has-children|has-children|has-sub-menu)\b/) &&
                ($this.attr('href') === '#' || $this.hasClass('menu-expand'))
            ) {
                e.preventDefault();
                if ($this.siblings('ul:visible').length) {
                    $this.parent('li').removeClass('active');
                    $this.siblings('ul').slideUp();
                } else {
                    $this.parent('li').addClass('active');
                    $this.closest('li').siblings('li').removeClass('active').find('li').removeClass('active');
                    $this.closest('li').siblings('li').find('ul:visible').slideUp();
                    $this.siblings('ul').slideDown();
                }
            }
        });
    }

    function accordion() {
        window.setTimeout(function () {
            $('.accordion').css('opacity', '1');
        }, 2000);
        $('.accordion-item').addClass('default');
        $('.accordion-item').on('click', function () {
            var e = $('.accordion > .accordion-item');
            if (e.hasClass('expand')) {
                e.removeClass('expand');
                $(this).addClass('expand');
            } else {
                $(this).addClass('expand');
            }
        });
    }
    $('.collapse.show').each(function () {
        $(this).closest('.collapse-custom').addClass('active');
    });

    $('.collapse')
        .on('shown.bs.collapse', function () {
            $(this).closest('.collapse-custom').addClass('active');
        })
        .on('hidden.bs.collapse', function () {
            $(this).closest('.collapse-custom').removeClass('active');
        });
    function collapse() {
        var coll = document.getElementsByClassName('collapsible');
        var i;
        for (i = 0; i < coll.length; i++) {
            coll[i].addEventListener('click', function () {
                this.classList.toggle('active');
                var content = this.nextElementSibling;
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                    content.style.borderBottom = 'none';
                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    content.style.borderBottom = '1px solid var(--tc-theme-primary)';
                }
            });
        }
    }

    /*=============================================
    =           Page Load       =
    =============================================*/
    $(window).on('load', function () {
        preloader();
        progressPageLoad();
        offcanvasMenu();
        mobileHeaderActive();
        collapse();
        accordion();
    });
})(jQuery);
