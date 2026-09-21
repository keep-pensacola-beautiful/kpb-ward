import { MONTHS } from '../constValues';

function getMonthText(monthNum: number): string {
    const monthTextValues: Map<number, string> = new Map<number, string>(MONTHS);
    if (monthTextValues.has(monthNum)) {
        let monthText: string | undefined = monthTextValues.get(monthNum);
        return monthText ? monthText : '';
    }
    return '';
}

/**
 * Transforms the date parameter into a formatted date using the following format:
 * [Full Month] [Day], [Full Year] (e.g., March 2, 2026).
 * @param date a string representation of a date in SQL format (e.g., 2026-07-21)
 * @returns
 */
export function getFormattedDate(date: string): string {
    const dateParts: string[] = date.split('-');
    return `${getMonthText(Number(dateParts[1]))} ${dateParts[2]}, ${dateParts[0]}`;
}