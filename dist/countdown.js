"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var defaults = {
  endTime: 0,
  totalMilliseconds: 0,
  interval: 100,
  pre: true,
  format: 'd : h : m : S : s',
  auto: true,
  fixed: false,
  lang: 'en',
  themeClass: false
};
var langMap = {
  en: {
    d: 'days',
    h: 'hours',
    m: 'minutes',
    S: 'seconds',
    s: 'milliseconds'
  },
  zh: {
    d: '天',
    h: '小时',
    m: '分钟',
    S: '秒',
    s: '毫秒'
  }
};

var countDown = function () {
  function countDown(el, opt) {
    _classCallCheck(this, countDown);

    this.offset = {
      day: 0,
      hour: 0,
      minute: 0,
      second: 0
    };
    this.$el = document.querySelector(el);
    this.options = _objectSpread({}, defaults, {}, opt);
    this.endTime = Date.now();
    this.init();
  }

  _createClass(countDown, [{
    key: "init",
    value: function init() {
      this._parse();

      this.totalMilliseconds = this.endTime - Date.now();
      if (!this.options.pre) this.endTime -= this.options.interval;

      if (this.options.auto) {
        this.start();
      } else {
        this.setOffset();
        this.render();
        this.$el && this.$el.classList.add('disabled');
      }
    }
  }, {
    key: "start",
    value: function start() {
      if (this.$el && this.$el.classList.contains('disabled')) {
        this.$el.classList.remove('disabled');
      }

      this.setOffset();
      this.render();

      this._reCalMilliseconds();

      this._continue();
    }
  }, {
    key: "_continue",
    value: function _continue() {
      var self = this;
      var minTime = Math.min(self.totalMilliseconds, self.options.interval);

      if (minTime > 0) {
        if (window.requestAnimationFrame) {
          var step = function step(timestamp) {
            if (!start) start = timestamp;

            if (timestamp - start < minTime) {
              self.requestId = window.requestAnimationFrame(step);
            } else {
              self.start();
            }
          };

          var start = null;
          self.requestId = window.requestAnimationFrame(step);
        } else {
          self.timeoutId = setTimeout(function () {
            self.start();
          }, minTime);
        }
      } else {
        self.pause();
      }
    }
  }, {
    key: "pause",
    value: function pause() {
      if (window.requestAnimationFrame) {
        cancelAnimationFrame(this.requestId);
      } else {
        clearTimeout(this.timeoutId);
      }

      this.$el && this.$el.classList.add('disabled');
    }
  }, {
    key: "end",
    value: function end() {
      if (this.options.fixed) {
        this.pause();
        this.totalMilliseconds = 0;
        this.endTime = 0;
        this.start();
      } else {
        console.log(new Error('end status is invalid!'));
      }
    }
  }, {
    key: "reset",
    value: function reset() {
      if (this.options.fixed) {
        this.endTime = this.options.endTime;
        this.init();
      } else {
        console.log(new Error('reset status is invalid!'));
      }
    }
  }, {
    key: "_reCalMilliseconds",
    value: function _reCalMilliseconds() {
      var totalMilliseconds = 0;

      if (this.options.fixed) {
        totalMilliseconds = this.totalMilliseconds - this.options.interval;
      } else {
        totalMilliseconds = this.endTime - Date.now();
      }

      this.totalMilliseconds = totalMilliseconds < 100 ? 0 : totalMilliseconds;
    }
  }, {
    key: "setOffset",
    value: function setOffset() {
      this.offset.day = Math.floor(this.totalMilliseconds / (24 * 60 * 60 * 1000));
      this.offset.hour = Math.floor(this.totalMilliseconds / (60 * 60 * 1000)) % 24;
      this.offset.minute = Math.floor(this.totalMilliseconds / (60 * 1000)) % 60;
      this.offset.second = Math.floor(this.totalMilliseconds / 1000) % 60;
      this.offset.millisecond = Math.floor(this.totalMilliseconds % 1000 / this.options.interval);
    }
  }, {
    key: "getOffset",
    value: function getOffset() {
      this._reCalMilliseconds();

      this.setOffset();
      return this.offset;
    }
  }, {
    key: "_parse",
    value: function _parse() {
      var intMilliseconds = parseInt(this.options.totalMilliseconds);

      if (!isNaN(intMilliseconds) && intMilliseconds > 0) {
        this.endTime = intMilliseconds + Date.now();
        return;
      }

      if (this.isValidDate(this.options.endTime)) {
        this.endTime = this.options.endTime.getTime();
        return;
      }

      if (typeof this.options.endTime === 'string' && this.options.endTime.indexOf('-')) {
        var parseReg = /^(\d{4})-?(\d{1,2})-?(\d{0,2})[\s]?(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.|\s]?(\d{1,3})?$/;
        var matchesArr = this.options.endTime.match(parseReg);
        var endDate = new Date(matchesArr[1], matchesArr[2] - 1 || 0, matchesArr[3] || 1, matchesArr[4] || 0, matchesArr[5] || 0, matchesArr[6] || 0, matchesArr[7] || 0);

        if (this.isValidDate(endDate)) {
          var endTime = endDate.getTime();

          if (endTime > Date.now()) {
            this.endTime = endTime;
          }

          return;
        }
      }

      var intEndTime = parseInt(this.options.endTime);
      this.endTime = this.isValidDate(new Date(intEndTime)) ? intEndTime : 0;
    }
  }, {
    key: "_format",
    value: function _format() {
      return this.options.format.replace(/d/, this.offset.day < 10 ? '0' + this.offset.day : '' + this.offset.day).replace(/h/, ('0' + this.offset.hour).slice(-2)).replace(/m/, ('0' + this.offset.minute).slice(-2)).replace(/S/, ('0' + this.offset.second).slice(-2)).replace(/s/, '' + this.offset.millisecond);
    }
  }, {
    key: "isValidDate",
    value: function isValidDate(date) {
      return Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date.getTime());
    }
  }, {
    key: "getTimeName",
    value: function getTimeName(timeArr) {
      var lang = this.options.lang;
      var timeNameArr = [];

      for (var len = timeArr.length, i = 0; i < len; i += 1) {
        timeNameArr.push(langMap[lang][timeArr[i]]);
      }

      return timeNameArr;
    }
  }, {
    key: "render",
    value: function render() {
      if (this.$el) {
        var html = '';
        var htmlArr = [];
        var timeArr = this.options.format.split(' : ');
        var timeNameArr = this.getTimeName(timeArr);

        var timeValueArr = this._format().split(' : ');

        var themeClass = this.options.themeClass;

        if (themeClass && themeClass.length > 0) {
          for (var len = timeArr.length, i = 0; i < len; i += 1) {
            htmlArr.push("<div class=\"time-item\">\n            <span class=\"number\">".concat(timeValueArr[i], "</span>\n            <span class=\"text\">").concat(timeNameArr[i], "</span>\n          </div>"));
          }

          html = htmlArr.join("<span class=\"separator\">:</span>");
          this.$el.classList.add(themeClass);
        } else {
          html = this._format();
        }

        this.$el.innerHTML = html;
      } else {
        console.log(this.offset.day, this.offset.hour, this.offset.minute, this.offset.second, this.offset.millisecond);
      }
    }
  }]);

  return countDown;
}();
