import { MONTHS } from '../constValues';

function getMonthText(monthNum: number): string {
    const monthTextValues: Map<number, string> = new Map<number, string>(MONTHS);
    if (monthTextValues.has(monthNum)) {
        let monthText: string | undefined = monthTextValues.get(monthNum);
        return monthText ? monthText : '';
    }
    return '';
}
export function getFormattedDate(date: string): string {
    const dateParts: string[] = date.split('-');
    return `${getMonthText(Number(dateParts[1]))} ${dateParts[2]}, ${dateParts[0]}`;
}