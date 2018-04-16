define("o2ModXinrenBottom",function(require){
  var consumeDomains = [
      '//hbc.jd.com',
      '//beauty.jd.com',
      '//food.jd.com',
      '//baby.jd.com',
      '//toy.jd.com',
      '//pet.jd.com',
      '//gardening.jd.com',
      // '//channel.jd.com/hbc.html',
      // '//channel.jd.com/beauty.html',
      '//channel.jd.com/food.html',
      '//channel.jd.com/baby.html',
      // '//channel.jd.com/toy.html',
      '//channel.jd.com/pet.html',
      '//channel.jd.com/1320-1585.html',
      '//channel.jd.com/1319-1523.html',
      '//channel.jd.com/1319-1525.html'
  ]
  var freshDomains = [
      '//fresh.jd.com'
      // '//channel.jd.com/fresh.html'
  ]
  var clothesDomains = [
      '//shechi.jd.com'
      // '//channel.jd.com/shechi.html'
  ]
  var domains = consumeDomains.concat(freshDomains, clothesDomains);
  var productLineIds = {
      consume: '0017',
      fresh: '0018',
      clothes: '0019'
  }
  var href = window.location.href.replace(/^http(s)?:/,'');
  var whichDomain;
  var patt;
  for (var i = 0; i < domains.length; i++) {
      patt = new RegExp(domains[i]);
      if (patt.test(href)) {
          whichDomain = i;
          require.async(['//static.360buyimg.com/mtd/pc/xinren/2.0.0/mod_xinren_bottom/mod_xinren_bottom.min.js', '//static.360buyimg.com/mtd/pc/xinren/2.0.0/mod_xinren_bottom/mod_xinren_bottom.min.css'], function (modXinrenBottom) {
              var consumeDomainsLen = consumeDomains.length;
              var freshDomainsLen = freshDomains.length;
              var clothesDomainsLen = clothesDomains.length;
              var productLineId
              // It is related to the order of concat
              if (whichDomain < consumeDomainsLen) {
                  productLineId = productLineIds.consume;
              } else if (whichDomain < (consumeDomainsLen + freshDomainsLen)) {
                  productLineId = productLineIds.fresh;
              } else {
                  productLineId = productLineIds.clothes;
              }
              new modXinrenBottom({
                  productLineId: productLineId
              })
          });
          break;
      }
  }
})
seajs.use('o2ModXinrenBottom');
