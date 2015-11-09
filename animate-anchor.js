;(function($, window, document, undefined) {
	"use strict";
	var id = 42137,
		defaults = {
			offset: 75,
			header: '',
			duration: 800,
			easing: 'swing',
			afterScroll: $.noop
		};
	function AnimateAnchor(element, options) {
		this._id = id++;
		this.element = element;
		this.target = $($(element).attr('href'))[0];
		this._defaults = defaults;
		this.settings = $.extend({}, defaults, options);
		this.init();
	}
	AnimateAnchor.prototype = {
		anchorTo: function() {
			alert('anchor to function');
		},
		init: function() {
			var elem = $(this.element),
				settings = this.settings,
				target = $(this.target),
				location = window.location,
				afterScrollHandle = function(e) {
					var elem = this;
					console.log(elem);
					elem.trigger('afterScroll.aa');
				},
				doDefault = false;

			elem.on('afterScroll.aa', function(e) {
				settings.afterScroll(e);
				doDefault = true;
				elem.trigger('click');
			});
			elem.on('click', function(e) {
				e.stopPropagation();
				e.preventDefault();
				if (!doDefault) {
					var offset = settings.offset;
					if ($(settings.header).length > 0) {
						offset = $(settings.header).height() + offset;
					}
					$('html, body').stop().animate({
						scrollTop: target.offset().top - parseInt(offset, 10)
					}, settings.duration, settings.easing).promise().done($.proxy(afterScrollHandle, elem));

				} else {
					doDefault = false;
					var targetID = target.prop('id');
					target.prop('id', '');
					location.hash = elem.attr('href');
					target.prop('id', targetID);
					// this.anchorTo();
				}
			});
		}
	};

	$.fn['animateAnchor'] = function(options) {
		return this.each(function() {
			if (!$.data(this, "animateAnchor_42137")) {
				$.data(this, "animateAnchor_42137", new AnimateAnchor(this, options));
			}
		});
	};

})(jQuery, window, document);
$(document).ready(function() {
	$('[data-animate="anchor"]').each(function() {
		var elem = $(this),
			offset = elem.data('offset-top'),
			header = elem.data('animate-header'),
			duration = elem.data('animate-duration'),
			easing = elem.data('animate-easing'),
			options = {};
		if (offset !== undefined && offset !== null && offset !== '') {
			options.offset = offset;
		}
		if (header !== undefined && header !== null && header !== '') {
			options.header = header;
		}
		if (duration !== undefined && duration !== null && duration !== '') {
			options.duration = duration;
		}
		if (easing !== undefined && easing !== null && easing !== '') {
			options.easing = easing;
		}
		elem.animateAnchor(options);
	});
	setTimeout(function() {
		if (window.location.hash !== '') {
			var hash = window.location.hash,
				target = $(hash),
				elem = $('a[href="' + hash + '"]');

			console.log(elem);

			if (elem.length > 0) {
				var offset = elem.data('offset-top');
				if (offset === undefined || offset === null || offset === '') {
					offset = 75;
				}
				elem.animateAnchor({
					offset: offset
				});
			}
		}
	}, 1000);
});
