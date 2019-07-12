const isObject = (val) => {
  return val !== null && (typeof val === 'object' || typeof val === 'function');
};

export default isObject;
