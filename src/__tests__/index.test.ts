import { isLeapYear, dateTimeFormat, ymdToFormat, ymdHisToFormat, ymdToDate, tsToFormat } from '../index';

test('isLeapYear', () => {
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(2001)).toBe(false);
    expect(isLeapYear(2004)).toBe(true);
    expect(isLeapYear(1900)).toBe(false);
});

test('singleChars1', () => {
    const ymdHis = '2021-08-08 17:38:10';
    const checks: {char: string, expected: string}[] = [
        {char: 'd', expected: '08'},
        {char: 'D', expected: 'Sun'},
        {char: 'j', expected: '8'},
        {char: 'l', expected: 'Sunday'},
        {char: 'N', expected: '7'},
        {char: 'S', expected: 'th'},
        {char: 'w', expected: '0'},
        {char: 'z', expected: '219'},
        {char: 'W', expected: '31'},
        {char: 'F', expected: 'August'},
        {char: 'm', expected: '08'},
        {char: 'M', expected: 'Aug'},
        {char: 'n', expected: '8'},
        {char: 't', expected: '31'},
        {char: 'L', expected: '0'},
        {char: 'o', expected: '2021'},
        {char: 'Y', expected: '2021'},
        {char: 'y', expected: '21'},
        {char: 'a', expected: 'pm'},
        {char: 'A', expected: 'PM'},
        {char: 'g', expected: '5'},
        {char: 'G', expected: '17'},
        {char: 'h', expected: '05'},
        {char: 'H', expected: '17'},
        {char: 'i', expected: '38'},
        {char: 's', expected: '10'},
        {char: 'v', expected: '0'},
    ];
    checks.forEach(check => {
        expect(ymdHisToFormat(ymdHis, check.char)).toBe(check.expected);
    });
});

test('singleChars2', () => {
    const ymdHis = '2021-01-01 00:00:00';
    const checks: {char: string, expected: string}[] = [
        {char: 'd', expected: '01'},
        {char: 'd', expected: '01'},
        {char: 'D', expected: 'Fri'},
        {char: 'j', expected: '1'},
        {char: 'l', expected: 'Friday'},
        {char: 'N', expected: '5'},
        {char: 'S', expected: 'st'},
        {char: 'w', expected: '5'},
        {char: 'z', expected: '0'},
        {char: 'W', expected: '53'},
        {char: 'F', expected: 'January'},
        {char: 'm', expected: '01'},
        {char: 'M', expected: 'Jan'},
        {char: 'n', expected: '1'},
        {char: 't', expected: '31'},
        {char: 'L', expected: '0'},
        {char: 'o', expected: '2020'},
        {char: 'Y', expected: '2021'},
        {char: 'y', expected: '21'},
        {char: 'a', expected: 'am'},
        {char: 'A', expected: 'AM'},
        {char: 'g', expected: '12'},
        {char: 'G', expected: '0'},
        {char: 'h', expected: '12'},
        {char: 'H', expected: '00'},
        {char: 'i', expected: '00'},
        {char: 's', expected: '00'},
        {char: 'v', expected: '0'},
    ];
    checks.forEach(check => {
        expect(ymdHisToFormat(ymdHis, check.char)).toBe(check.expected);
    });
});

test('timezone', () => {
    // These tests should be run in an environment where the timezone is Europe/Istanbul (UTC+03:00)
    // This is set in the test script command in the package.json
    // This timezone was chosen because it's different to UTC and has no daylight saving changes
    // So we can test the differences between local and UTC results in a consistent way

    // Check that the current system timezone is actually Europe/Istanbul (UTC+03:00)
    expect((new Date()).getTimezoneOffset()).toBe(-180);

    // Create a date which is Jan 1st 2021 1am in Istanbul (local) time
    // In UTC it will be Dec 31st 2020 10pm - so just about every value will be different
    const d: Date = new Date(2021, 0, 1, 1);
    const checks: {format: string, local: string, utc: string}[] = [
        {format: 'D M d Y g:ia', local: 'Fri Jan 01 2021 1:00am', utc: 'Thu Dec 31 2020 10:00pm'},
        {format: 'l jS F Y H:i:s', local: 'Friday 1st January 2021 01:00:00', utc: 'Thursday 31st December 2020 22:00:00'},
        {format: 'd/m/y G:iA', local: '01/01/21 1:00AM', utc: '31/12/20 22:00PM'},
        {format: 'N z o/W L', local: '5 0 2020/53 0', utc: '4 365 2020/53 1'},
    ];
    checks.forEach(check => {
        expect(dateTimeFormat(d, check.format, false)).toBe(check.local);
        expect(dateTimeFormat(d, check.format, true)).toBe(check.utc);
    });
});

test('ymdToFormat', () => {
    const ymd = '2021-08-09';
    const checks: {format: string, expected: string}[] = [
        {format: 'D M d Y g:ia', expected: 'Mon Aug 09 2021 12:00am'},
        {format: 'l jS F Y H:i:s', expected: 'Monday 9th August 2021 00:00:00'},
        {format: 'd/m/y G:iA', expected: '09/08/21 0:00AM'},
    ];
    checks.forEach(check => {
        expect(ymdToFormat(ymd, check.format)).toBe(check.expected);
    });
});

test('ymdToDate', () => {
    const checks: {ymd: string, valid: boolean, utcString: string}[] = [
        {ymd: '2021-08-09', valid: true, utcString: 'Mon, 09 Aug 2021 00:00:00 GMT'},
        {ymd: '2021 08 09', valid: false, utcString: ''},
    ];
    checks.forEach(check => {
        let d = ymdToDate(check.ymd);
        if (check.valid) {
            expect(d instanceof Date).toBe(true);
            if (d instanceof Date) {
                expect(d.toUTCString()).toBe(check.utcString);
            }
        } else {
            expect(d == null).toBe(true);
        }
    });
});

test('tsToFormat', () => {
    // Check that the current system timezone is actually Europe/Istanbul (UTC+03:00)
    expect((new Date()).getTimezoneOffset()).toBe(-180);

    // Number below is JS timestamp for Dec 31st 2020 10pm
    // In Istanbul (local) time it will be Jan 1st 2021 1am - so just about every value will be different
    const ts: number = 1609452000000;
    const checks: { format: string, local: string, utc: string }[] = [
        {format: 'D M d Y g:ia', local: 'Fri Jan 01 2021 1:00am', utc: 'Thu Dec 31 2020 10:00pm'},
        {format: 'l jS F Y H:i:s', local: 'Friday 1st January 2021 01:00:00', utc: 'Thursday 31st December 2020 22:00:00'},
        {format: 'd/m/y G:iA', local: '01/01/21 1:00AM', utc: '31/12/20 22:00PM'},
        {format: 'N z o/W L', local: '5 0 2020/53 0', utc: '4 365 2020/53 1'},
    ];
    checks.forEach(check => {
        expect(tsToFormat(ts, check.format, false)).toBe(check.local);
        expect(tsToFormat(ts, check.format, true)).toBe(check.utc);
    });
});
