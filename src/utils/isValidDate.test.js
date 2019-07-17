import isValidDate from './isValidDate';

describe('isValidDate test.', () => {
  it('invalid date test', () => {
    const date = new Date(NaN);

    expect(isValidDate(date)).toBeFalsy();
  });

  it('valid date test', () => {
    const date = new Date(2019, 1, 1);

    expect(isValidDate(date)).toBeTruthy();
  });
});
