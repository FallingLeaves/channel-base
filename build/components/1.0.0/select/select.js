define("undefined/mtd/pc/components/1.0.0/select/select.js",[],function(){"use strict";var e=_.Class.extend({construct:function(e){$.extend(this,{$container:null},e),this.init(),this.$container.hide()},init:function(){this.createSelect(),this.initEvent(),this.keyboard()},createSelect:function(){var e=this.$container;if(this.checkCreate()){e.after($("<div></div>").addClass("o2-select").addClass(e.attr("class")||"").addClass(e.attr("disabled")?"disabled":"").html('<span class="current"></span><ul class="list"></ul>'));var t=e.next(),s=e.find("option"),n=e.find("option:selected");t.find(".current").html(n.text()),s.each(function(){var e=$(this);t.find("ul").append($("<li></li>").attr("data-value",e.val()).addClass("option"+(e.is(":selected")?" selected":"")+(e.is(":disabled")?" disabled":"")).html(e.text()))})}},checkCreate:function(){return!this.$container.next().hasClass("o2-select")},initEvent:function(){var e=this.$container.next(".o2-select");this.$container.bind("o2Select:setValue",$.proxy(this.selectEvent,this)),e.bind("click.o2_select",this.openOrClose),$(document).bind("click.o2_select",this.close),e.find(".option:not(.disabled)").bind("click.o2_select",this.selectOption),$(document).unbind("keydown")},selectEvent:function(){var e=this.$container.val(),t=this.$container.next(),s=t.find("li");return s.each(function(){if($(this).data("value")==e){t.find(".selected").removeClass("selected"),$(this).addClass("selected");var s=$(this).text();t.find(".current").text(s)}}),!1},openOrClose:function(e){var t=$(this);return t.hasClass("o2-select")||(t=t.parent()),$(".o2-select").not(t).removeClass("open"),t.toggleClass("open"),t.hasClass("open")?(t.find(".focus").removeClass("focus"),t.find(".selected").addClass("focus")):t.focus(),!1},close:function(e){return e.stopPropagation(),0==$(e.target).closest(".o2-select").length&&$(".o2-select").removeClass("open"),!1},selectOption:function(e){e.stopPropagation();var t=$(e.target);if("LI"==t.get(0).tagName){var s=t.closest(".o2-select").removeClass("open");s.find(".selected").removeClass("selected"),t.addClass("selected");var n=t.text();s.find(".current").text(n),s.prev("select").val(t.data("value")).trigger("change")}return!1},setSelect:function(e){function t(e,t){e.addClass("selected");var s=e.text();t.find(".current").text(s),t.prev("select").val(e.data("value")).trigger("change")}var s=e.val||e.text;if(s){var n=this.$container.next(".o2-select"),i=n.find(".option");n.find(".selected").removeClass("selected"),e.val?i.each(function(){$(this).data("value")==s&&t($(this),n)}):i.each(function(){$(this).text()==s&&t($(this),n)}),e.cb&&e.cb()}},update:function(){var e=this.$container.next(".o2-select"),t=e.hasClass("open");e.length&&(e.remove(),this.init(),t&&this.$container.next().trigger("click"))},destroy:function(){var e=this.$container.next(".o2-select");e.length&&e.remove()},keyboard:function(e){var t=this;$(document).bind("keydown",function(e){var s=$(".o2-select.open"),n=$(s.find(".focus")||s.find(".list .option.selected"));switch(e.keyCode){case 32:case 13:t.spaceEnterKey(s,n);break;case 40:t.downKey(s,n);break;case 38:t.upKey(s,n);break;case 27:t.escKey(s);break;case 9:t.tabKey(s)}})},spaceEnterKey:function(e,t){return e.hasClass("open")?t.trigger("click"):e.trigger("click"),!1},downKey:function(e,t){return e.hasClass("open")?t.next().length>0&&(e.find(".focus").removeClass("focus"),t.next().addClass("focus")):e.trigger("click"),!1},upKey:function(e,t){return e.hasClass("open")?t.prev().length>0&&(e.find(".focus").removeClass("focus"),t.prev().addClass("focus")):e.trigger("click"),!1},escKey:function(e){e.hasClass("open")&&e.trigger("click")},tabKey:function(e){if(e.hasClass("open"))return!1}});return e});