define('o2widgetLazyload', function(require, exports, module) {
	'use strict';
	return function(options) {
		var conf = {
			cls: 'o2data-lazyload',
			scrollEvent: 'scroll.lazydata resize.lazydata'
		};
		/**
		 * @desc o2JSConfig 异步模板配置
		 *
		 */
		var o2JSConfig = window.pageConfig ? window.pageConfig.o2JSConfig : {};
		o2JSConfig = o2JSConfig || {};
		$.extend(conf, options);
		//本地存储库
		var store = require('store');
		var init = function() {
			var scrollTimer = null;
			var isIE = !!window.ActiveXObject || navigator.userAgent.indexOf("Trident") > 0;
			$(window).bind(conf.scrollEvent, function(e) {
				clearTimeout(scrollTimer);
				scrollTimer = setTimeout(function() {
					/**
					 * @desc preloadOffset 可视区域阀值，用作提前渲染楼层
					 *
					 */
					var preloadOffset = isIE ? 1000 : 500;
					var st = $(document).scrollTop(),
						wh = $(window).height() + preloadOffset,
						cls = conf.cls,
						items = $('.' + cls);

					items.each(function() {
						var self = $(this),
							rel = self.data('rel') || this,
							item = $(rel),
							content = self.html(),
							tplId = self.data('tpl'),
							dataAsync = typeof self.data('async') === 'string',
							forceRender = typeof self.data('forcerender') === 'boolean' ? self.data('forcerender') : false,
							tplPath = null;
						/**
						 * @desc 可视区域渲染模板，根据tplVersion从localstorage读取模板，IE浏览器直接异步加载。
						 * data-tpl {string} 模板ID
						 * data-async {boolean} 是否同步渲染，即渲染模板前进行 beforerender 事件处理，回调后再渲染模板
						 * data-forcerender {boolean} 强制渲染，用作某些需要直接渲染的楼层
						 * data-rel {string|object} 参考渲染对象，默认是本身
						 */

						//判断是否是在可视区域 || 是否强制渲染
						if (forceRender || (item.offset().top - (st + wh) < 0 && item.offset().top + item.outerHeight(true) >= st)) {

							if (tplId && o2JSConfig.pathRule) {
								tplPath = o2JSConfig.pathRule(tplId);
								if (isIE || !store.enabled) {
									seajs.use(tplPath, function(result) {
										if (dataAsync) {
											self.html(content).removeClass(conf.cls).trigger('beforerender', function() {
												self.removeClass('lazy-fn').trigger('render', result);
											});
										} else {
											self.html(content).removeClass(conf.cls).removeClass('lazy-fn').trigger('render', result);
										}
									});
								} else {
									var tplStorage = store.get(tplPath);
									if (!tplStorage || tplStorage.version !== window.tplVersion[tplId]) {
										seajs.use(tplPath, function(result) {
											store.set(tplPath, result);
											if (dataAsync) {
												self.html(content).removeClass(conf.cls).trigger('beforerender', function() {
													self.removeClass('lazy-fn').trigger('render', result);
												});
											} else {
												self.html(content).removeClass(conf.cls).removeClass('lazy-fn').trigger('render', result);
											}
										});
									} else {
										if (dataAsync) {
											self.html(content).removeClass(conf.cls).trigger('beforerender', function() {
												self.removeClass('lazy-fn').trigger('render', tplStorage);
											});
										} else {
											self.html(content).removeClass(conf.cls).removeClass('lazy-fn').trigger('render', tplStorage);
										}
									}
								}
							} else {
								if (dataAsync) {
									self.html(content).removeClass(conf.cls).trigger('beforerender', function() {
										self.removeClass('lazy-fn').trigger('render');
									});
								} else {
									self.html(content).removeClass(conf.cls).removeClass('lazy-fn').trigger('render');
								}
							}
						}
					});

					if (0 === items.length) {
						$(window).unbind(conf.scrollEvent);
					}
				}, 200);
			}).trigger(conf.scrollEvent.split(' ')[0]);
		};
		init();
	};
});