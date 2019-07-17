import isObject from './isObject';

export default function isEl(value) {
  return isObject(value) && value.nodeType === 1;
}
