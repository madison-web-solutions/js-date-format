
const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const longDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const longMonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const daysInMonthNotLeapYear = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const numToString = function(val: number, withLeadingZeros: boolean): string {
    const strVal = val.toString(10);
    if (withLeadingZeros) {
        switch (strVal.length) {
            case 0:
                return '00';
            case 1:
                return '0' + strVal;
            default:
                return strVal;
        }
    } else {
        return strVal;
    }
};

const isLeapYear = function(year: number): boolean {
    // Construct a date on the 29th of Feb for the year in question
    // If it gets changed to March 1st then it's not a leap year
    const d1 = new Date(Date.UTC(year, 1, 29));
    return (d1.getUTCDate() === 29);
};

const getFirstThursdayOfYear = function(year: number, utc: boolean): Date {
    const d = (utc ? new Date(Date.UTC(year, 0, 1)) : new Date(year, 0, 1) );
    const n = (utc ? d.getUTCDay() : d.getDay());
    d.setDate(1 + ((11 - n) % 7));
    return d;
};

const getThursdayOfWeek = function(date: Date, utc: boolean): Date {
    let d: Date;
    if (utc) {
        d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    } else {
        d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    const n = (utc ? d.getUTCDay() : d.getDay());
    const offset = ((7 - n) % 7) - 3;
    d.setDate((utc ? d.getUTCDate() : d.getDate()) + offset);
    return d;
};

const dayOfMonth = function(date: Date, utc: boolean): number {
    // Day of the month without leading zeros
    // 1 to 31
    return utc ? date.getUTCDate() : date.getDate();
};

const dayOfWeekIso8601 = function(date: Date, utc: boolean): number {
    // ISO-8601 numeric representation of the day of the week
    // 1 (for Monday) through 7 (for Sunday)
    const n = (utc ? date.getUTCDay() : date.getDay());
    return (n == 0 ? 7 : n);
};

const dayOfWeek = function(date: Date, utc: boolean): number {
    // Numeric representation of the day of the week
    // 0 (for Sunday) through 6 (for Saturday)
    return utc ? date.getUTCDay() : date.getDay();
};

const dayOfYear = function(date: Date, utc: boolean): number {
    // The day of the year (starting from 0)
    // 0 through 365
    let startOfDay: Date;
    let startOfYear: Date;
    if (utc) {
        startOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
        startOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0));
    } else {
        startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
        startOfYear = new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0);
    }
    return Math.round((startOfDay.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
};

const weekOfYear = function(date: Date, utc: boolean): number {
    // ISO-8601 week number of year, weeks starting on Monday
    // See https://en.wikipedia.org/wiki/ISO_week_date for explanation of this
    const thisThur = getThursdayOfWeek(date, utc);
    const firstThur = getFirstThursdayOfYear(utc ? thisThur.getUTCFullYear() : thisThur.getFullYear(), utc);
    return 1 + Math.round((thisThur.getTime() - firstThur.getTime()) / (1000 * 60 * 60 * 24 * 7));
};

const month = function(date: Date, utc: boolean): number {
    // Numeric representation of a month, without leading zeros
    // 1 through 12
    return ((utc ? date.getUTCMonth() : date.getMonth()) + 1);
};

const year = function(date: Date, utc: boolean): number {
    // A full numeric representation of a year, 4 digits
    // Examples: 1999 or 2003
    return utc ? date.getUTCFullYear() : date.getFullYear();
};

const numDaysInMonth = function(date: Date, utc: boolean): number {
    // Number of days in the given month
    // 28 through 31
    const n = (utc ? date.getUTCMonth() : date.getMonth());
    if (n == 1 && isLeapYear(utc ? date.getUTCFullYear() : date.getFullYear())) {
        // February in leap year:
        return 29;
    }
    return daysInMonthNotLeapYear[n];
};

const weekNumberingYearIso8601 = function(date: Date, utc: boolean): number {
    // ISO-8601 week-numbering year. This has the same value as Y, except that if the ISO week number (W) belongs to the previous or next year, that year is used instead.
    // Examples: 1999 or 2003
    const thisThur = getThursdayOfWeek(date, utc);
    return utc ? thisThur.getUTCFullYear() : thisThur.getFullYear();
};

const hour24 = function(date: Date, utc: boolean): number {
    // 24-hour format of an hour
    // 0 through 23
    return utc ? date.getUTCHours() : date.getHours();
};

const hour12 = function(date: Date, utc: boolean): number {
    // 12-hour format of an hour without leading zeros
    // 1 through 12
    const n = (hour24(date, utc) % 12);
    return (n == 0 ? 12 : n);
};

const minutes = function(date: Date, utc: boolean): number {
    return utc ? date.getUTCMinutes() : date.getMinutes();
};

const seconds = function(date: Date, utc: boolean): number {
    return utc ? date.getUTCSeconds() : date.getSeconds();
};

const milliseconds = function(date: Date, utc: boolean): number {
    return (utc ? date.getUTCMilliseconds() : date.getMilliseconds());
};

const ordinalSuffix = function(dayOfMonth: number): string {
    // English ordinal suffix for the day of the month, 2 characters
    // st, nd, rd or th. Works well with j
    if (dayOfMonth > 3 && dayOfMonth < 21) {
        return 'th';
    }
    switch (dayOfMonth % 10) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
    }
    return 'th';
};

const dateTimeChar = function(char: string, date: Date, utc: boolean): string {
    switch (char) {
        case 'd':
            // Day of the month, 2 digits with leading zeros
            // 01 to 31
            return numToString(dayOfMonth(date, utc), true);
        case 'D':
            // A textual representation of a day, three letters
            // Mon through Sun
            return shortDayNames[utc ? date.getUTCDay() : date.getDay()];
        case 'j':
            // Day of the month without leading zeros
            // 1 to 31
            return numToString(dayOfMonth(date, utc), false);
        case 'l':
            // A full textual representation of the day of the week
            // Sunday through Saturday
            return longDayNames[utc ? date.getUTCDay() : date.getDay()];
        case 'N':
            // ISO-8601 numeric representation of the day of the week
            // 1 (for Monday) through 7 (for Sunday)
            return numToString(dayOfWeekIso8601(date, utc), false);
        case 'S':
            // English ordinal suffix for the day of the month, 2 characters
            // st, nd, rd or th. Works well with j
            return ordinalSuffix(dayOfMonth(date, utc));
        case 'w':
            // Numeric representation of the day of the week
            // 0 (for Sunday) through 6 (for Saturday)
            return numToString(dayOfWeek(date, utc), false);
        case 'z':
            // The day of the year (starting from 0)
            // 0 through 365
            return numToString(dayOfYear(date, utc), false);
        case 'W':
            // ISO-8601 week number of year, weeks starting on Monday
            // See https://en.wikipedia.org/wiki/ISO_week_date for explanation of this
            return numToString(weekOfYear(date, utc), true);
        case 'F':
            // A full textual representation of a month
            // January through December
            return longMonthNames[utc ? date.getUTCMonth() : date.getMonth()];
        case 'm':
            // Numeric representation of a month, with leading zeros
            // 01 through 12
            return numToString(month(date, utc), true);
        case 'M':
            // A short textual representation of a month, three letters
            // Jan through Dec
            return shortMonthNames[utc ? date.getUTCMonth() : date.getMonth()];
        case 'n':
            // Numeric representation of a month, without leading zeros
            // 1 through 12
            return numToString(month(date, utc), false);
        case 't':
            // Number of days in the given month
            // 28 through 31
            return numToString(numDaysInMonth(date, utc), false);
        case 'L':
            // Whether it's a leap year
            // 1 if it is a leap year, 0 otherwise.
            return isLeapYear(year(date, utc)) ? '1' : '0';
        case 'o':
            // ISO-8601 week-numbering year. This has the same value as Y, except that if the ISO week number (W) belongs to the previous or next year, that year is used instead.
            // Examples: 1999 or 2003
            return numToString(weekNumberingYearIso8601(date, utc), false);
        case 'Y':
            // A full numeric representation of a year, 4 digits
            // Examples: 1999 or 2003
            return numToString(year(date, utc), false);
        case 'y':
            // A two digit representation of a year
            // Examples: 99 or 03
            return numToString(year(date, utc), false).substr(2,2);
       case 'a':
            // Lowercase Ante meridiem and Post meridiem
            // am or pm
            return hour24(date, utc) < 12 ? 'am' : 'pm';
        case 'A':
            // Uppercase Ante meridiem and Post meridiem
            // AM or PM
            return hour24(date, utc) < 12 ? 'AM' : 'PM';
        case 'g':
            // 12-hour format of an hour without leading zeros
            // 1 through 12
            return numToString(hour12(date, utc), false);
        case 'G':
            // 24-hour format of an hour without leading zeros
            // 0 through 23
            return numToString(hour24(date, utc), false);
        case 'h':
            // 12-hour format of an hour with leading zeros
            // 01 through 12
            return numToString(hour12(date, utc), true);
        case 'H':
            // 24-hour format of an hour with leading zeros
            // 00 through 23
            return numToString(hour24(date, utc), true);
        case 'i':
            // Minutes with leading zeros
            // 00 to 59
            return numToString(minutes(date, utc), true);
        case 's':
            // Seconds with leading zeros
            // 00 through 59
            return numToString(seconds(date, utc), true);
        case 'v':
            // Milliseconds
            return numToString(milliseconds(date, utc), false);
        default:
            return char;
    }
};

const dateTimeFormat = function(format: string, date: Date|null, utc: boolean) {
    if (! date) {
        date = new Date();
    }
    let char: string;
    let out:string = '';
    for (let i = 0; i < format.length; i++) {
        char = format[i];
        if (char === '\\') {
            // Backslash escapes the next character
            i++;
            out += format[i];
        } else {
            out += dateTimeChar(char, date, utc);
        }
    }
    return out;
};

const ymdToDate = function(ymd: any): Date|null {
    if (typeof ymd == 'string') {
        const match = /^(\d\d\d\d)-(\d\d)-(\d\d)/.exec(ymd.replace(/\s/g, ''));
        if (match) {
            const year = parseInt(match[1], 10);
            const month = parseInt(match[2], 10) - 1;
            const date =  parseInt(match[3], 10);
            return new Date(Date.UTC(year, month, date, 0, 0, 0, 0));
        }
    }
    return null;
};

const ymdToFormat = function(ymd: any, format: string) {
    const date = ymdToDate(ymd);
    if (date) {
        return dateTimeFormat(format, date, true);
    } else {
        return null;
    }
};

const ymdHisToDate = function(ymdHis: any) {
    if (typeof ymdHis == 'string') {
        // look for Y-m-d H:i:s format (eg 2020-06-30 07:36:15)
        let match = /^(\d\d\d\d)-(\d\d)-(\d\d) (\d\d):(\d\d):(\d\d)$/.exec(ymdHis.trim());
        if (! match) {
            // also accept PHP's default timestamp format (eg 2020-06-30T07:36:15.000000Z)
            match = /^(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)(\.\d+)Z$/.exec(ymdHis.trim());
        }
        if (! match) {
            return null;
        }
        const year = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1;
        const date =  parseInt(match[3], 10);
        const hours = parseInt(match[4], 10);
        const mins = parseInt(match[5], 10);
        const secs = parseInt(match[6], 10);
        return new Date(Date.UTC(year, month, date, hours, mins, secs, 0));
    }
};

const ymdHisToFormat = function(ymdHis: any, format: string) {
    let date = ymdHisToDate(ymdHis);
    if (date) {
        return dateTimeFormat(format, date, true);
    } else {
        return null;
    }
};

const tsToFormat = function(ts: any, format: string, utc: boolean) {
    if (typeof ts == 'number') {
        const date = new Date(ts);
        return dateTimeFormat(format, date, utc);
    } else {
        return null;
    }
};

export { isLeapYear, dateTimeFormat, ymdToDate, ymdToFormat, ymdHisToDate, ymdHisToFormat, tsToFormat };
