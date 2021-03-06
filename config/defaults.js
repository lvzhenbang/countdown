const defaults = {
  /** start.time/end.time
    * 可以是new Date() 对象；
    * 可以是Date.now()或者Date.getTime()的数字或者字符串；
    * 也可以是'2019-7-7 16:29:59 888'格式的字符串
    */
  start: {
    time: 0,
  },
  end: {
    time: 0,
  },
  totalMilliseconds: 0, // 单位ms
  interval: 100, // 单位ms
  pre: true, // 是否预渲染开始时间
  format: 'DD : HH : MM : SS : SSS', // DD: 天，HH：小时，MM：分钟，SS：秒，sss：毫秒
  auto: true, // 自动倒计时，默认true
  fixed: false, // 时间每时每刻都在流逝（如：商城），值为false；时间可以固定，时间的流逝不是固定的（如：NBA比赛倒计时）值为true,
  lang: 'en', // 默认英文,
  themeClass: false, // 默认为false。如果存在则为一个选择器名称，如`.countdown-item`
  state: true, // 默认显示状态
  stateText: null, // stateMap
};

export default defaults;
