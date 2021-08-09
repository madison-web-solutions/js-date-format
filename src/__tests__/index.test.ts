import {
  isLeapYear,
  getNumDaysInMonth,
  dateToUtcFormat,
  dateToLocalFormat,
  ymdToFormat,
  ymdHisToFormat,
  utcYmdToDate,
  localYmdToDate,
  utcYmdHisToDate,
  localYmdHisToDate,
  tsToUtcFormat,
  tsToLocalFormat,
} from '../index';

test('timezone', () => {
  // These tests should be run in an environment where the timezone is Europe/Istanbul (UTC+03:00)
  // This is set in the test script command in the package.json
  // This timezone was chosen because it's different to UTC and has no daylight saving changes
  // So we can test the differences between local and UTC results in a consistent way

  // Check that the current system timezone is actually Europe/Istanbul (UTC+03:00)
  expect(new Date().getTimezoneOffset()).toBe(-180);
});

test('isLeapYear', () => {
  expect(isLeapYear(2000)).toBe(true);
  expect(isLeapYear(2001)).toBe(false);
  expect(isLeapYear(2004)).toBe(true);
  expect(isLeapYear(1900)).toBe(false);
});

test('numDaysInMonth', () => {
  // April has 30 days
  expect(getNumDaysInMonth(new Date(Date.UTC(2021, 3, 1)), true)).toBe(30);

  // Should get the same answer from a date at the end of April
  expect(getNumDaysInMonth(new Date(Date.UTC(2021, 3, 30)), true)).toBe(30);

  // Feb in non-leap year
  expect(getNumDaysInMonth(new Date(Date.UTC(2021, 1, 1)), true)).toBe(28);

  // Feb in leap year
  expect(getNumDaysInMonth(new Date(Date.UTC(2020, 1, 1)), true)).toBe(29);

  // 10pm April 30th UTC = 1am May 1st Istanbul (local) time
  const d: Date = new Date(Date.UTC(2020, 3, 30, 22));
  expect(getNumDaysInMonth(d, true)).toBe(30);
  expect(getNumDaysInMonth(d, false)).toBe(31);
});

test('singleChars1', () => {
  const ymdHis = '2021-08-08 17:38:10';
  const checks: { char: string; expected: string }[] = [
    { char: 'd', expected: '08' },
    { char: 'D', expected: 'Sun' },
    { char: 'j', expected: '8' },
    { char: 'l', expected: 'Sunday' },
    { char: 'N', expected: '7' },
    { char: 'S', expected: 'th' },
    { char: 'w', expected: '0' },
    { char: 'z', expected: '219' },
    { char: 'W', expected: '31' },
    { char: 'F', expected: 'August' },
    { char: 'm', expected: '08' },
    { char: 'M', expected: 'Aug' },
    { char: 'n', expected: '8' },
    { char: 't', expected: '31' },
    { char: 'L', expected: '0' },
    { char: 'o', expected: '2021' },
    { char: 'Y', expected: '2021' },
    { char: 'y', expected: '21' },
    { char: 'a', expected: 'pm' },
    { char: 'A', expected: 'PM' },
    { char: 'g', expected: '5' },
    { char: 'G', expected: '17' },
    { char: 'h', expected: '05' },
    { char: 'H', expected: '17' },
    { char: 'i', expected: '38' },
    { char: 's', expected: '10' },
    { char: 'v', expected: '0' },
    { char: 'U', expected: '1628444290' },
  ];
  checks.forEach((check) => {
    expect(ymdHisToFormat(ymdHis, check.char)).toBe(check.expected);
  });
});

test('singleChars2', () => {
  const ymdHis = '2021-01-01 00:00:00';
  const checks: { char: string; expected: string }[] = [
    { char: 'd', expected: '01' },
    { char: 'd', expected: '01' },
    { char: 'D', expected: 'Fri' },
    { char: 'j', expected: '1' },
    { char: 'l', expected: 'Friday' },
    { char: 'N', expected: '5' },
    { char: 'S', expected: 'st' },
    { char: 'w', expected: '5' },
    { char: 'z', expected: '0' },
    { char: 'W', expected: '53' },
    { char: 'F', expected: 'January' },
    { char: 'm', expected: '01' },
    { char: 'M', expected: 'Jan' },
    { char: 'n', expected: '1' },
    { char: 't', expected: '31' },
    { char: 'L', expected: '0' },
    { char: 'o', expected: '2020' },
    { char: 'Y', expected: '2021' },
    { char: 'y', expected: '21' },
    { char: 'a', expected: 'am' },
    { char: 'A', expected: 'AM' },
    { char: 'g', expected: '12' },
    { char: 'G', expected: '0' },
    { char: 'h', expected: '12' },
    { char: 'H', expected: '00' },
    { char: 'i', expected: '00' },
    { char: 's', expected: '00' },
    { char: 'v', expected: '0' },
    { char: 'U', expected: '1609459200' },
  ];
  checks.forEach((check) => {
    expect(ymdHisToFormat(ymdHis, check.char)).toBe(check.expected);
  });
});

test('dateTimeFormat', () => {
  // Create a date which is Jan 1st 2021 1am in Istanbul (local) time
  // In UTC it will be Dec 31st 2020 10pm - so just about every value will be different
  const d: Date = new Date(2021, 0, 1, 1);
  const checks: { format: string; local: string; utc: string }[] = [
    { format: 'D M d Y g:ia', local: 'Fri Jan 01 2021 1:00am', utc: 'Thu Dec 31 2020 10:00pm' },
    {
      format: 'l jS F Y H:i:s',
      local: 'Friday 1st January 2021 01:00:00',
      utc: 'Thursday 31st December 2020 22:00:00',
    },
    { format: 'd/m/y G:iA', local: '01/01/21 1:00AM', utc: '31/12/20 22:00PM' },
    { format: 'N z o/W L', local: '5 0 2020/53 0', utc: '4 365 2020/53 1' },
  ];
  checks.forEach((check) => {
    expect(dateToLocalFormat(d, check.format)).toBe(check.local);
    expect(dateToUtcFormat(d, check.format)).toBe(check.utc);
  });
  // Milliseconds aren't covered by the above, so test here
  d.setMilliseconds(123);
  expect(dateToLocalFormat(d, 'v')).toBe('123');
  expect(dateToUtcFormat(d, 'v')).toBe('123');
});

test('ymdToFormat', () => {
  const ymd = '2021-08-09';
  const checks: { format: string; expected: string }[] = [
    { format: 'D M d Y g:ia', expected: 'Mon Aug 09 2021 12:00am' },
    { format: 'l jS F Y H:i:s', expected: 'Monday 9th August 2021 00:00:00' },
    { format: 'd/m/y G:iA', expected: '09/08/21 0:00AM' },
  ];
  checks.forEach((check) => {
    expect(ymdToFormat(ymd, check.format)).toBe(check.expected);
  });
});

test('ymdToDate', () => {
  const checks: { ymd: string; valid: boolean; utcUtcString: string; localUtcString: string }[] = [
    {
      ymd: '2021-08-09',
      valid: true,
      // If 2021-08-09 is interpreted as a UTC time, then the utdString for the date will match
      utcUtcString: 'Mon, 09 Aug 2021 00:00:00 GMT',
      // If 2021-08-09 is interpreted as Istanbul (local) time, then in UTC it will be 9pm the previous day
      localUtcString: 'Sun, 08 Aug 2021 21:00:00 GMT',
    },
    {
      // April has only 30 days - we should expect April 31 to be converted to May 1
      ymd: '2021-04-31',
      valid: true,
      utcUtcString: 'Sat, 01 May 2021 00:00:00 GMT',
      localUtcString: 'Fri, 30 Apr 2021 21:00:00 GMT',
    },
    {
      // Test an invalid date
      ymd: '2021 08 09',
      valid: false,
      utcUtcString: '',
      localUtcString: '',
    },
  ];
  checks.forEach((check) => {
    let dUtc = utcYmdToDate(check.ymd);
    let dLocal = localYmdToDate(check.ymd);
    if (check.valid) {
      expect(dUtc instanceof Date).toBe(true);
      expect(dLocal instanceof Date).toBe(true);
      if (dUtc instanceof Date) {
        expect(dUtc.toUTCString()).toBe(check.utcUtcString);
      }
      if (dLocal instanceof Date) {
        expect(dLocal.toUTCString()).toBe(check.localUtcString);
      }
    } else {
      expect(dUtc == null).toBe(true);
      expect(dLocal == null).toBe(true);
    }
  });
});

test('ymdHisToDate', () => {
  const checks: { ymdHis: string; valid: boolean; utcUtcString: string; localUtcString: string }[] = [
    {
      ymdHis: '2021-08-09 01:20:39',
      valid: true,
      // If the string is interpreted as a UTC time, then the utdString for the date will match
      utcUtcString: 'Mon, 09 Aug 2021 01:20:39 GMT',
      // If the string is interpreted as Istanbul (local) time, then in UTC it will be the previous day
      localUtcString: 'Sun, 08 Aug 2021 22:20:39 GMT',
    },
    {
      // Deliberately overflow April's days and the number of mins in an hour
      ymdHis: '2021-04-31 17:70:10',
      valid: true,
      utcUtcString: 'Sat, 01 May 2021 18:10:10 GMT',
      localUtcString: 'Sat, 01 May 2021 15:10:10 GMT',
    },
    {
      // Test an invalid string
      ymdHis: '2021 08 09 234',
      valid: false,
      utcUtcString: '',
      localUtcString: '',
    },
  ];
  checks.forEach((check) => {
    let dUtc = utcYmdHisToDate(check.ymdHis);
    let dLocal = localYmdHisToDate(check.ymdHis);
    if (check.valid) {
      expect(dUtc instanceof Date).toBe(true);
      expect(dLocal instanceof Date).toBe(true);
      if (dUtc instanceof Date) {
        expect(dUtc.toUTCString()).toBe(check.utcUtcString);
      }
      if (dLocal instanceof Date) {
        expect(dLocal.toUTCString()).toBe(check.localUtcString);
      }
    } else {
      expect(dUtc == null).toBe(true);
      expect(dLocal == null).toBe(true);
    }
  });
});

test('tsToFormat', () => {
  // Number below is JS timestamp for Dec 31st 2020 10pm UTC
  // In Istanbul (local) time it will be Jan 1st 2021 1am - so just about every value will be different
  const ts: number = 1609452000000;
  const checks: { format: string; local: string; utc: string }[] = [
    { format: 'D M d Y g:ia', local: 'Fri Jan 01 2021 1:00am', utc: 'Thu Dec 31 2020 10:00pm' },
    {
      format: 'l jS F Y H:i:s',
      local: 'Friday 1st January 2021 01:00:00',
      utc: 'Thursday 31st December 2020 22:00:00',
    },
    { format: 'd/m/y G:iA', local: '01/01/21 1:00AM', utc: '31/12/20 22:00PM' },
    { format: 'N z o/W L', local: '5 0 2020/53 0', utc: '4 365 2020/53 1' },
  ];
  checks.forEach((check) => {
    expect(tsToLocalFormat(ts, check.format)).toBe(check.local);
    expect(tsToUtcFormat(ts, check.format)).toBe(check.utc);
  });
});
