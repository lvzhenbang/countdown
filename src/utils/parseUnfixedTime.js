/* countdown parse input-times of unfixed */

import isValidDate from './isValiDate';

function parseInputUnfixedTime(valTime) {
  // parse `new Date()` object value
  if (isValidDate(valTime)) {
    return valTime.getTime();
  }

  // parse '2020-0-7 16:29:59 888' value
  if (typeof valTime === 'string' && valTime.indexOf('-')) {
    const parseReg = /^(\d{4})-?(\d{1,2})-?(\d{0,2})[\s]?(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.|\s]?(\d{1,3})?$/;
    const matchesArr = valTime.match(parseReg);
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
        return endTime;
      }
    }
  }

  // parse Date.now()/Date.getTime() value
  const intEndTime = parseInt(valTime, 10);
  return isValidDate(new Date(intEndTime)) ? intEndTime : 0;
}

export default parseInputUnfixedTime;
