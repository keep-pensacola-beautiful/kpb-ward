import { useEffect, useState } from 'react';
import { RadioList, Textbox } from '../../../components';
import { BulkyItemModel, ErrorModel } from '../../../models';
import { CountyCleanupEventModel } from '../../../models/event';
import { BulkyItems } from '../bulkyItems';
import { COUNTY_CLEANUP_FORM_DATA_IDS, HAS_BULKY_ITEMS_OPTIONS } from '../servicesJson';
import { ifErrorThenGetErrorText } from '../../../utils/ifErrorThenGetErrorText';
import { MultiSelectOptionModel } from '../../../components/multiSelect/multiSelectOption.model';

export function CountyCleanupFormFields({ data, bulkyItemsReferenceString, errors, handleBulkyItemChange }: {
    data?: CountyCleanupEventModel,
    bulkyItemsReferenceString: string,
    errors: Map<string, ErrorModel>,
    handleBulkyItemChange?: (selectedBulkyItemValues: string[]) => void
}) {
    const [hasBulkyItems, setHasBulkyItems] = useState('no');
    const [defaultSelectedItems, setDefaultSelectedItems] =
        useState<Map<string, { quantityId: string, label: string, quantity?: number }>>(new Map());

    useEffect(() => {
        if (data !== undefined && data.otherBulkyItems.length > 0) {
            handlePreviouslySelectedBulkyItems(data.otherBulkyItems);
        }
    }, [data])

    function handlePreviouslySelectedBulkyItems(prevSelectedItems: BulkyItemModel[]) {
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
    
    return (
        <div className="flex flex-col gap-4 mt-3">
            <Textbox
                inputId={COUNTY_CLEANUP_FORM_DATA_IDS.date}
                inputType="date"
                labelText="Date"
                descriptionText="Please enter the date that the items were collected."
                isRequired={true}
                defaultValue={data !== undefined ? data.date : undefined}
                errorText={ifErrorThenGetErrorText(errors, COUNTY_CLEANUP_FORM_DATA_IDS.date)}>
            </Textbox>
            <Textbox
                inputId={COUNTY_CLEANUP_FORM_DATA_IDS.tiresCollected}
                inputType="number"
                labelText="Number of Tires Collected"
                width="sm:w-24"
                isRequired={true}
                defaultValue={data !== undefined ? `${data.tireCount}` : undefined}
                errorText={ifErrorThenGetErrorText(errors, COUNTY_CLEANUP_FORM_DATA_IDS.tiresCollected)}>
            </Textbox>
            <Textbox
                inputId={COUNTY_CLEANUP_FORM_DATA_IDS.cansChemicalsCollected}
                inputType="number"
                labelText="Number of Paint Can/Household Chemicals Collected"
                width="sm:w-24"
                isRequired={true}
                defaultValue={data !== undefined ? `${data.paintCanAndHouseholdChemicalCount}` : undefined}
                errorText={ifErrorThenGetErrorText(errors, COUNTY_CLEANUP_FORM_DATA_IDS.cansChemicalsCollected)}>
            </Textbox>
            <RadioList
                label="Were any other bulky items collected?"
                listName={COUNTY_CLEANUP_FORM_DATA_IDS.hasBulkyItems}
                options={JSON.stringify(HAS_BULKY_ITEMS_OPTIONS)}
                isRequired={true}
                selectedValue={hasBulkyItems}
                handleChange={(event: any) => setHasBulkyItems(event.target.value)}>
            </RadioList>
            {  (hasBulkyItems === 'yes') &&
                <div>
                    <BulkyItems
                        bulkyItemId={COUNTY_CLEANUP_FORM_DATA_IDS.bulkyItems}
                        bulkyItemsReferenceString={bulkyItemsReferenceString}
                        isRequired={true}
                        defaultSelectedItems={defaultSelectedItems}
                        errors={errors}
                        handleBulkyItemChange={handleBulkyItemChange}>
                    </BulkyItems>
                    <div className="mt-4">
                        <Textbox
                            inputId={COUNTY_CLEANUP_FORM_DATA_IDS.bulkyItemWeight}
                            inputType="number"
                            labelText="Estimated Weight of Bulky Items"
                            descriptionText="Please enter an estimate of the combined weight of the bulky items collected, excluding tires, paint cans, and household chemicals."
                            width="sm:w-24"
                            isRequired={true}
                            defaultValue={data !== undefined ? `${data.otherBulkyItemPounds}` : undefined}
                            errorText={ifErrorThenGetErrorText(errors, COUNTY_CLEANUP_FORM_DATA_IDS.bulkyItemWeight)}>
                        </Textbox>
                    </div>
                </div>
            }
        </div>
    );
}