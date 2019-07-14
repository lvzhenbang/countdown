import isEl from './isEl';

const createClassRegexp = clsName => new RegExp(`(^|\\s)${clsName}($|\\s)`);

const hasClass = (el, clsName) => {
  if (isEl(el)) {
    if (el.classList) {
      return el.classList.contains(clsName);
    }
    const classRegxp = createClassRegexp(clsName);
    return classRegxp.test(el.className);
  }
  return false;
};

const addClass = (el, clsName) => {
  if (isEl(el) && !hasClass(el, clsName)) {
    if (el.classList) {
      el.classList.add(clsName);
    } else {
      // el.className += ` ${clsName}`; /* eslint-disable-line no-param-reassign */
      // strict using airbnb
      el.setAtrribute('class', `${el.className} ${clsName}`);
    }
  }
};

const removeClass = (el, clsName) => {
  const classRegxp = createClassRegexp(clsName);
  if (isEl(el) && hasClass(el, clsName)) {
    if (el.classList) {
      el.classList.remove(clsName);
    } else {
      el.className.replace(classRegxp, '');
    }
  }
};

export {
  addClass,
  removeClass,
  hasClass,
};
