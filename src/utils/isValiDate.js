import toString from './toString';

const isValidDate = val => toString.call(val) === '[object Date]' && !Number.isNaN(val.getTime());

export default isValidDate;
