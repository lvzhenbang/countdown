const isValidDate = (val) => {
  const { toString } = Object.prototype;
  return toString.call(val) === '[object Date]' && !Number.isNaN(val.getTime());
};

export default isValidDate;
