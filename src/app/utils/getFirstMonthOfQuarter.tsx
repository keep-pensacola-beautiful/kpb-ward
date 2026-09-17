const quarterToMonthConversion: number[] = [10, 1, 4, 7]; // [Oct, Jan, Apr, Jul]

/**
 * Takes a quarter (1, 2, 3, or 4) and returns the number of the first month within that quarter.
 * Quarters are based on KPB quarters. A quarter of 4 would return 7, which is July.
 * @param quarter 
 * @returns 
 */
export function getFirstMonthOfQuarter(quarter: number) {
    if (quarter < 1 || quarter > 4) {
        return -1;
    }
    return quarterToMonthConversion[quarter - 1];
}