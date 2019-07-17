import {
  addClass,
  removeClass,
  hasClass,
} from './class';

describe('dom class test.', () => {
  const dom = document.createElement('div');
  addClass(dom, 'dom');

  it('add class', () => {
    addClass(dom, 'apple');
    expect(dom.className).toBe('dom apple');
  });

  it('remove class', () => {
    removeClass(dom, 'apple');
    expect(dom.className).toBe('dom');
  });

  it('has class', () => {
    expect(hasClass(dom, 'dom')).toBeTruthy();
  });
});
