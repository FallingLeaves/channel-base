define("//static.360buyimg.com/mtd/pc/components/countdown/1.0.0/countdown.js",[],function(t){"use strict";var e=_.Class.extend({construct:function(t){var e={startTime:new Date,endTime:new Date,state:1,interval:1e3,stateCallback:null,autoStart:!0,stateMap:{0:{name:"已结束"},1:{name:"未开始"},2:{name:"进行中"}},timer:null};$.extend(this,e,t||{}),this.autoStart&&this.init()},init:function(){this.start()},start:function(){this.update(+new Date-this.interval)},pause:function(){this.timer&&clearTimeout(this.timer)},update:function(t){var e=+new Date,a=e-t,i=[],n=this,s=this.startTime,r=this.endTime,o=this.interval,h=o+(o-a);"[object Array]"!==Object.prototype.toString.call(s)&&(s=[s],r=[r]);for(var u=0,c=s.length;u<c;u++){var l,m=new Date(s[u]).getTime(),d=new Date(r[u]).getTime();m>e&&(l=1),d<e&&(l=0),e>m&&e<d&&(l=2);var p=2==l?d-e:m-e,f=this.pad(Math.floor(p/36e5%24),2),v=this.pad(Math.floor(p/1e3/60%60),2),w=this.pad(Math.floor(p/1e3%60),2),T=this.pad(Math.floor(p/100%10),1),M=this.pad(Math.floor(p/864e5),2),b={hour:f,minute:v,second:w,millisecond:T,day:M,state:l,current:n.stateMap[l]};i.push(b)}this.stateCallback&&this.stateCallback(1===i.length?i[0]:i),this.timer=setTimeout($.proxy(this.update,this,e),h<0?0:h)},pad:function(t,e){return(Array(e).join(0)+t).slice(-e)}});return e});