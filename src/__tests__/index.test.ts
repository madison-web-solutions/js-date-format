import { isLeapYear } from '../index';

test('isLeapYear', () => {
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(2001)).toBe(false);
    expect(isLeapYear(2004)).toBe(true);
    expect(isLeapYear(1900)).toBe(false);
});
