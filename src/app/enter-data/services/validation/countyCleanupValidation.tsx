import { CountyCleanupEventModel } from '../../../models/event';
import { BulkyItemModel, ErrorModel } from '../../../models';
import { COUNTY_CLEANUP_FORM_DATA_IDS } from '../servicesJson';
import { 
    isFormDataEntryValueNullOrBlank,
    validateCount,
    validateDate,
    validatePounds,
    validateBulkyItems
} from '../../../utils/commonFormValidation';
import { UNSIGNED_SMALL_INT_MAX } from '../../../constValues';

export async function validateCountyCleanupData(
    formData: FormData, selectedBulkyItemValues: string[]
): Promise<{ data: CountyCleanupEventModel | null, errors: Map<string, ErrorModel> }> {
    let errors: Map<string, ErrorModel> = new Map<string, ErrorModel>();

    const dateValidation = validateDate(errors, formData.get(COUNTY_CLEANUP_FORM_DATA_IDS.date), COUNTY_CLEANUP_FORM_DATA_IDS.date);
    errors = dateValidation.errors;

    const tireCountValidation = validateCount(
        errors,
        formData.get(COUNTY_CLEANUP_FORM_DATA_IDS.tiresCollected),
        COUNTY_CLEANUP_FORM_DATA_IDS.tiresCollected,
        'Number of Tires Collected',
        UNSIGNED_SMALL_INT_MAX,
        'count',
        true
    );
    errors = tireCountValidation.errors;

    const canAndChemicalCountValidation = validateCount(
        errors,
        formData.get(COUNTY_CLEANUP_FORM_DATA_IDS.cansChemicalsCollected),
        COUNTY_CLEANUP_FORM_DATA_IDS.cansChemicalsCollected,
        'Number of Paint Can/Household Chemicals Collected',
        UNSIGNED_SMALL_INT_MAX,
        'count',
        true
    );
    errors = canAndChemicalCountValidation.errors;
    
    let bulkyItemValidation: { bulkyItems: BulkyItemModel[] | null, errors: Map<string, ErrorModel> } =
        { bulkyItems: null, errors: errors};
    let bulkyItemPoundsValidation: { pounds: number | null, errors: Map<string, ErrorModel> } =
        { pounds: null, errors: errors};
    const hasBulkyItems: FormDataEntryValue | null = formData.get(COUNTY_CLEANUP_FORM_DATA_IDS.hasBulkyItems);
    if (isFormDataEntryValueNullOrBlank(hasBulkyItems)) {
        errors.set(`${COUNTY_CLEANUP_FORM_DATA_IDS.hasBulkyItems}-no`, {
            inputId: `${COUNTY_CLEANUP_FORM_DATA_IDS.hasBulkyItems}-no`,
            fieldName: 'Were any other bulky items collected',
            message: 'Please select whether bulky items were collected or not.'
        });
    } else if (hasBulkyItems !== null && hasBulkyItems.toString() === 'yes') {
        bulkyItemValidation = await validateBulkyItems(
            errors,
            formData,
            selectedBulkyItemValues,
            COUNTY_CLEANUP_FORM_DATA_IDS.bulkyItems,
            UNSIGNED_SMALL_INT_MAX,
            `${COUNTY_CLEANUP_FORM_DATA_IDS.bulkyItems}-search`
        );
        errors = bulkyItemValidation.errors;

        bulkyItemPoundsValidation = validatePounds(
            errors,
            formData.get(COUNTY_CLEANUP_FORM_DATA_IDS.bulkyItemWeight),
            COUNTY_CLEANUP_FORM_DATA_IDS.bulkyItemWeight,
            'Estimated Weight of Other Bulky Items',
            UNSIGNED_SMALL_INT_MAX,
            false
        );
        errors = bulkyItemPoundsValidation.errors;
    }

    let data: CountyCleanupEventModel | null = null;
    if (errors.size === 0 && dateValidation.date &&
        (tireCountValidation.count || tireCountValidation.count === 0) &&
        (canAndChemicalCountValidation.count || canAndChemicalCountValidation.count === 0) &&
        (
            hasBulkyItems && hasBulkyItems.toString() === 'no' ||
            (bulkyItemValidation.bulkyItems && bulkyItemPoundsValidation.pounds)
        )
    ) {
        data = {
            date: dateValidation.date,
            tireCount: tireCountValidation.count,
            paintCanAndHouseholdChemicalCount: canAndChemicalCountValidation.count,
            otherBulkyItems: bulkyItemValidation.bulkyItems ? bulkyItemValidation.bulkyItems : [],
            otherBulkyItemPounds: bulkyItemPoundsValidation.pounds ? bulkyItemPoundsValidation.pounds : 0
        };
    }
    return { data: data, errors: errors };
}