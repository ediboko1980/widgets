
(function($) {
	// Default styling

	var defaults = {
		circular: false,
		speed: 5000,
		duration: 700,
		minWidth: 250,
		moveAmount: 0,
		autoPlay: false,
		useCss : true
	};

	if ($.zepto) {
		defaults.easing = 'ease-in-out';
	}
	// console.log (defaults);

	var css = {
		viewport: {
			'width': '100%', // viewport needs to be fluid
			// 'overflow': 'hidden',
			'position': 'relative'
		},

		pane_stage: {
			'width': '100%', // viewport needs to be fluid
			'overflow': 'hidden',
			'position': 'relative'
		},

		pane_slider: {
			'width': '0%', // will be set to (number of panes * 100)
			'list-style': 'none',
			'position': 'relative',
			'overflow': 'hidden',
			'padding': '0',
			'left':'0'
		},

		pane: {
			'width': '0%', // will be set to (100 / number of images)
			'position': 'relative',
			'float': 'left'
		}
	};

	var Carousel = function (item, options) {
		this.init (item, options);
	};

	$.extend(Carousel.prototype,{
		current_position:0,
		animating:false,
		timeout:null,

		init : function (item, options) {
			// console.log('init');

			var that = this;

			this.options = options;

			this.$item = $(item);
			this.$viewport = this.$item; // <div> slider, known as $viewport

			this.$panes = this.$viewport.children();
			this.$panes.detach();

			this.$pane_stage = $('<div class="ctr-carousel-stage"></div>').appendTo(this.$viewport);
			this.$pane_slider = $('<div class="ctr-carousel-slider"></div>').appendTo(this.$pane_stage);
			// this.$pane_slider = this.$item;

			this.$panes.appendTo(this.$pane_slider);

			this.$viewport.css(css.viewport); // set css on viewport
			this.$pane_slider.css( css.pane_slider ); // set css on pane slider
			this.$pane_stage.css( css.pane_stage ); // set css on pane slider

			this.update ();
			this.addControls();

			$(window).smartresize(function () {
				that.resize();
				that.move (that.current_position, false);

				// reset animation timer
				if (that.options.autoPlay) {
					that.animate();
				}
			})
		},

		update : function () {
			this.$panes = this.$pane_slider.children(); // <li> list items, known as $panes
			this.NUM_PANES = this.options.circular ? (this.$panes.length + 1) : this.$panes.length;

			if (this.NUM_PANES > 0) {
				this.resize();

				if (!this.animating) {
					if (this.options.autoPlay) {
						this.animate();
					}
				}
			}
		},

		add : function ($els) {
			this.$pane_slider.append($els);
			this.$panes = this.$pane_slider.children();
		},

		resize: function () {
			// total panes (+1 for circular illusion)
			var PANE_WRAPPER_WIDTH = (this.NUM_PANES * 100) + '%'; // % width of slider (total panes * 100)

			this.VIEWPORT_WIDTH = this.$viewport.width();
			this.PANES_VISIBLE = Math.floor(this.VIEWPORT_WIDTH/this.options.minWidth);

			this.$pane_slider.css({width: PANE_WRAPPER_WIDTH}); // set css on pane slider

			this.PANE_WIDTH = (this.VIEWPORT_WIDTH/this.PANES_VISIBLE);

			var that = this;

			this.$panes.each(function (index) {
				$(this).css( $.extend(css.pane, {width: that.PANE_WIDTH+'px'}) );
			});
		},

		destroy: function () {

		},

		animate : function () {
			this.animating = true;
			var that = this;
			clearTimeout(this.timeout);
			this.timeout = setTimeout(function () {
				that.next();
			}, this.options.speed);
		},

		next : function () {
			var move = this.options.moveAmount ? this.options.moveAmount : this.PANES_VISIBLE ;
			this.move(this.current_position + move, false);
		},

		prev : function () {
			var move = this.options.moveAmount ? this.options.moveAmount : this.PANES_VISIBLE ;
			this.move(this.current_position - move, false);
		},

		move : function (i, noAnimate) {

			this.current_position = i;

			var left = this.PANE_WIDTH * this.current_position;
			var max = (this.PANE_WIDTH * this.NUM_PANES) - this.VIEWPORT_WIDTH;

			// console.log(left+":"+max);

			if (left < 0) {
				this.currentLeft = 0;
			} else if (left > max) {
				this.currentLeft = max;
			} else {
				this.currentLeft = left;
			}

			if (noAnimate) {
				this.$pane_slider.css(
					{
						left: ((0 - this.currentLeft) + 'px')
					});
			} else {
				var that = this;
				var options = {
					duration: this.options.duration,
					complete: function () {
						that.moveComplete();
					}
				};
				if (this.options.easing) {
					options.easing = this.options.easing;
				}
				this.$pane_slider.animate(
					{
						left: ((0 - this.currentLeft) + 'px')
					},
					options
				);
			}
		},

		moveComplete : function () {

			// circular illusion: reset to first slide without user noticing
			// var max = (this.PANE_WIDTH * this.NUM_PANES) - this.VIEWPORT_WIDTH;
			//  if (this.currentLeft >= max) {
			// 	this.$pane_slider.css({left:0});
			// 	this.current_position = 0;
			// 	this.currentLeft = 0;
			// }

			this.$item.trigger('curatorCarousel:changed', [this, this.current_position]);

			this.animate ();
		},

		addControls : function () {
			this.$viewport.append('<button type="button" data-role="none" class="slick-prev slick-arrow" aria-label="Previous" role="button" aria-disabled="false">Previous</button>');
			this.$viewport.append('<button type="button" data-role="none" class="slick-next slick-arrow" aria-label="Next" role="button" aria-disabled="false">Next</button>');

			this.$viewport.on('click','.slick-prev', this.prev.bind(this));
			this.$viewport.on('click','.slick-next', this.next.bind(this));
		},

		method : function () {
			var m = arguments[0];
			// var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
			if (m == 'update') {
				this.update();
			} else if (m == 'add') {
				this.add(arguments[1]);
			} else if (m == 'destroy') {
				this.destroy();
			} else {

			}
		}
	});

	var carousels = {};
	function rand () {
		return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
	}

	$.extend($.fn, { 
		curatorCarousel: function (opts) {
			var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
			var options = $.extend([], defaults, opts);

			$.each(this, function(index, item) {
				var id = $(item).data('carousel');

				if (carousels[id]) {
					carousels[id].method.apply(carousels[id], args);
				} else {
					id = rand();
					carousels[id] = new Carousel(item, options);
					$(item).data('carousel', id);
				}
			});

			return this;
		}
	});
})($);
