/**
 * Transform the first letter of the str parameter to lowercase.
 * @param str 
 * @returns 
 */
export function uncapitalizeString(str: string) {
    return str.replace(/^./, str[0].toLowerCase());
}