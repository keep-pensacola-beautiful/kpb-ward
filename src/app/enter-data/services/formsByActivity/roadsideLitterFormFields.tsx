import { useState } from 'react';
import {
    MultiSelect,
    RadioList,
    Textarea,
    Textbox
} from '../../../components';
import { ErrorModel } from '../../../models';
import { ifErrorThenGetErrorText } from '../../../utils/ifErrorThenGetErrorText';
import { BulkyItems } from '../bulkyItems';
import { ROADSIDE_LITTER_FORM_DATA_IDS, HAS_BULKY_ITEMS_OPTIONS } from '../servicesJson';

export function RoadsideLitterFormFields({ bulkyItemsReferenceString, districtsReferenceString, errors, handleBulkyItemChange }:
    {
        bulkyItemsReferenceString: string,
        districtsReferenceString: string,
        errors: Map<string, ErrorModel>,
        handleBulkyItemChange?: (event: any) => void
    }
) {
    const [hasBulkyItems, setHasBulkyItems] = useState('no');
    const [selectedDistricts, setSelectedDistricts] = useState(new Map());

    function handleChangeDistrict(event: any) {
        let copyOfDistricts: Map<string, string> = new Map(JSON.parse(JSON.stringify(Array.from(selectedDistricts))));
        if (event?.target?.checked && !copyOfDistricts.has(event.target.id)) {
            copyOfDistricts.set(event.target.id, event.target.value);
        } else {
            if (copyOfDistricts.has(event.target.id)) {
                copyOfDistricts.delete(event.target.id);
            }
        }
        setSelectedDistricts(copyOfDistricts);
    }

    return (
        <div className="flex flex-col gap-4 mt-3">
            <Textbox
                inputId={ROADSIDE_LITTER_FORM_DATA_IDS.date}
                inputType="date"
                labelText="Date"
                descriptionText="Please enter the date that the litter was collected."
                isRequired={true}
                errorText={ifErrorThenGetErrorText(errors, ROADSIDE_LITTER_FORM_DATA_IDS.date)}>
            </Textbox>
            <Textbox
                inputId={ROADSIDE_LITTER_FORM_DATA_IDS.litterPounds}
                inputType="number"
                labelText="Pounds of Litter Collected"
                width="sm:w-24"
                isRequired={true}
                errorText={ifErrorThenGetErrorText(errors, ROADSIDE_LITTER_FORM_DATA_IDS.litterPounds)}>
            </Textbox>
            <Textbox
                inputId={ROADSIDE_LITTER_FORM_DATA_IDS.recyclingPounds}
                inputType="number"
                labelText="Pounds of Recycling Collected"
                width="sm:w-24"
                isRequired={true}
                errorText={ifErrorThenGetErrorText(errors, ROADSIDE_LITTER_FORM_DATA_IDS.recyclingPounds)}>
            </Textbox>
            <MultiSelect
                label="Districts"
                multiSelectName={ROADSIDE_LITTER_FORM_DATA_IDS.districts}
                options={districtsReferenceString}
                descriptionText="Please select all districts where litter was collected."
                isRequired={true}
                selectedValuesMap={selectedDistricts}
                handleChange={handleChangeDistrict}
                errorText={ifErrorThenGetErrorText(errors, `district-1`)}>
            </MultiSelect>
            <Textarea
                textareaId={ROADSIDE_LITTER_FORM_DATA_IDS.locations}
                labelText="Locations"
                descriptionText="Please enter the street locations where litter was collected. Please separate each street with a comma."
                maxlength={300}
                isRequired={true}
                errorText={ifErrorThenGetErrorText(errors, ROADSIDE_LITTER_FORM_DATA_IDS.locations)}>
            </Textarea>
            <RadioList
                label="Were any bulky items collected?"
                listName={ROADSIDE_LITTER_FORM_DATA_IDS.hasBulkyItems}
                options={JSON.stringify(HAS_BULKY_ITEMS_OPTIONS)}
                isRequired={true}
                selectedValue={hasBulkyItems}
                handleChange={(event: any) => setHasBulkyItems(event.target.value)}>
            </RadioList>
            {(hasBulkyItems === 'yes') &&
                <BulkyItems
                    bulkyItemId={ROADSIDE_LITTER_FORM_DATA_IDS.bulkyItems}
                    bulkyItemsReferenceString={bulkyItemsReferenceString}
                    isRequired={true}
                    errors={errors}
                    handleBulkyItemChange={handleBulkyItemChange}>
                </BulkyItems>
            }
        </div>
    );
}