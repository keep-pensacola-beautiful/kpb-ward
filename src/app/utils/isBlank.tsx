/**
 * Checks if a string has any content.
 * @param str 
 * @returns true if the string is null, undefined, or empty
 */
export function isBlank(str: string | undefined | null) {
    return (!str || str.trim() === '');
}