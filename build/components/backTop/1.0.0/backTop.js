define("//static.360buyimg.com/mtd/pc/components/backTop/1.0.0/backTop.js",[],function(){"use strict";var o=_.Class.extend({construct:function(o){$.extend(this,{backTopElement:null,startShowPosition:0,delay:50,speed:500},o),this.init()},init:function(){this.$backTop=$(this.backTopElement),this.$window=$(window),this.scrollTimer=null,this.checkRun()},checkRun:function(){null!=this.$backTop&&0!=this.$backTop.length&&this.start()},start:function(){this.initEvent()},initEvent:function(){var o=this,i=o.$backTop;o.$window.bind("scroll.winScroll",$.proxy(o.winScroll,o)),i.bind("click.backTop",$.proxy(o.backToTop,o))},ifShow:function(){var o=this,i=o.$window.scrollTop();i>=o.startShowPosition?o.$backTop.fadeIn():o.$backTop.fadeOut()},backToTop:function(){var o=this;return o.$window.unbind("scroll.winScroll"),$("body,html").stop().animate({scrollTop:0},o.speed,function(){o.ifShow(),o.$window.bind("scroll.winScroll",$.proxy(o.winScroll,o))}),!1},winScroll:function(){var o=this;o.$backTop;clearTimeout(o.scrollTimer),o.scrollTimer=setTimeout(function(){o.ifShow()},o.delay)}});return o});