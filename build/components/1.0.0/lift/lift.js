define("undefined/mtd/pc/components/1.0.0/lift/lift.js",[],function(){"use strict";var i=_.Class.extend({construct:function(i){this.config={$container:null,$backTop:null,floorListHook:".JS_floor",liftListHook:".JS_lift",itemSelectedClassName:"",startShowPosition:0,scrollDelay:200,speed:800},i&&$.extend(this.config,i),this.init()},init:function(){this.$window=$(window),this.WIN_W=this.$window.width(),this.WIN_H=this.$window.height(),this.DOC_H=$(document).height(),this.timer=null,this.scrollTimer=null,this.$floorList=$(this.config.floorListHook),this.$liftList=this.config.$container.find(this.config.liftListHook),this.checkRun()},checkRun:function(){var i=this.config;null!=i.$container&&0!=this.$floorList.length&&0!=this.$liftList.length&&this.start()},start:function(){this.bindEvents()},getFloorInfo:function(){var i=[];return this.$floorList.length>0?(this.$floorList.each(function(){i.push($(this).offset().top)}),i):null},bindEvents:function(){var i=this.config,t=i.$backTop,o=this;o.$window.bind("scroll.lift",$.proxy(o.lift,o)),i.$container.delegate(i.liftListHook,"click.lift",{thisObj:o},o.liftJump),null!==t&&t.length>0&&t.bind("click.backTop",$.proxy(o.backTop,o))},backTop:function(){var i=this,t=i.config;return i.$window.unbind("scroll.lift"),$("body,html").stop().animate({scrollTop:0},t.speed,function(){i.$window.bind("scroll.lift",$.proxy(i.lift,i)),i.$liftList.removeClass(t.itemSelectedClassName)}),!1},lift:function(){var i=this,t=i.config;clearTimeout(i.timer),clearTimeout(i.scrollTimer),i.scrollTimer=setTimeout(function(){var o=i.$window.scrollTop(),s=t.itemSelectedClassName;o>=t.startShowPosition?(t.$container.fadeIn(),$.each(i.getFloorInfo(),function(n,l){o>=l-i.WIN_H/2+5?i.$liftList.eq(n).addClass(s).siblings(t.liftListHook).removeClass(s):o>=i.DOC_H-i.WIN_H/2-5&&i.$liftList.eq(n).addClass(s).siblings(t.liftListHook).removeClass(s),o<i.getFloorInfo()[0]-i.WIN_H/2&&i.$liftList.removeClass(s)})):t.$container.fadeOut()},t.scrollDelay)},liftJump:function(i){var t=i.data.thisObj,o=t.config;clearTimeout(t.timer),$(this).addClass(o.itemSelectedClassName).siblings(o.liftListHook).removeClass(o.itemSelectedClassName),t.$window.unbind("scroll.lift"),$("body,html").stop().animate({scrollTop:t.getFloorInfo()[$(this).index(o.$container.selector+" "+o.liftListHook)]},o.speed,function(){t.timer=setTimeout(function(){t.$window.bind("scroll.lift",$.proxy(t.lift,t))},50)})}});return i});