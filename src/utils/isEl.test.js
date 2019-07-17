import isEl from './isEl';

describe('isEl test.', () => {
  // false
  it('text node test', () => {
    const textNode = document.createTextNode('123');

    expect(isEl(textNode)).toBeFalsy();
  });

  it('comment node test', () => {
    const commentNode = document.createComment('div');

    expect(isEl(commentNode)).toBeFalsy();
  });

  it('documentFragment node test', () => {
    const documentFragment = document.createDocumentFragment();

    expect(isEl(documentFragment)).toBeFalsy();
  });

  // true
  it('elementNS node test', () => {
    const elementNS = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');

    expect(isEl(elementNS)).toBeTruthy();
  });

  it('element node test', () => {
    const elementNode = document.createElement('div');

    expect(isEl(elementNode)).toBeTruthy();
  });

  // other
  it('attributeNode test', () => {
    const elNode = document.createElement('div');
    const attrNode = document.createAttribute('work');
    attrNode.value = 'programer';
    elNode.setAttributeNode(attrNode);

    expect(isEl(elNode)).toBeTruthy();
    expect(isEl(attrNode)).toBeFalsy();
    expect(elNode.getAttribute('work')).toBe('programer');
  });
});
