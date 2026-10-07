import { useEffect, useState } from 'react';
import {
    MultiSelect,
    RadioList,
    Textarea,
    Textbox
} from '../../../components';
import { BulkyItemModel, DistrictModel, ErrorModel } from '../../../models';
import { ifErrorThenGetErrorText } from '../../../utils/ifErrorThenGetErrorText';
import { BulkyItems } from '../bulkyItems';
import { ROADSIDE_LITTER_FORM_DATA_IDS, HAS_BULKY_ITEMS_OPTIONS } from '../servicesJson';
import { RoadsideLitterEventModel } from '../../../models/event';
import { MultiSelectOptionModel } from '../../../components/multiSelect/multiSelectOption.model';
import { uncapitalizeString } from '../../../utils/uncapitalizeString';

export function RoadsideLitterFormFields({ data, bulkyItemsReferenceString, districtsReferenceString, errors, handleBulkyItemChange }: {
    data?: RoadsideLitterEventModel
    bulkyItemsReferenceString: string,
    districtsReferenceString: string,
    errors: Map<string, ErrorModel>,
    handleBulkyItemChange?: (event: any) => void
}) {
    const [hasBulkyItems, setHasBulkyItems] = useState<string>('no');
    const [selectedDistricts, setSelectedDistricts] = useState<Map<string, string>>(new Map<string, string>());
    const [defaultSelectedItems, setDefaultSelectedItems] =
        useState<Map<string, { quantityId: string, label: string, quantity?: number }>>(new Map());
    const [districtRefString, setDistrictRefString] = useState<string>('[]');

    useEffect(() => {
        if (data !== undefined) {
            if (data.bulkyItems.length > 0) {
                handlePreviouslySelectedBulkyItems(data.bulkyItems);
            }
            if (data.districts.length > 0) {
                handlePreviouslySelectedDistricts(data.districts, JSON.parse(districtsReferenceString));
            }
        } else {
            setDistrictRefString(districtsReferenceString);
        }
    }, [data, districtsReferenceString])

    function handlePreviouslySelectedBulkyItems(prevSelectedItems: BulkyItemModel[]): void {
        let selectedItemValues: string[] = [];
        const fullBulkyItemList: MultiSelectOptionModel[] = JSON.parse(bulkyItemsReferenceString);
        const fullBulkyItemMap: Map<string, string> = new Map();
        for (let i = 0; i < fullBulkyItemList.length; i++) {
            fullBulkyItemMap.set(fullBulkyItemList[i].label, fullBulkyItemList[i].inputId);
        }
        const formattedItemArray: [string, {quantityId: string, label: string, quantity?: number}][] = [];
        let bulkyItemInputId: string | undefined;
        let itemToPush: [string, {quantityId: string, label: string, quantity?: number}];
        prevSelectedItems.map((item) => {
            bulkyItemInputId = fullBulkyItemMap.get(item.bulkyItemRef.description);
            itemToPush = [
                bulkyItemInputId !== undefined ? bulkyItemInputId : 'bulky-item',
                {
                    quantityId: `bulky-item-${item.bulkyItemRef.code}-quantity`,
                    label: item.bulkyItemRef.description,
                    quantity: item.quantity
                }
            ]; 
            formattedItemArray.push(itemToPush);
            selectedItemValues.push(`${itemToPush[1].label}|${item.bulkyItemRef.code}`);
        });
        setHasBulkyItems('yes');
        setDefaultSelectedItems(new Map<string, { quantityId: string, label: string }>(formattedItemArray));
        if (handleBulkyItemChange) {
            handleBulkyItemChange(selectedItemValues);
        }
    }

    async function handlePreviouslySelectedDistricts(districts: DistrictModel[], districtOptions: MultiSelectOptionModel[]) {
        let prevSelectedDistricts: Map<string, string> = new Map<string, string>();
        for (let i = 0; i < districts.length; i++) {
            let key: string = uncapitalizeString(districts[i].districtRef.description).replace(' ', '-');
            prevSelectedDistricts.set(key, `${districts[i].districtRef.code}`);
        }
        // if (prevSelectedDistricts.size > 0) {
        //     districtOptions.map((district: MultiSelectOptionModel) => {
        //         if (prevSelectedDistricts.has(district.inputId)) {
        //             district.checked = true;
        //         }
        //     });
        //     setTimeout(() => { setDistrictRefString(JSON.stringify(districtOptions)); }, 100)
            
        // }
        setSelectedDistricts(prevSelectedDistricts);
    }

    function handleChangeDistrict(event: any) {
        let copyOfDistricts: Map<string, string> = new Map(Array.from(selectedDistricts));
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
                defaultValue={data !== undefined ? data.date : undefined}
                errorText={ifErrorThenGetErrorText(errors, ROADSIDE_LITTER_FORM_DATA_IDS.date)}>
            </Textbox>
            <Textbox
                inputId={ROADSIDE_LITTER_FORM_DATA_IDS.litterPounds}
                inputType="number"
                labelText="Pounds of Litter Collected"
                width="sm:w-24"
                isRequired={true}
                defaultValue={data !== undefined ? `${data.litterPounds}` : undefined}
                errorText={ifErrorThenGetErrorText(errors, ROADSIDE_LITTER_FORM_DATA_IDS.litterPounds)}>
            </Textbox>
            <Textbox
                inputId={ROADSIDE_LITTER_FORM_DATA_IDS.recyclingPounds}
                inputType="number"
                labelText="Pounds of Recycling Collected"
                width="sm:w-24"
                isRequired={true}
                defaultValue={data !== undefined ? `${data.recyclingPounds}` : undefined}
                errorText={ifErrorThenGetErrorText(errors, ROADSIDE_LITTER_FORM_DATA_IDS.recyclingPounds)}>
            </Textbox>
            <MultiSelect
                label="Districts"
                multiSelectName={ROADSIDE_LITTER_FORM_DATA_IDS.districts}
                options={districtRefString}
                descriptionText="Please select all districts where litter was collected."
                isRequired={true}
                selectedValuesMap={selectedDistricts}
                handleChange={handleChangeDistrict}
                errorText={ifErrorThenGetErrorText(errors, `${ROADSIDE_LITTER_FORM_DATA_IDS.districts}-1`)}>
            </MultiSelect>
            <Textarea
                textareaId={ROADSIDE_LITTER_FORM_DATA_IDS.locations}
                labelText="Locations"
                descriptionText="Please enter the street locations where litter was collected. Please separate each street with a comma."
                maxlength={300}
                isRequired={true}
                defaultValue={data !== undefined ? `${data.locations}` : undefined}
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
                    defaultSelectedItems={defaultSelectedItems}
                    errors={errors}
                    handleBulkyItemChange={handleBulkyItemChange}>
                </BulkyItems>
            }
        </div>
    );
}