import defaults from './config/defaults';
import langMap from './config/lang';
import version from './config/version';

import isValidDate from './utils/isValiDate';
import inBrowser from './utils/inBrowser';

class CountDown {
  constructor(el, opt) {
    this.offset = {
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
    };
    this.$el = document.querySelector(el);
    this.options = { ...defaults, ...opt };
    this.endTime = Date.now();
    this.init();
    this.version = '1.0.0';
  }

  static get VERSION() {
    return version;
  }

  init() {
    this.parseInputTime();
    this.totalMilliseconds = this.endTime - Date.now();
    if (!this.options.pre) this.endTime -= this.options.interval;

    if (this.options.auto) {
      this.start();
    } else {
      this.setOffset();
      this.render();
      if (this.$el) {
        this.$el.classList.add('disabled');
      }
    }
  }

  /* countdown state -> start */
  start() {
    if (this.$el && this.$el.classList.contains('disabled')) {
      this.$el.classList.remove('disabled');
    }
    this.setOffset();
    this.render();
    this.reComputeMilliseconds();
    this.continue();
  }

  /* countdown state -> next/continue */

  continue() {
    const self = this;
    const minTime = Math.min(self.totalMilliseconds, self.options.interval);

    if (minTime > 0) {
      if (window.requestAnimationFrame) {
        let start = null;
        const step = (timestamp) => {
          if (!start) start = timestamp;

          if ((timestamp - start) < minTime) {
            self.requestId = window.requestAnimationFrame(step);
          } else {
            self.start();
          }
        };
        self.requestId = window.requestAnimationFrame(step);
      } else {
        self.timeoutId = setTimeout(() => {
          self.start();
        }, minTime);
      }
    } else {
      self.pause();
    }
  }

  /* countdown state -> pause */
  pause() {
    if (window.requestAnimationFrame) {
      window.cancelAnimationFrame(this.requestId);
    } else {
      clearTimeout(this.timeoutId);
    }

    if (this.$el) {
      this.$el.classList.add('disabled');
    }
  }

  /* countdown state -> over */
  end() {
    if (this.options.fixed) {
      this.pause();
      this.totalMilliseconds = 0;
      this.endTime = 0;
      this.start();
    } else {
      throw new Error('end status is invalid!');
    }
  }

  /* countdown state -> reset */
  reset() {
    if (this.options.fixed) {
      this.endTime = this.options.endTime;
      this.init();
    } else {
      throw new Error('reset status is invalid!');
    }
  }

  /* countdown next render milliseconds */
  reComputeMilliseconds() {
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
    this.offset.second = Math.floor(this.totalMilliseconds / 1000) % 60;
    this.offset.millisecond = Math.floor((this.totalMilliseconds % 1000) / this.options.interval);
  }

  /* countdown get -> day, hour , minute, second, millisecond */
  static get getOffset() {
    this.reComputeMilliseconds();
    this.setOffset();
    return this.offset;
  }

  /* countdown parse input times or date , and so on */
  parseInputTime() {
    // parse totalMliliseocnd
    const intMilliseconds = parseInt(this.options.totalMilliseconds, 10);

    if (!Number.isNaN(intMilliseconds) && intMilliseconds > 0) {
      this.endTime = intMilliseconds + Date.now();
      return;
    }

    // parse `new Date()` object value
    if (isValidDate(this.options.endTime)) {
      this.endTime = this.options.endTime.getTime();
      return;
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
        matchesArr[7] || 0,
      );

      if (isValidDate(endDate)) {
        const endTime = endDate.getTime();
        if (endTime > Date.now()) {
          this.endTime = endTime;
        }
        return;
      }
    }

    // parse Date.now()/Date.getTime() value
    const intEndTime = parseInt(this.options.endTime, 10);
    this.endTime = isValidDate(new Date(intEndTime)) ? intEndTime : 0;
  }

  /* countdown format -> ouput time */
  formatOutputTime() {
    return this.options.format
      .replace(/d/, (this.offset.day < 10 ? `0${this.offset.day}` : this.offset.day))
      .replace(/h/, (`0${this.offset.hour}`).slice(-2))
      .replace(/m/, (`0${this.offset.minute}`).slice(-2))
      .replace(/S/, (`0${this.offset.second}`).slice(-2))
      .replace(/s/, (`${this.offset.millisecond}`));
  }

  /* util -> check date is valid */
  getTimeName(timeArr) {
    const timeNameArr = [];
    for (let len = timeArr.length, i = 0; i < len; i += 1) {
      timeNameArr.push(langMap[this.options.lang][timeArr[i]]);
    }

    return timeNameArr;
  }

  /* countdown render -> time-string to webview */
  render() {
    if (this.$el) {
      let html = '';
      const htmlArr = [];
      const timeArr = this.options.format.split(' : ');
      const timeNameArr = this.getTimeName(timeArr);
      const timeValueArr = this.formatOutputTime().split(' : ');
      const { themeClass } = this.options;

      if (themeClass && themeClass.length > 0) {
        for (let len = timeArr.length, i = 0; i < len; i += 1) {
          htmlArr.push(`<div class="time-item">
            <span class="number">${timeValueArr[i]}</span>
            <span class="text">${timeNameArr[i]}</span>
          </div>`);
        }
        html = htmlArr.join('<span class="separator">:</span>');
        this.$el.classList.add(themeClass);
      } else {
        html = this.formatOutputTime();
      }
      this.$el.innerHTML = html;
    } else {
      console.log(
        this.offset.day,
        this.offset.hour,
        this.offset.minute,
        this.offset.second,
        this.offset.millisecond,
      );
    }
  }
}

if (inBrowser) {
  console.log('plugin is running browser.');
  window.countDown = CountDown;
}

export default CountDown;
