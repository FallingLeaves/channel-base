define(function (require) {
  'use strict';
  // 给html标签打上频道类名，主要用作重置头部样式
  var o2AppName = pageConfig.o2AppName || '';
  if(o2AppName !== '') {
    $('html').addClass(o2AppName);
  }
  // console 输出
  var o2console = require('o2console');
  o2console.consoleConfigFunc();
  // 加载主站头部公共脚本
	require.async(['jdf/1.0.0/unit/globalInit/5.0.0/globalInit.js', 'jdf/1.0.0/unit/category/2.0.0/category.js', '//static.360buyimg.com/mtd/pc/components/1.0.0/lazyload/lazyload.js'], function(globalInit, category, lazyload) {
    globalInit();
    category({
      type: 'mini',
      mainId: '#categorys-mini',
      el: '#categorys-mini-main'
    });
    var localTemplates = {};
    // 绑定渲染事件
    $('body').o2lazyload().bind('render', '.o2data-lazyload', function(e, result) {
      var content = '';
      var self = $(e.target);
      var dataId = self.data('id');
      var script = self.data('script') || '';
      var _data = window.data[dataId] || {};
      if (localTemplates[dataId]) {
        content = localTemplates[dataId];
      } else {
        var template = self.find('[type="text/template"]');
        if (typeof result === 'object') {
          content = result.dom;
        } else {
          content = template.html();
        }
        localTemplates[dataId] = content;
      }
      // 加载模板引擎
      var o2tpl = require('o2tpl');
      try {
        var html = o2tpl(content, _data);
        self.html(html);
        setTimeout(function() {
          //触发脚本
          self.trigger('done');
          '' !== script && (new Function(script)).call(self);
          $(window).trigger('resize');
        },0);
      } catch (e) {
        console.log(e);
      }
    });
    // 楼层懒加载逻辑
    var o2widgetLazyload = require('o2widgetLazyload');
    window.o2widgetLazyload = new o2widgetLazyload();
    // 图片处理
    if ('undefined' === typeof pageConfig.processImageUrl) {
       pageConfig.processImageUrl = function (imageUrl, retina, normal) {
        if (!imageUrl) {
          return '';
        }
        var imgResize = pageConfig.isRetina ? '/s' + retina + '_jfs/' : '/s' + normal + '_jfs/';
        imageUrl = imageUrl.replace(/http(s?):/, '');
        return imageUrl.replace(/http(s?):/, '').replace(/\/[^/]*?jfs\//, function () {
        return imgResize;
        });
      };
    }
  });
});
