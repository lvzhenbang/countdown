import toString from './toString';

export default function isValidDate(val) {
  return toString.call(val) === '[object Date]' && !Number.isNaN(val.getTime());
}
