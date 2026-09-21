import { isBlank } from './isBlank';
import { BulkyItemModel, ErrorModel, ReferenceDataModel } from '../models';
import { BulkyItemReferenceDataDAO } from '../dao/referenceData';

/**
 * Check if the value parameter is null or blank.
 * @param value 
 * @returns true if null or blank
 */
export function isFormDataEntryValueNullOrBlank(value: FormDataEntryValue | null): boolean {
    return value === null || isBlank(value.toString());
}

/**
 * Check if the valueArray parameter is null or empty.
 * @param valueArray 
 * @returns true if null or empty
 */
export function isFormDataEntryValueArrayNullOrEmpty(valueArray: FormDataEntryValue[]): boolean {
    return valueArray === null || valueArray.length === 0;
}

export async function validateComboBox(
    errors: Map<string, ErrorModel>, selectedId: string, inputId: string, fieldName: string, optionDescriptor: string, dao: any
): Promise<{ selection: any, errors: Map<string, ErrorModel> }> {
    if (isBlank(selectedId)) {
        const error: ErrorModel = {
            inputId: inputId,
            fieldName: fieldName,
            message: `Please select a ${optionDescriptor}`
        };
        errors.set(inputId, error);
        return { selection: null, errors: errors };
    } else {
        let selection: any = null;
        if (dao && 'getByCode' in dao) {
            selection = await dao.getByCode(selectedId.trim());
        } else if (dao && 'getById' in dao && !Number.isNaN(Number(selectedId.trim()))) {
            selection = await dao.getById(Number(selectedId.trim()));
        }
        if (!selection) {
            const error: ErrorModel = {
                inputId: inputId,
                fieldName: fieldName,
                message: `Invalid ${optionDescriptor} selected with id: '${selectedId.toString().trim()}'`
            };
            errors.set(inputId, error);
            return { selection: null, errors: errors };
        } else {
            return { selection: selection, errors: errors };
        }
    }
}

export function validateDate(
    errors: Map<string, ErrorModel>,
    value: FormDataEntryValue | null,
    inputId: string
): { date: string | null, errors: Map<string, ErrorModel> } {
    if (isFormDataEntryValueNullOrBlank(value)) {
        const error: ErrorModel = {
            inputId: inputId,
            fieldName: 'Date',
            message: 'Please enter a date'
        };
        errors.set(inputId, error);
    } else {
        const dateString: string | undefined = value?.toString();
        const dateAsTimestamp: number = Date.parse(dateString ? dateString : '');
        if (Number.isNaN(dateAsTimestamp)) {
            const error: ErrorModel = {
                inputId: inputId,
                fieldName: 'Date',
                message: `Wrong format, please use this format: 'yyyy-mm-dd'`
            };
            errors.set(inputId, error);
        } else {
            if (dateAsTimestamp > Date.now()) {
                const error: ErrorModel = {
                    inputId: inputId,
                    fieldName: 'Date',
                    message: `Cannot be a future date, please enter today's date or a past date`
                };
                errors.set(inputId, error);
            } else {
                return { date: value ? value.toString() : null, errors: errors };
            }
        }
    }
    return { date: null, errors: errors };
}

export function validatePounds(
    errors: Map<string, ErrorModel>,
    value: FormDataEntryValue | null,
    inputId: string,
    fieldName: string,
    maxPounds: number,
    allowZero: boolean
): { pounds: number | null, errors: Map<string, ErrorModel> } {
    if (isFormDataEntryValueNullOrBlank(value)) {
        const error: ErrorModel = {
            inputId: inputId,
            fieldName: fieldName,
            message: `Please enter the pounds collected`
        };
        errors.set(inputId, error);
    } else {
        const poundsString: string | undefined = value?.toString();
        if (Number.isNaN(Number(poundsString))) {
            const error: ErrorModel = {
                inputId: inputId,
                fieldName: fieldName,
                message: 'Please enter only digits'
            };
            errors.set(inputId, error);
        } else {
            const pounds: number = Number(poundsString);
            if (!allowZero && (pounds === 0 || pounds > maxPounds)) {
                const error: ErrorModel = {
                    inputId: inputId,
                    fieldName: fieldName,
                    message: `Please enter a number greater than 0 and less than ${maxPounds}`
                };
                errors.set(inputId, error);
            } else if (pounds < 0 || pounds > maxPounds) {
                const error: ErrorModel = {
                    inputId: inputId,
                    fieldName: fieldName,
                    message: `Please enter a non-negative number less than ${maxPounds}`
                };
                errors.set(inputId, error);
            } else {
                return { pounds: Number(poundsString), errors: errors };
            }
        }
    }
    return { pounds: null, errors: errors };
}

export function validateCount(
    errors: Map<string, ErrorModel>,
    value: FormDataEntryValue | null,
    inputId: string,
    fieldDescription: string,
    maxCount: number,
    unitOfMeasurement: string,
    allowZero: boolean,
    decimalPlacesAllowed?: number
): { count: number | null, errors: Map<string, ErrorModel> } {
    if (isFormDataEntryValueNullOrBlank(value)) {
        const error: ErrorModel = {
            inputId: inputId,
            fieldName: fieldDescription,
            message: `Please enter the ${unitOfMeasurement}`
        };
        errors.set(inputId, error);
    } else {
        const countString: string | undefined = value?.toString();
        if (Number.isNaN(Number(countString))) {
            const error: ErrorModel = {
                inputId: inputId,
                fieldName: fieldDescription,
                message: `Please enter only digits`
            };
            errors.set(inputId, error);
        } else {
            const count: number = Number(countString);
            if (!decimalPlacesAllowed && (count - Math.floor(count)) !== 0) {
                const error: ErrorModel = {
                    inputId: inputId,
                    fieldName: fieldDescription,
                    message: `Please enter a whole number`
                };
                errors.set(inputId, error);
            } else if (decimalPlacesAllowed && countString && countString.split('.').length === 2 && countString.split('.')[1].length > decimalPlacesAllowed) {
                const error: ErrorModel = {
                    inputId: inputId,
                    fieldName: fieldDescription,
                    message: `Please enter a number with ${decimalPlacesAllowed} or less digits after the decimal.`
                };
                errors.set(inputId, error);
            } else {
                if (!allowZero && (count === 0 || count > maxCount)) {
                    const error: ErrorModel = {
                        inputId: inputId,
                        fieldName: fieldDescription,
                        message: `Please enter a number greater than 0 and less than ${maxCount}`
                    };
                    errors.set(inputId, error);
                } else if (count < 0 || count > maxCount) {
                    const error: ErrorModel = {
                        inputId: inputId,
                        fieldName: fieldDescription,
                        message: `Please enter a non-negative number less than ${maxCount}`
                    };
                    errors.set(inputId, error);
                } else {
                    return { count: Number(countString), errors: errors };
                }
            }
        }
    }
    return { count: null, errors: errors };
}

export function validateSimpleTextField(
    errors: Map<string, ErrorModel>,
    value: FormDataEntryValue | null,
    inputId: string,
    fieldDescription: string,
    maxLength: number
): { text: string | null, errors: Map<string, ErrorModel> } {
    if (isFormDataEntryValueNullOrBlank(value)) {
        const error: ErrorModel = {
            inputId: inputId,
            fieldName: fieldDescription,
            message: `Please enter the ${fieldDescription}`
        };
        errors.set(inputId, error);
    } else if (`${value}`.length > maxLength) {
        const error: ErrorModel = {
            inputId: inputId,
            fieldName: fieldDescription,
            message: `Max character count is ${maxLength}, please reduce by at least ${`${value}`.length - maxLength} characters`
        };
        errors.set(inputId, error);
    } else {
        return { text: `${value}`, errors: errors };
    }
    return { text: null, errors: errors };
}

export async function validateBulkyItems(
    errors: Map<string, ErrorModel>,
    formData: FormData,
    selectedBulkyItemValues: string[],
    inputId: string,
    maxQuantity: number,
    searchId?: string
): Promise<{ bulkyItems: BulkyItemModel[] | null, errors: Map<string, ErrorModel> }> {
    let quantityErrors: Map<string, ErrorModel> = new Map<string, ErrorModel>();
    const startingErrorCount: number = errors.size;
    let validBulkyItems: BulkyItemModel[] = [];
    if (isFormDataEntryValueArrayNullOrEmpty(selectedBulkyItemValues)) {
        const error: ErrorModel = {
            inputId: searchId ? searchId : `${inputId}-1`,
            fieldName: 'Bulky Items Collected',
            message: 'Please select at least one bulky item'
        };
        errors.set(inputId, error);
    } else {
        const bulkyItemRefDataDAO: BulkyItemReferenceDataDAO = new BulkyItemReferenceDataDAO();
        const bulkyItems: ReferenceDataModel[] = await bulkyItemRefDataDAO.getAll();
        if (bulkyItems && bulkyItems.length >= 1) {
            const bulkyItemsMap = new Map<string, string>();
            bulkyItems.map((item: ReferenceDataModel) => bulkyItemsMap.set(`${item.code}`, item.description ? item.description : ''));
            
            selectedBulkyItemValues.map((value: FormDataEntryValue) => {
                const [itemLabel, itemId] = value.toString().trim().split('|');
                if (!bulkyItemsMap.has(itemId)) {
                    const error: ErrorModel = {
                        inputId: searchId ? searchId : `${inputId}-1`,
                        fieldName: 'Bulky Items Collected',
                        message: `Invalid bulky item selected with id: '${itemId}'`
                    };
                    errors.set(inputId, error);
                }
                
                const beforeValidationErrorCount = quantityErrors.size;
                const quantityValidation = validateCount(
                    quantityErrors,
                    formData.get(`bulky-item-${itemId}-quantity`),
                    `bulky-item-${itemId}-quantity`,
                    `${itemLabel} Quantity`,
                    maxQuantity,
                    'quantity',
                    false
                );
                if (quantityValidation.errors.size === beforeValidationErrorCount && quantityValidation.count) {
                    validBulkyItems.push({ bulkyItemRef: { code: itemId, description: '' }, quantity: quantityValidation.count });
                }
            });
            quantityErrors.forEach((value, key) => errors.set(
                key,
                { inputId: value.inputId, fieldName: value.fieldName, message: value.message }
            ));
        }
    }
    if (errors.size > startingErrorCount) {
        return { bulkyItems: null, errors: errors };
    } else {
        return { bulkyItems: validBulkyItems, errors: errors };
    }
}