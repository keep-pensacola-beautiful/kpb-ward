import { TreePlantingEventModel } from '../../../models/event';
import { ErrorModel } from '../../../models';
import { 
    isFormDataEntryValueNullOrBlank,
    validateCount,
    validateDate,
    validateSimpleTextField
} from '../../../utils/commonFormValidation';
import { TREE_PLANTING_FORM_DATA_IDS } from '../otherJson';
import { DECIMAL_4_DOT_2_MAX, UNSIGNED_SMALL_INT_MAX } from '../../../constValues';

export function validateTreePlantingData(formData: FormData): { data: TreePlantingEventModel | null, errors: Map<string, ErrorModel> } {
    let errors: Map<string, ErrorModel> = new Map<string, ErrorModel>();

    const dateValidation = validateDate(errors, formData.get(TREE_PLANTING_FORM_DATA_IDS.date), TREE_PLANTING_FORM_DATA_IDS.date);
    errors = dateValidation.errors;

    const treesPlantedValidation = validateCount(
        errors,
        formData.get(TREE_PLANTING_FORM_DATA_IDS.treesPlanted),
        TREE_PLANTING_FORM_DATA_IDS.treesPlanted,
        'Number of Trees Planted',
        UNSIGNED_SMALL_INT_MAX,
        'count',
        false
    );
    errors = treesPlantedValidation.errors;

    const descriptionValidation = validateSimpleTextField(
        errors,
        formData.get(TREE_PLANTING_FORM_DATA_IDS.description),
        TREE_PLANTING_FORM_DATA_IDS.description,
        'Event Description',
        70
    );
    errors = descriptionValidation.errors;

    let volunteerCountValidation: { count: number | null, errors: Map<string, ErrorModel> } =
        { count: null, errors: errors};
    let volunteerHoursValidation: { count: number | null, errors: Map<string, ErrorModel> } =
        { count: null, errors: errors};
    const hasVolunteers: FormDataEntryValue | null = formData.get(TREE_PLANTING_FORM_DATA_IDS.hasVolunteers);
    if (isFormDataEntryValueNullOrBlank(hasVolunteers)) {
        const error: ErrorModel = {
            inputId: `has-volunteers-no`,
            fieldName: 'Were there any volunteers',
            message: 'Please select whether there were volunteers at the event or not.'
        };
        errors.set(`${TREE_PLANTING_FORM_DATA_IDS.hasVolunteers}-no`, error);
    } else if (hasVolunteers && hasVolunteers.toString() === 'yes') {
        volunteerCountValidation = validateCount(
            errors,
            formData.get(TREE_PLANTING_FORM_DATA_IDS.volunteerCount),
            TREE_PLANTING_FORM_DATA_IDS.volunteerCount,
            'Number of Volunteers',
            UNSIGNED_SMALL_INT_MAX,
            'count',
            false
        );
        errors = volunteerCountValidation.errors;

        volunteerHoursValidation = validateCount(
            errors,
            formData.get(TREE_PLANTING_FORM_DATA_IDS.volunteerHours),
            TREE_PLANTING_FORM_DATA_IDS.volunteerHours,
            'Volunteer Hours',
            DECIMAL_4_DOT_2_MAX,
            'hours',
            false,
            2
        );
        errors = volunteerHoursValidation.errors;
    }

    let data: TreePlantingEventModel | null = null;
    if (errors.size === 0 && dateValidation.date &&
        treesPlantedValidation.count &&
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
            treesPlanted: treesPlantedValidation.count,
            eventDescription: descriptionValidation.text,
            volunteerCount: volunteerCountValidation.count ? volunteerCountValidation.count : 0,
            volunteerHours: volunteerHoursValidation.count ? volunteerHoursValidation.count : 0.00
        };
    }
    return { data: data, errors: errors };
}