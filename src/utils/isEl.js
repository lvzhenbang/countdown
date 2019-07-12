import isObject from './isObject';

const isEl = (value) => {
  return isObject(value) && value.nodeType === 1;
};

export default isEl;
