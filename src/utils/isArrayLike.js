import isDef from './isDef';

export default function isArrayLike(val) {
  return isDef(val) && typeof val.length === 'number' && typeof val !== 'function';
}
