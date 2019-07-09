let defaults =  {
  /**
    * 可以是new Date() 对象；
    * 可以是Date.now()或者Date.getTime()的数字或者字符串；
    * 也可以是'2019-7-7 16:29:59 888'格式的字符串
    */ 
  endTime: 0,
  totalMilliseconds: 0, // 单位ms
  interval: 100, // 单位ms
  pre: true, // 是否预渲染开始时间
  format: 'd : h : m : S : s',
  auto: true, // 自动倒计时，默认true
  fixed: false, // 时间每时每刻都在流逝（如：商城），值为false；时间可以固定，时间的流逝不是固定的（如：NBA比赛倒计时）值为true,
}
class countDown {
  constructor(el, opt) {
    this.offset = {
      day: 0,
      hour: 0,
      minute: 0,
      second: 0
    };
    this.$el = document.querySelector(el);
    // this.options = Object.assign({}, defaults, opt);
    this.options = { ...defaults, ...opt};
    this.endTime = Date.now();
    this.init();
  }

  init() {
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
  /* countdown state -> start */ 
  start() {
    if (this.$el && this.$el.classList.contains('disabled')) {
      this.$el.classList.remove('disabled');
    }
    this.setOffset();
    this.render();
    this._reCalMilliseconds();
    this._continue();
  }
  
  /* countdown state -> next/continue */ 
  _continue() {
    const self = this;
    const minTime = Math.min(self.totalMilliseconds, self.options.interval);

    if (minTime > 0) {
      if (window.requestAnimationFrame) {
        let start = null;
        function step(timestamp) {
          if (!start) start = timestamp;

          if ((timestamp - start) < minTime) {
            self.requestId = window.requestAnimationFrame(step);
          } else {
            self.start();
          }
        }
        self.requestId = window.requestAnimationFrame(step);
      }
      else {
        self.timeoutId = setTimeout(function() {
          self.start();
        }, minTime);
      }
    }
    else {
      self.pause();
    }
  }

  /* countdown state -> pause */ 
  pause() {
    if (window.requestAnimationFrame) {
      cancelAnimationFrame(this.requestId);
    } else {
      clearTimeout(this.timeoutId);
    }

    this.$el && this.$el.classList.add('disabled');
  }
  
  /* countdown state -> over */
  end() {
    if (this.options.fixed) {
      this.pause();
      this.totalMilliseconds = 0;
      this.endTime = 0;
      this.start();
    } else {
      console.log(new Error('end status is invalid!'));
    }
  }

  /* countdown state -> reset */
  reset() {
    if (this.options.fixed) {
      this.endTime = this.options.endTime;
      this.init();
    } else {
      console.log(new Error('reset status is invalid!'));
    }
  }

  /* countdown next render milliseconds */
  _reCalMilliseconds() {
    let totalMilliseconds = 0;
    if (this.options.fixed) {
      totalMilliseconds = this.totalMilliseconds - this.options.interval;
    } else {
      totalMilliseconds = this.endTime - Date.now();
    }
    this.totalMilliseconds = totalMilliseconds < 100 ? 0 : totalMilliseconds;
  }
  
  /* countdown compute -> day, hour , minute, second, millisecond */
  setOffset() {
    this.offset.day = Math.floor(this.totalMilliseconds / (24 * 60 * 60 * 1000));
    this.offset.hour = Math.floor(this.totalMilliseconds / (60 * 60 * 1000)) % 24;
    this.offset.minute = Math.floor(this.totalMilliseconds / (60 * 1000)) % 60;
    this.offset.second =  Math.floor(this.totalMilliseconds / 1000) % 60;
    this.offset.millisecond = Math.floor(this.totalMilliseconds % 1000 / this.options.interval);
  }

  /* countdown get -> day, hour , minute, second, millisecond */
  getOffset() {
    this._reCalMilliseconds();
    this.setOffset();
    return this.offset;
  }

  /* countdown parse input times or date , and so on*/
  _parse() {
    // parse totalMliliseocnd
    const intMilliseconds = parseInt(this.options.totalMilliseconds);
    
    if (!isNaN(intMilliseconds) && intMilliseconds > 0) {
      this.endTime = intMilliseconds + Date.now();
      return ;
    }

    // parse `new Date()` object value
    if (this.isValidDate(this.options.endTime)) {
      this.endTime = this.options.endTime.getTime();
      return ;
    }

    // parse '2020-0-7 16:29:59 888' value
    if (typeof this.options.endTime === 'string' && this.options.endTime.indexOf('-')) {
      const parseReg = /^(\d{4})-?(\d{1,2})-?(\d{0,2})[\s]?(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.|\s]?(\d{1,3})?$/;
      const matchesArr = this.options.endTime.match(parseReg);
      const endDate = new Date(
        matchesArr[1],
        (matchesArr[2] - 1) || 0,
        matchesArr[3] || 1,
        matchesArr[4] || 0,
        matchesArr[5] || 0,
        matchesArr[6] || 0,
        matchesArr[7] || 0
      );

      if (this.isValidDate(endDate)) {
        const endTime = endDate.getTime();
        if (endTime > Date.now()) {
          this.endTime = endTime;
        }
        return ;
      }
    }
    // parse Date.now()/Date.getTime() value
    const intEndTime = parseInt(this.options.endTime);
    this.endTime = this.isValidDate(new Date(intEndTime)) ? intEndTime : 0;
  }

  /* countdown format -> ouput time */
  _format() {
    return this.options.format
      .replace(/d/, (this.offset.day < 10 ? '0' + this.offset.day : '' + this.offset.day))
      .replace(/h/, ('0' + this.offset.hour).slice(-2))
      .replace(/m/, ('0' + this.offset.minute).slice(-2))
      .replace(/S/, ('0' + this.offset.second).slice(-2))
      .replace(/s/, ('' + this.offset.millisecond));
  }
  
  /* util -> check date is valid */
  isValidDate(date) {
    return Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date.getTime());
  }

  /* countdown render -> time-string to webview */
  render() {
    if (this.$el) {
      this.$el.innerHTML = this._format();
    } else {
      console.log(this.offset.day, this.offset.hour, this.offset.minute, this.offset.second, this.offset.millisecond);
    }
  }
}