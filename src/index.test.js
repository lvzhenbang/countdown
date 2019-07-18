import CountDown from './index';

describe('CountDown test.', () => {
  it('el is not exsit, countdown state "before"', () => {
    const countdown = new CountDown('.el', {
      start: {
        time: '2029-10-1',
      },
      end: {
        time: '2029-10-3',
      },
    });

    expect(countdown.state).toBe('before');
    expect(countdown.version).toBe('1.3.0');
  });

  it('el is exsit, but without option.theme, countdown state "before"', () => {
    const el = document.createElement('div');
    el.classList.add('el2');
    document.body.appendChild(el);
    const countdown = new CountDown('.el2', {
      start: {
        time: '2029-10-1',
      },
      end: {
        time: '2029-10-3',
      },
    });
    expect(countdown.state).toBe('before');
    const el2 = document.querySelector('.el2');
    expect(el2.children.length).toBe(1);
    expect(el2.querySelector('.state').innerHTML).toBe('Activity not started');
  });

  it('el is exsit, and option.theme is exsit, countdown state "before"', () => {
    const el = document.createElement('div');
    el.classList.add('el3');
    document.body.appendChild(el);
    const countdown = new CountDown('.el3', {
      start: {
        time: '2030-10-1',
      },
      end: {
        time: '2030-10-2',
      },
      themeClass: 'dark',
    });
    expect(countdown.state).toBe('before');
    const el3 = document.querySelector('.el3');
    expect(el3.children.length).toBe(10);
    expect(el3.querySelector('.state').innerHTML).toBe('Activity not started');
  });

  it('el is exsit, and option.theme is exsit, countdown state "progress"', () => {
    const el = document.createElement('div');
    el.classList.add('el4');
    document.body.appendChild(el);
    const countdown = new CountDown('.el4', {
      start: {
        time: '2000-10-1',
      },
      end: {
        time: '2219-10-1',
      },
      themeClass: 'dark',
    });
    expect(countdown.state).toBe('progress');
    const el4 = document.querySelector('.el4');
    expect(el4.children.length).toBe(10);
    expect(el4.querySelector('.state').innerHTML).toBe('Activity in progress');
  });

  it('el is exsit, and option.theme is exsit, countdown state "over"', () => {
    const el = document.createElement('div');
    el.classList.add('el5');
    document.body.appendChild(el);
    const countdown = new CountDown('.el5', {
      start: {
        time: '2000-10-1',
      },
      end: {
        time: '2009-10-1',
      },
      themeClass: 'dark',
    });
    expect(countdown.state).toBe('after');
    const el5 = document.querySelector('.el5');
    expect(el5.children.length).toBe(10);
    expect(el5.querySelector('.state').innerHTML).toBe('Activity is over');
  });

  it('el is exsit, option.theme is exsit, options.format is "HH : MM : SS", countdown state "over"', () => {
    const el = document.createElement('div');
    el.classList.add('el6');
    document.body.appendChild(el);
    const countdown = new CountDown('.el6', {
      start: {
        time: '2000-10-1',
      },
      end: {
        time: '2009-10-1',
      },
      themeClass: 'dark',
      format: 'HH : MM : SS',
    });
    expect(countdown.state).toBe('after');
    const el6 = document.querySelector('.el6');
    expect(el6.children.length).toBe(6);
    expect(el6.querySelector('.state').innerHTML).toBe('Activity is over');
  });

  it('el is exsit, option.theme is exsit, options.format is "HH : MM : SS", options.state is "false", countdown state "over"', () => {
    const el = document.createElement('div');
    el.classList.add('el7');
    document.body.appendChild(el);
    const countdown = new CountDown('.el7', {
      start: {
        time: '2000-10-1',
      },
      end: {
        time: '2009-10-1',
      },
      themeClass: 'dark',
      format: 'HH : MM : SS',
      state: false,
    });
    expect(countdown.state).toBe('after');
    const el7 = document.querySelector('.el7');
    expect(el7.children.length).toBe(5);
    expect(el7.querySelector('.state')).toBeNull();
  });

  it('el is exsit, option.theme is exsit, options.format is "HH : MM : SS", options.state is "true", options.stateText, countdown state "over"', () => {
    const el = document.createElement('div');
    el.classList.add('el8');
    document.body.appendChild(el);
    const countdown = new CountDown('.el8', {
      start: {
        time: '2000-10-1',
      },
      end: {
        time: '2009-10-1',
      },
      themeClass: 'dark',
      format: 'HH : MM : SS',
      stateText: {
        before: 'Start of distance activity:',
        progress: 'End of distance activity:',
        after: 'The activity is over:',
      },
    });
    expect(countdown.state).toBe('after');
    const el8 = document.querySelector('.el8');
    expect(el8.children.length).toBe(6);
    expect(el8.querySelector('.state').innerHTML).toBe('The activity is over:');
  });

  it('el is exsit, and option.fixed"', () => {
    const el = document.createElement('div');
    el.classList.add('el9');
    document.body.appendChild(el);
    const countdown = new CountDown('.el9', {
      totalMilliseconds: 24 * 1000,
      format: 'SS : sss',
      auto: false,
      fixed: true,
      state: false,
    });

    const el9 = document.querySelector('.el9');
    expect(countdown.state).toBe('other');
    expect(el9.innerHTML).toBe('24 : 0');
  });

  it('el is not exsit, options.auto "false"', () => {
    const countdown = new CountDown('.el9', {
      totalMilliseconds: 24 * 1000,
      format: 'SS : sss',
      auto: false,
      fixed: true,
      state: false,
    });
    expect(countdown.state).toBe('other');
    expect(countdown.offset).toEqual({
      day: 0, hour: 0, minute: 0, second: 24, millisecond: 0,
    });
  });

  it('options.start.time greater than options.end.time error', () => {
    const countdown = new CountDown('.el9', {
      start: {
        time: '2019-10-1 10:10:10: 333',
      },
      end: {
        time: '2019-10-1 10:10:10: 332',
      },
    });
    expect(countdown.state).toBe('other');
    expect(countdown.offset).toEqual({
      day: 0, hour: 0, minute: 0, second: 0, millisecond: 0,
    });
  });
});
