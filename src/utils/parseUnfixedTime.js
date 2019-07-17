/* countdown parse input-times of unfixed */
import isArrayLike from './isArrayLike';
import isValidDate from './isValidDate';

export default function parseInputUnfixedTime(valTime) {
  // parse `new Date()` object value
  if (isValidDate(valTime)) {
    return valTime.getTime();
  }

  // parse '2020-0-7 16:29:59 888' value
  if (typeof valTime === 'string' && valTime.indexOf('-')) {
    const parseReg = /^(\d{4})-?(\d{1,2})-?(\d{0,2})[\s]?(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.|\s]?(\d{1,3})?$/;
    const matchesArr = valTime.match(parseReg);
    let endDate = new Date(NaN);

    if (isArrayLike(matchesArr)) {
      endDate = new Date(
        matchesArr[1],
        (matchesArr[2] - 1) || 0,
        matchesArr[3] || 1,
        matchesArr[4] || 0,
        matchesArr[5] || 0,
        matchesArr[6] || 0,
        matchesArr[7] || 0,
      );
    }

    if (isValidDate(endDate)) {
      return endDate.getTime();
    }
  }

  // parse Date.now()/Date.getTime() value
  if (isValidDate(new Date(valTime))) {
    return valTime;
  }

  return false;
}
