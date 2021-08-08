
const isLeapYear = function(year: number): boolean {
    // Construct a date on the 29th of Feb for the year in question
    // If it gets changed to March 1st then it's not a leap year
    const d1 = new Date(Date.UTC(year, 1, 29));
    return (d1.getUTCDate() === 29);
};

export { isLeapYear };
