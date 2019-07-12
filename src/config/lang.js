const langMap = {
  en: {
    d: 'days',
    h: 'hours',
    m: 'minutes',
    S: 'seconds',
    s: 'milliseconds',
  },
  zh: {
    d: '天',
    h: '小时',
    m: '分钟',
    S: '秒',
    s: '毫秒',
  },
};

const stateMap = {
  en: {
    before: 'Activity not started',
    progress: 'Activity in progress',
    after: 'Activity is over',
  },
  zh: {
    before: '活动未开始',
    progress: '活动进行中',
    after: '活动已结束',
  },
};

export {
  langMap,
  stateMap,
};
