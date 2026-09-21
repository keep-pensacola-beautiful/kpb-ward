import { ErrorModel } from '../models';

/**
 * Check the list of errors for the existence of the fieldInputId and return the
 * associated error message from the list of errors if it exists.
 * @param errors 
 * @param fieldInputId 
 * @returns the error message associated with the fieldInputId if it exists, otherwise blank
 */
export function ifErrorThenGetErrorText(errors: Map<string, ErrorModel>, fieldInputId: string) {
    return (errors && errors.size > 0 && errors.has(fieldInputId)) ? errors.get(fieldInputId)?.message : '';
}