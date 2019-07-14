import isObject from './isObject';

const isEl = value => isObject(value) && value.nodeType === 1;

export default isEl;
