/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 */

;(function($) {

  $.fn.unveil = function(options, callback) {

    var $w = $(window),
        defaults = {
          threshold: 0,
          throttle: 0,
          container: $w
        },
        retina = window.devicePixelRatio > 1,
        attrib = retina ? "data-src-retina" : "data-src",
        images = this,
        loaded,
        timer,
        vh,
        oc = options.container;

    if (oc && (!oc.size || !oc.size())) throw "Invalid container";
    options = $.extend(defaults, options);
    
    this.one("unveil", function() {
      var source = this.getAttribute(attrib);
      source = source || this.getAttribute("data-src");
      if (source) {
        this.setAttribute("src", source);
        if (typeof callback === "function") callback.call(this);
      }
    });

    function onResize() {
      wh = $w.height();
      unveil();
    }

    function filterImages() {
      var inview = images.filter(function() {
        var $e = $(this);
        if ($e.is(":hidden")) return;

        if (!vh) vh = options.container.height();

        var vt = oc ? 0 : options.container.scrollTop(),
        	vb = vt + vh,
        	et = $e.offset().top - (oc ? options.container.offset().top : 0),
        	eb = et + $e.height();

        return eb >= vt - options.threshold && et <= vb + options.threshold;
      });

      loaded = inview.trigger("unveil");
      images = images.not(loaded);
    }

    function unveil() {
      if (options.throttle) {
          clearTimeout(timer);
          timer = setTimeout(function () {
            filterImages();
          }, options.throttle);
      } else {
        filterImages();
      }
    }

    if (!oc) $w.resize(unveil);
    options.container.scroll(unveil);

    filterImages();

    return this;

  };

})(window.jQuery || window.Zepto);
