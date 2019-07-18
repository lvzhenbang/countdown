import defaults from '../config/defaults';
import { langMap, stateMap } from '../config/lang';
import version from '../config/version';

import parseInputUnfixedTime from './utils/parseUnfixedTime';
import inBrowser from './utils/inBrowser';
import {
  addClass,
  removeClass,
  hasClass,
} from './utils/class';

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
    this.state = 'other'; // boefore, progress, after, other, default is other
    this.edgeTime = Date.now();
    this.init();
    this.version = version;
  }

  init() {
    if (!this.options.stateText) {
      this.options.stateText = stateMap[this.options.lang];
    }
    this.parseInputTime();
    this.totalMilliseconds = Math.abs(Date.now() - this.edgeTime);

    if (!this.options.pre) this.edgeTime -= this.options.interval;

    if (this.options.auto) {
      this.start();
    } else {
      this.setOffset();
      this.render();
      if (this.$el) {
        removeClass(this.$el, 'disabled');
      }
    }
  }

  /* countdown state -> start */
  start() {
    if (this.$el && hasClass(this.$el, 'disabled')) {
      removeClass(this.$el, 'disabled');
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
    } else if (minTime <= 0 && self.state === 'before') {
      setTimeout(() => {
        self.state = 'other';
        self.init();
      }, 0);
    } else if (minTime <= 0 && self.state === 'progress') {
      setTimeout(() => {
        self.state = 'other';
        self.init();
      }, 0);
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
      addClass(this.$el, 'disabled');
    }
  }

  /* countdown state -> over */
  end() {
    if (this.options.fixed) {
      this.pause();
      this.totalMilliseconds = 0;
      this.edgeTime = 0;
      this.start();
    }
  }

  /* countdown state -> reset */
  reset() {
    if (this.options.fixed) {
      this.parseInputTime();
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
      totalMilliseconds = this.edgeTime - Date.now();
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

  /* countdown parse input times or date , and so on */
  parseInputTime() {
    let edgeTime = 0;

    // parse totalMliliseocnd
    if (this.options.fixed) {
      const intMilliseconds = parseInt(this.options.totalMilliseconds, 10) || 0;
      edgeTime = intMilliseconds + Date.now();
    } else {
      const startTime = parseInputUnfixedTime(this.options.start.time);
      const endTime = parseInputUnfixedTime(this.options.end.time);
      if (startTime && endTime && startTime < endTime) {
        const currentDate = Date.now();
        if (currentDate < startTime) {
          this.state = 'before';
          edgeTime = startTime;
        } else if (currentDate < endTime) {
          this.state = 'progress';
          edgeTime = endTime;
        } else {
          this.state = 'after';
          edgeTime = Date.now();
        }
      } else {
        edgeTime = Date.now();
        window.console.log('options.start.time must be less than options.end.time!');
      }
    }

    this.edgeTime = edgeTime;
  }

  /* countdown format -> ouput time */
  formatOutputTime() {
    return this.options.format
      .replace(/DD/, (this.offset.day < 10 ? `0${this.offset.day}` : this.offset.day))
      .replace(/HH/, (`0${this.offset.hour}`).slice(-2))
      .replace(/MM/, (`0${this.offset.minute}`).slice(-2))
      .replace(/SS/, (`0${this.offset.second}`).slice(-2))
      .replace(/sss/, (`${this.offset.millisecond}`));
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
        addClass(this.$el, themeClass);
      } else {
        html = this.formatOutputTime();
      }

      if (this.options.state && this.state !== 'other') {
        html += `<span class="state">${this.options.stateText[this.state]}</span>`;
      }

      this.$el.innerHTML = html;
    } else {
      window.console.log(`countdown instance state: ${this.state}`);
    }
  }
}

if (inBrowser) {
  window.CountDown = CountDown;
  window.console.log('plugin is running browser.');
}

export default CountDown;
