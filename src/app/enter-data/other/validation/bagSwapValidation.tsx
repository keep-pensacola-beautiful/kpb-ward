import { BagSwapEventModel } from '../../../models/event';
import { ErrorModel } from '../../../models';
import {
    isFormDataEntryValueNullOrBlank,
    validateCount,
    validateDate,
    validateSimpleTextField
} from '../../../utils/commonFormValidation';
import { BAG_SWAP_FORM_DATA_IDS } from '../otherJson';
import { DECIMAL_3_DOT_2_MAX, UNSIGNED_SMALL_INT_MAX } from '../../../constValues';

export function validateBagSwapData(formData: FormData): { data: BagSwapEventModel | null, errors: Map<string, ErrorModel> } {
    let errors: Map<string, ErrorModel> = new Map<string, ErrorModel>();

    const dateValidation = validateDate(errors, formData.get(BAG_SWAP_FORM_DATA_IDS.date), BAG_SWAP_FORM_DATA_IDS.date);
    errors = dateValidation.errors;

    const bagsCollectedValidation = validateCount(
        errors,
        formData.get(BAG_SWAP_FORM_DATA_IDS.bagsCollected),
        BAG_SWAP_FORM_DATA_IDS.bagsCollected,
        'Number of Bags Collected',
        UNSIGNED_SMALL_INT_MAX,
        'count',
        false
    );
    errors = bagsCollectedValidation.errors;

    const descriptionValidation = validateSimpleTextField(
        errors,
        formData.get(BAG_SWAP_FORM_DATA_IDS.description),
        BAG_SWAP_FORM_DATA_IDS.description,
        'Event Description',
        70
    );
    errors = descriptionValidation.errors;

    let volunteerCountValidation: { count: number | null, errors: Map<string, ErrorModel> } =
        { count: null, errors: errors};
    let volunteerHoursValidation: { count: number | null, errors: Map<string, ErrorModel> } =
        { count: null, errors: errors};
    const hasVolunteers: FormDataEntryValue | null = formData.get(BAG_SWAP_FORM_DATA_IDS.hasVolunteers);
    if (isFormDataEntryValueNullOrBlank(hasVolunteers)) {
        const error: ErrorModel = {
            inputId: `has-volunteers-no`,
            fieldName: 'Were there any volunteers',
            message: 'Please select whether there were volunteers at the event or not.'
        };
        errors.set(`${BAG_SWAP_FORM_DATA_IDS.hasVolunteers}-no`, error);
    } else if (hasVolunteers && hasVolunteers.toString() === 'yes') {
        volunteerCountValidation = validateCount(
            errors,
            formData.get(BAG_SWAP_FORM_DATA_IDS.volunteerCount),
            BAG_SWAP_FORM_DATA_IDS.volunteerCount,
            'Number of Volunteers',
            UNSIGNED_SMALL_INT_MAX,
            'count',
            false
        );
        errors = volunteerCountValidation.errors;

        volunteerHoursValidation = validateCount(
            errors,
            formData.get(BAG_SWAP_FORM_DATA_IDS.volunteerHours),
            BAG_SWAP_FORM_DATA_IDS.volunteerHours,
            'Volunteer Hours',
            DECIMAL_3_DOT_2_MAX,
            'hours',
            false,
            2
        );
        errors = volunteerHoursValidation.errors;
    }

    let data: BagSwapEventModel | null = null;
    if (errors.size === 0 && dateValidation.date &&
        bagsCollectedValidation.count &&
        descriptionValidation.text &&
        (
            hasVolunteers && hasVolunteers.toString() === 'no' ||
            (
                (volunteerCountValidation.count || volunteerCountValidation.count === 0) &&
                (volunteerHoursValidation.count || volunteerHoursValidation.count === 0)
            )
        )
    ) {
        data = {
            date: dateValidation.date,
            bagsCollected: bagsCollectedValidation.count,
            eventDescription: descriptionValidation.text,
            volunteerCount: volunteerCountValidation.count ? volunteerCountValidation.count : 0,
            volunteerHours: volunteerHoursValidation.count ? volunteerHoursValidation.count : 0.00
        };
    }
    return { data: data, errors: errors };
}