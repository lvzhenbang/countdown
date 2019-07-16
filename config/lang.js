const langMap = {
  en: {
    DD: 'days',
    HH: 'hours',
    MM: 'minutes',
    SS: 'seconds',
    sss: 'milliseconds',
  },
  zh: {
    DD: '天',
    HH: '小时',
    MM: '分钟',
    SS: '秒',
    sss: '毫秒',
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
