define('ajax_setup', function (require) {
  var store = require('store');
  (function setAjax () {
    $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
      var dfd = $.Deferred();
      jqXHR.done(function (data) {
        var dataCheck = options.dataCheck;
        if ($.isFunction(dataCheck) && !dataCheck(data)) {
          originalOptions.url = originalOptions.backup;
          originalOptions.dataCheck = null;
          originalOptions.forceBackup = true;
          dfd.rejectWith(originalOptions, arguments);
        } else {
          processStoreData(data);
          dfd.resolveWith(originalOptions, arguments);
        }
      });

      jqXHR.fail(dfd.reject);

      function processStoreData (data) {
        var needStore = options.needStore;
        var storeKey = options.storeKey;
        var storeCheck = options.storeCheck;
        needStore = needStore ? store.enabled : false;
        if (needStore) {
          var storeData = store.get(storeKey);
          if (!storeData || !storeCheck(storeData)) {
            if (typeof data === 'string') {
              try {
                data = JSON.parse(data);
              } catch (e) {
                data = {};
              }
            }
            store.set(storeKey, data);
          }
        }
      }
      
      jqXHR.retry = function (opts) {
        if (opts.timeout) {
          this.timeout = opts.timeout;
        }
        if (opts.statusCodes) {
          this.statusCodes = opts.statusCodes;
        }
        if (opts.backup) {
          if (!$.isArray(opts.backup)) {
            opts.backup = [opts.backup];
          } else {
            opts.backup = Array.prototype.slice.call(opts.backup);
          }
        }
        return this.pipe(null, pipeFailRetry(this, opts));
      };
      return dfd.promise(jqXHR);
    });

    $.ajaxTransport('+script', function (options) {
      var needStore = options.needStore;
      var storeKey = options.storeKey;
      var storeCheck = options.storeCheck;
      var dataType = options.dataType;
      var forceStore = options.forceStore;
      needStore = needStore ? store.enabled : false;
      if (needStore) {
        var storeData = store.get(storeKey);
        if (storeData && (storeCheck(storeData) || forceStore)) {
          return {
            send: function (headers, completeCallback) {
              var response = {};
              response[dataType] = options.jsonpCallback + '(' + JSON.stringify(storeData) + ')';
              completeCallback(200, 'success', response, '');
            },
            abort: function () {
              _.console.log('abort ajax transport for local cache');
            }
          };
        }
      }
    });

    function pipeFailRetry(jqXHR, opts) {
      var times = opts.times;
      var timeout = jqXHR.timeout;
      var timer = null;
      return function (input, status, msg) {
        var ajaxOptions = this;
        var output = new $.Deferred();
        var retryAfter = jqXHR.getResponseHeader('Retry-After');
        timer && clearTimeout(timer);
        function nextRequest(options) {
          if (options.isBackup) {
            options.cache = true;
            _.eventCenter.trigger(ajaxOptions.jsonpCallback + ':backup', options.url);
          }
          ajaxOptions.data = ajaxOptions.__data || { };
          $.extend(ajaxOptions, {
            url: ajaxOptions.originalUrl,
            forceStore: false
          }, options);
          $.ajax(ajaxOptions)
            .retry({
              times: options.times,
              timeout: opts.timeout,
              statusCodes: opts.statusCodes,
              backup: opts.backup
            })
            .pipe(output.resolve, output.reject);
        }

        function useStore() {
          var storeData = store.get(ajaxOptions.storeKey);
          if (storeData) {
            nextRequest({
              forceStore: true,
              times: 0
            });
          } else {
            output.rejectWith(this, arguments);
          }
        }

        if (ajaxOptions.forceBackup) {
          times = 0;
        }

        if (times > 0 && (!jqXHR.statusCodes || $.inArray(input.status, jqXHR.statusCodes) > -1)) {
          if (retryAfter) {
            if (isNaN(retryAfter)) {
              timeout = new Date(retryAfter).getTime() - $.now();
            } else {
              timeout = parseInt(retryAfter, 10) * 1000;
            }
            if (isNaN(timeout) || timeout < 0) {
              timeout = jqXHR.timeout;
            }
          }
          if (timeout !== undefined && times !== opts.times) {
            timer = setTimeout(function () {
              nextRequest({
                times: times - 1
              });
            }, timeout);
          } else {
            nextRequest({
              times: times - 1
            });
          }
        } else {
          if (times === 0) {
            if (opts.backup && opts.backup.length) {
              nextRequest({
                url: opts.backup.shift(),
                times: 0,
                isBackup: true
              });
            } else {
              useStore();
            }
          }
        }
        return output;
      };
    }
  })();
});