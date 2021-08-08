import { isLeapYear, ymdHisToFormat } from '../index';

test('isLeapYear', () => {
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(2001)).toBe(false);
    expect(isLeapYear(2004)).toBe(true);
    expect(isLeapYear(1900)).toBe(false);
});

test('singleLetters1', () => {
    const ymdHis = '2021-08-08 17:38:10';
    const expected: {[index: string]: string} = {
        d: '08',
        D: 'Sun',
        j: '8',
        l: 'Sunday',
        N: '7',
        S: 'th',
        w: '0',
        z: '219',
        W: '31',
        F: 'August',
        m: '08',
        M: 'Aug',
        n: '8',
        t: '31',
        L: '0',
        o: '2021',
        Y: '2021',
        y: '21',
        a: 'pm',
        A: 'PM',
        g: '5',
        G: '17',
        h: '05',
        H: '17',
        i: '38',
        s: '10',
        v: '0',
    };
    for (let char in expected) {
        expect(ymdHisToFormat(ymdHis, char)).toBe(expected[char]);
    }
});

test('singleLetters2', () => {
    const ymdHis = '2021-01-01 00:00:00';
    const expected: {[index: string]: string} = {
        d: '01',
        D: 'Fri',
        j: '1',
        l: 'Friday',
        N: '5',
        S: 'st',
        w: '5',
        z: '0',
        W: '53',
        F: 'January',
        m: '01',
        M: 'Jan',
        n: '1',
        t: '31',
        L: '0',
        o: '2020',
        Y: '2021',
        y: '21',
        a: 'am',
        A: 'AM',
        g: '12',
        G: '0',
        h: '12',
        H: '00',
        i: '00',
        s: '00',
        v: '0',
    };
    for (let char in expected) {
        expect(ymdHisToFormat(ymdHis, char)).toBe(expected[char]);
    }
});
