import parseUnfixedTime from './parseUnfixedTime';

describe('parseUnfixedTime test', () => {
  // new Date()
  it('new Date(2019) is valid date', () => {
    const date = parseUnfixedTime(new Date(2019));
    expect(date).toEqual(new Date(2019).getTime());
  });
  // 'YY-MM-DD HH:mm:SS sss'
  it('2019-10-1 10 is valid date', () => {
    const date = parseUnfixedTime('2019-10-1 10');
    expect(date).toEqual(new Date(2019, 10 - 1, 1, 10).getTime());
  });
  // '2019-1'
  it('"2019-1" is valid date', () => {
    const date = parseUnfixedTime('2019-1');
    expect(date).toEqual(new Date(2019, 0, 1).getTime());
  });
  // '2019-10-1-1' error format
  it('2019-10-1- is valid date', () => {
    const date = parseUnfixedTime('2019-10-1-1');
    expect(date).toBeFalsy();
  });
  // milliseconds 1563354424540
  it('1563354424540 is valid date', () => {
    const date = parseUnfixedTime(1563354424540);
    expect(date).toEqual(1563354424540);
  });
  // invalid date
  it('"new Date(NaN)" is valid date', () => {
    const date = parseUnfixedTime(new Date(NaN));
    expect(date).toBeFalsy();
  });
});
