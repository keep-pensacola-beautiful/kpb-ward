import { RoadsideLitterEventModel } from '../../../models/event';
import { BulkyItemModel, DistrictModel, ErrorModel } from '../../../models';
import { ROADSIDE_LITTER_FORM_DATA_IDS } from '../servicesJson';
import { ReferenceDataModel } from '../../../models';
import { ReferenceDataDAO, DistrictReferenceDataDAO } from '../../../dao/referenceData';
import { 
    isFormDataEntryValueNullOrBlank,
    isFormDataEntryValueArrayNullOrEmpty,
    validateDate,
    validatePounds,
    validateSimpleTextField,
    validateBulkyItems
} from '../../../utils/commonFormValidation';
import { UNSIGNED_SMALL_INT_MAX } from '../../../constValues';

const MAX_ROADSIDE_LITTER_LOCATIONS_LENGTH: number = 300;

async function validateDistricts(errors: Map<string, ErrorModel>, values: FormDataEntryValue[], inputId: string
): Promise<{ districts: DistrictModel[] | null, errors: Map<string, ErrorModel> }> {
    const startingErrorCount: number = errors.size;
    let validDistricts: DistrictModel[] = [];
    if (isFormDataEntryValueArrayNullOrEmpty(values)) {
        const error: ErrorModel = {
            inputId: inputId,
            fieldName: 'Districts',
            message: 'Please select at least one district'
        };
        errors.set(inputId, error);
    } else {
        const districtRefDAO: ReferenceDataDAO = new DistrictReferenceDataDAO();
        const districts: ReferenceDataModel[] = await districtRefDAO.getAll();
        if (districts && districts.length >= 1) {
            const districtMap = new Map<string, string>();
            districts.map((district: ReferenceDataModel) => districtMap.set(`${district.code}`, district.description ? district.description : ''));
            values.map((value: FormDataEntryValue) => {
                if (!districtMap.has(value.toString().trim())) {
                    const error: ErrorModel = {
                        inputId: inputId,
                        fieldName: 'Districts',
                        message: `Invalid district selected with code: '${value.toString().trim()}'`
                    };
                    errors.set(inputId, error);
                } else {
                    validDistricts.push({ districtRef: { code: value.toString().trim(), description: '' }});
                }
            });
            
        }
    }
    if (errors.size > startingErrorCount) {
        return { districts: null, errors: errors };
    } else {
        return { districts: validDistricts, errors: errors }; 
    }
}

export async function validateRoadsideLitterData(
    formData: FormData, selectedBulkyItemValues: string[]
): Promise<{ data: RoadsideLitterEventModel | null, errors: Map<string, ErrorModel> }> {
    let errors: Map<string, ErrorModel> = new Map<string, ErrorModel>();

    const dateValidation = validateDate(errors, formData.get(ROADSIDE_LITTER_FORM_DATA_IDS.date), ROADSIDE_LITTER_FORM_DATA_IDS.date);
    errors = dateValidation.errors;

    const litterValidation = validatePounds(
        errors,
        formData.get(ROADSIDE_LITTER_FORM_DATA_IDS.litterPounds),
        ROADSIDE_LITTER_FORM_DATA_IDS.litterPounds,
        'Pounds of Litter Collected',
        UNSIGNED_SMALL_INT_MAX,
        true
    );
    errors = litterValidation.errors;

    const recyclingValidation = validatePounds(
        errors,
        formData.get(ROADSIDE_LITTER_FORM_DATA_IDS.recyclingPounds),
        ROADSIDE_LITTER_FORM_DATA_IDS.recyclingPounds,
        'Pounds of Recycling Collected',
        UNSIGNED_SMALL_INT_MAX,
        true
    );
    errors = recyclingValidation.errors;

    const districtValidation = await validateDistricts(
        errors,
        formData.getAll(ROADSIDE_LITTER_FORM_DATA_IDS.districts),
        `district-1`
    );
    errors = districtValidation.errors;

    const locationsValidation = validateSimpleTextField(
        errors,
        formData.get(ROADSIDE_LITTER_FORM_DATA_IDS.locations),
        ROADSIDE_LITTER_FORM_DATA_IDS.locations,
        'Locations',
        MAX_ROADSIDE_LITTER_LOCATIONS_LENGTH
    );
    errors = locationsValidation.errors;
    
    let bulkyItemValidation: { bulkyItems: BulkyItemModel[] | null, errors: Map<string, ErrorModel> } =
        { bulkyItems: null, errors: errors};
    const hasBulkyItems: FormDataEntryValue | null = formData.get(ROADSIDE_LITTER_FORM_DATA_IDS.hasBulkyItems);
    if (isFormDataEntryValueNullOrBlank(hasBulkyItems)) {
        const error: ErrorModel = {
            inputId: `${ROADSIDE_LITTER_FORM_DATA_IDS.hasBulkyItems}-no`,
            fieldName: 'Were any bulky items collected',
            message: 'Please select whether bulky items were collected or not.'
        };
        errors.set(`${ROADSIDE_LITTER_FORM_DATA_IDS.hasBulkyItems}-no`, error);
    } else if (hasBulkyItems && hasBulkyItems.toString() === 'yes') {
        bulkyItemValidation = await validateBulkyItems(
            errors,
            formData,
            selectedBulkyItemValues,
            ROADSIDE_LITTER_FORM_DATA_IDS.bulkyItems,
            UNSIGNED_SMALL_INT_MAX,
            `${ROADSIDE_LITTER_FORM_DATA_IDS.bulkyItems}-search`
        );
        errors = bulkyItemValidation.errors;
    }

    let data: RoadsideLitterEventModel | null = null;
    if (errors.size === 0 && dateValidation.date &&
        (litterValidation.pounds || litterValidation.pounds === 0) &&
        (recyclingValidation.pounds || recyclingValidation.pounds === 0) &&
        districtValidation.districts && locationsValidation.text &&
        (hasBulkyItems && hasBulkyItems.toString() === 'no' || bulkyItemValidation.bulkyItems)
    ) {
        data = {
            date: dateValidation.date,
            litterPounds: litterValidation.pounds,
            recyclingPounds: recyclingValidation.pounds,
            districts: districtValidation.districts,
            locations: locationsValidation.text,
            bulkyItems: bulkyItemValidation.bulkyItems ? bulkyItemValidation.bulkyItems : []
        };
    }
    return { data: data, errors: errors };
}