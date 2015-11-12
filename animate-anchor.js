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
	$.extend(AnimateAnchor.prototype, {
		afterScrollHandle: function(e) {
			var elem = this;
			elem.trigger('afterScroll.aa');
		},
		jump: function() {
			var elem = $(this.element),
				settings = this.settings,
				offset = settings.offset,
				header = $(settings.header),
				target = $(this.target);
			if (header.length > 0) {
				offset = header.height() + offset;
			}
			$('html, body').stop().animate({
				scrollTop: target.offset().top - parseInt(offset, 10)
			}, settings.duration, settings.easing).promise().done($.proxy(self.afterScrollHandle, elem));
		},
		init: function() {
			var self = this,
				elem = $(this.element),
				settings = this.settings,
				target = $(this.target),
				location = window.location;

			elem.on('afterScroll.aa', function(e) {
				settings.afterScroll(e);
			});
			elem.on('click', function(e) {
				e.preventDefault();
				var targetID = target.prop('id');
				target.prop('id', '');
				location.hash = elem.attr('href');
				target.prop('id', targetID);
				self.jump();
			});
		}
	});

	$.fn['animateAnchor'] = function(options) {
		var args = Array.prototype.slice.call(arguments, 1),
			fnList = ['jump'];
		if ($.data(this[0], 'animateAnchor_42137') && typeof(options) === 'string') {
			if ($.inArray(options, fnList) !== -1) {
				return $.data(this[0], 'animateAnchor_42137')[options](args);
			} else {
				throw "Function do not exists";
			}
		}
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
	if (window.location.hash !== '') {
		var hash = window.location.hash,
			target = $(hash),
			elem = $('a[href="' + hash + '"]');
		elem.animateAnchor('jump');
	}
});
