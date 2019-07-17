import toString from './toString';
import isValidMilliseconds from './isValidMilliseconds';

export default function isValidDate(val) {
  return toString.call(val) === '[object Date]' && isValidMilliseconds(val.getTime());
}
