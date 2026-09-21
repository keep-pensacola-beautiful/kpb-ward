/**
 * Capitalize the first letter of the str parameter.
 * @param str 
 * @returns 
 */
export function capitalizeString(str: string) {
    return str.replace(/^./, str[0].toUpperCase());
}