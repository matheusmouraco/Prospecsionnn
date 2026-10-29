(function ($) {
  $.fn.modal = function (options) {
    options = $.extend(
      {
        trigger: '.trigger',
        modals: '.modal',
        closeButton: '.close',
        opacity: 0.8,
        backgroundColor: '000',
        effect: 'fadein',
        effectSpeed: '500',
        docClose: true,
        moveOnScroll: true,
        disableScroll: false,
        moveOnResize: true,
        escapeKey: true,
        openOnLoad: false,
        alignTop: false,
        top: 20,
        onAfterShow: function () {},
        onAfterHide: function () {},
      },
      options,
    );

    if (!$('.overlay').length) {
      $('body').append('<div class="overlay"></div>');
    }
    var isOpened = false,
      trigger = $(options.trigger),
      modal = $(options.modals),
      olay = $('.overlay'),
      close = $(options.closeButton),
      win = $(window);
    if (options.effect == 'fadein') options.effect = 'fadeIn';
    if (options.effect == 'slidedown') options.effect = 'slideDown';
    olay.css({
      background: '#' + options.backgroundColor,
      opacity: options.opacity,
    });
    close.bind('click', closeModal);
    trigger.bind('click', openModal);
    if (options.openOnLoad) {
      openModal();
    }
    if (options.docClose) {
      olay.bind('click', closeModal);
    }
    if (options.escapeKey) {
      escape();
    }
    if (options.moveOnResize) {
      $(window).bind('resize', function () {
        if (modal.is(':visible')) {
          resizeWindow();
        }
      });
    }
    if (!options.moveOnScroll) {
      $(options.modals).css('position', 'absolute');
    }
    function openModal() {
      resizeWindow();
      modal.hide();
      if (!isOpened) {
        resizeWindow();
      }
      olay[options.effect](options.effectSpeed);
      modal.delay(options.effectSpeed)[options.effect](options.effectSpeed, options.onAfterShow);
      isOpened = true;
      return false;
    }
    function closeModal() {
      modal.fadeOut(100, function () {
        olay.delay(100).fadeOut('slow', options.onAfterHide);
      });
      if (options.disableScroll) {
        $('html, body').css({ 'overflow-y': 'auto' });
      }
      return false;
    }
    function escape() {
      $(document).bind('keyup', function (e) {
        if (e.keyCode == 27) {
          closeModal();
        }
        return;
      });
    }
    function resizeWindow(scrollTop) {
      var _top = '50%',
        _marginTop,
        _marginLeft = -modal.outerWidth() / 2;
      if (win.height() < options.top * 2 + modal.height()) {
        if (options.disableScroll) $('html, body').css({ 'overflow-y': 'auto' });
        if (options.moveOnScroll) $(options.modals).css({ position: 'absolute' });
        _top = options.top + win.scrollTop();
        _marginTop = 0;
      } else {
        if (options.disableScroll) {
          $('html').css({ 'overflow-y': 'hidden' });
          $('body').css({ 'overflow-y': 'scroll' });
        }
        if (options.moveOnScroll) {
          $(options.modals).css({ position: 'fixed' });
          _marginTop = -modal.outerHeight() / 2;
          if (options.alignTop) {
            _marginTop = 0;
            _top = options.top;
          }
        } else {
          _marginTop = -modal.outerHeight() / 2 + win.scrollTop();
        }
      }
      $(options.modals).css({
        marginTop: _marginTop,
        marginLeft: _marginLeft,
        top: _top,
      });
    }
    // PUBLIC FUNCTIONS
    this.open = function () {
      openModal();
    };
    this.close = function () {
      closeModal();
    };
    return this;
  };
})(jQuery);
