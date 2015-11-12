/*!
 * Morphist - Generic Rotating Plugin for jQuery
 * https://github.com/MrSaints/Morphist
 *
 * Built on jQuery Boilerplate
 * http://jqueryboilerplate.com/
 *
 * Copyright 2014 Ian Lai and other contributors
 * Released under the MIT license
 * http://ian.mit-license.org/
 */

/*eslint-env browser */
/*global jQuery:false */
/*eslint-disable no-underscore-dangle */

(function ($) {
    "use strict";

    var pluginName = "Morphist",
        defaults = {
            animateIn: "bounceIn",
            animateOut: "rollOut",
            speed: 2000
        };

    function Plugin (element, options) {
        this.element = $(element);

        this.settings = $.extend({}, defaults, options);		
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function () {
            this.children = this.element.children();
            this.element.addClass("morphist");
            //this.index = -1;
			if (this.settings.index != undefined)
				this.index = this.settings.index
			else
				this.index = -1;
			
            this.cycle();			
			this.pause = false;			
        },
		reload:function() {
			this.children = this.element.children();
		},
		stop:function() {			
			this.pause = true;			
		},
		start:function() {	
			var $that = this;
			this.pause = false;				
		},
        animate: function () {			
            var $that = this;
			
			if (!this.pause) {			
				++this.index;
				this.prev = this.index;
			}				
				this.children.eq(this.index).addClass("animated " + this.settings.animateIn);		
			
				setTimeout(function () {				
						$that.cycle();
				}, this.settings.speed);
			
			
        },
        cycle: function () {
            var $that = this;			
			
				if ((this.index + 1) === this.children.length) {
					this.index = -1;
				}

				if (typeof this.prev !== "undefined" && this.prev !== null) {
					var obj = this.children.eq(this.prev);					
						obj.removeClass(this.settings.animateIn)
						if (!this.pause) {						
							obj.addClass(this.settings.animateOut)
						
							obj.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
								$(this).removeClass();
								$that.animate();
							});	
						} else {
							$that.animate();
						}
					return;
				}
			 

            this.animate();
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function() {			
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };
})(jQuery);