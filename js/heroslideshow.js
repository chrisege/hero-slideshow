
/*
	hero-slideshow
	by Chris Ege, WTTW-11

	plugin structure based on jQuery Boilerplate
	(http://jqueryboilerplate.com/)
*/

;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "heroSlideshow",
        defaults = {
            slideClass: ".slide",
            navClass: '.slideNav li'
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
		this.$element = $(element);
		this.originalHeight = $(element).height();
		this.activeSlide = 0;
		
        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
			var parent = this;
			
			//trigger onResize once to get everything into place.
            this.onResize();
			
			//trigger a second onResize a second later to fix small-height bug
			// TODO: find a less-hacky way to deal with this bug.
			setTimeout(function(){
				parent.onResize();
			}, 1000);

			this.$element.find(this.options.slideClass).each(function(){
				
				// preload all images. 
				// this way, only the first image is loaded with the initial page load
				// and the requests for the remaining images get pushed to the end of the queue
				// in theory this should speed up page loads
				// also, preloadImages can probably be written to serve smaller assets to 
				// phones, etc.
			
				parent.preloadImages($(this));
				
				if (!parent.supportsTransitions() && ($(this).index() != 0)) {
					
				}
			});
			
			if (!this.supportsTransitions()) {
				var otherSlides = this.$element.find('.slide:not(.active)');
				otherSlides.css({
					'position':'absolute',
					'left': this.$element.width()
				});
			}
			
			$(window).resize(function(){
				parent.onResize();
			});
			
			$('.forward').click(function(e){
				e.preventDefault();
				parent.cycle('forward');
			});
			
			$('.reverse').click(function(e){
				e.preventDefault();
				parent.cycle('reverse');
			});
			
			$(this.options.navClass).click(function(){
				parent.goToSlide($(this).index());
			});
			

        },

		cycle: function(direction) {
			var length = this.$element.find(this.options.slideClass).length;
			
			if (direction === 'forward') {
				var index = (this.activeSlide < length-1) ? this.activeSlide+1 : 0;
			} else if (direction === 'reverse') {
				var index = (this.activeSlide != 0) ? this.activeSlide-1 : length-1;
			}
			
			this.goToSlide(index);
		},

		goToSlide: function(index) {

			var slide = this.$element.find('.active'), // should be rewritten to use this.activeSlide
				nextSlide = this.$element.find(this.options.slideClass+' :eq('+index+')'),
				nav = $(this.options.navClass),
				activeNav = $(this.options.navClass+'.active'),
				nextNav = $(this.options.navClass+' :eq('+index+')');


			activeNav.removeClass('active');
			nextNav.addClass('active');
			this.activeSlide = index;
				
			
			if (this.supportsTransitions()) {
				//for CSS3-capable browsers, define your transition behavior in the stylesheet

				slide.removeClass('active');
				nextSlide.addClass('active');	
			} else {
				//fallback for IE and others without CSS3
				//
				var otherSlides = this.$element.find(this.options.slideClass+':not(.active)');
				var captions = this.$element.find('.caption');
				captions.animate({'left':-400});
				slide.css({'position':'absolute', 'left': 0, 'z-index': 2});
				otherSlides.css({
					'position':'absolute',
					'z-index': 1,
					'left': this.$element.width()
				});
						
				slide.fadeOut('slow');
				nextSlide.addClass('active').fadeIn('slow');
				nextSlide.find('.caption').animate({'left': 0});
				
				slide.queue(function(){
					$(this).removeClass('active');
					$(this).dequeue();
				});
			}
			this.onResize();
		},
		
		// feed this a selector
		preloadImages: function(element){
			var parent = this;

			// check for retina displays
			var pixelRatio = !!window.devicePixelRatio ? window.devicePixelRatio : 1;

			element.find('img').each(function(){
				var $el = $(this);
				var loaded = $el.data('loaded');
				var original = $el.data('original');
				
				// TODO: make the image directories into plugin config parameters.
				if ((parent.pixelRatio > 1 && window.innerWidth > 700) || (window.innerWidth > 900)){
					original = '/sites/default/files/styles/tenbuildings_hero/public/tenbuildings/'+original;
				} else {
					original = '/sites/default/files/styles/tenbuildings_hero_mobile/public/tenbuildings/'+original;
				}

				if (original && (loaded != true)) {
					$el.attr('src', original);
				}
				
				$el.data('loaded', true);
			});
		},
		
		//  check to see if browser supports CSS3 Transitions
		supportsTransitions: function(){
			var b = document.body || document.documentElement;
			var s = b.style;
			var p = 'transition';
			if(typeof s[p] == 'string') {return true; }

			// Tests for vendor specific prop
			v = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'];
			p = p.charAt(0).toUpperCase() + p.substr(1);
			for(var i=0; i<v.length; i++) {
				if(typeof s[v[i] + p] == 'string') { return true; }
			}
			return false;
		},
		
        onResize: function(){
	
			// logic to make everything on the active slide be in the right place
			// controls placement of image within container, placement of caption, etc.
			// gets run on init, but also needs to be run on window.resize, hence the name.
			
			var	slide = this.$element.find('.active'),
				lowerCaption = this.$element.find('.lower-caption'),
				img = $(slide).find('img'),
				imgRatio = (img.height() / img.width());
				
			if (((img.height() - this.originalHeight) < 0)) {
				this.$element.height(img.height());
			} else {
				this.$element.height(this.originalHeight);
			}
		
			var marginLeft = ($('.hero-ctn').width() - $('.container').width())/2;


			slide.find('.caption').children().css('padding-left', marginLeft+'px');

			slide.css({
				'position': 'absolute',
				'left': 0,
			});

			lowerCaption.css({
				'margin-bottom': (img.height() - this.$element.height())/2,
				'padding-left': marginLeft,
				'padding-right': marginLeft,
				'width': ($(window).width() - (marginLeft*2))+'px'
			});

			img.css({
				'margin-top': (img.height() - this.$element.height())/2*-1,
			});
		}
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );