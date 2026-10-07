import { useState } from 'react';
import { MultiSelect, Textbox } from '../../components';
import { ErrorModel } from '../../models';
import { ifErrorThenGetErrorText } from '../../utils/ifErrorThenGetErrorText';

export function BulkyItems({ bulkyItemId, bulkyItemsReferenceString, isRequired, defaultSelectedItems, errors, handleBulkyItemChange }: {
    bulkyItemId: string,
    bulkyItemsReferenceString: string,
    isRequired?: boolean,
    errors: Map<string, ErrorModel>,
    defaultSelectedItems?: Map<string, { quantityId: string, label: string, quantity?: number }>,
    handleBulkyItemChange?: (event: any) => void }
) {
    const [bulkyItemQuantityInputs, setBulkyItemQuantityInputs] = useState<Map<string, { quantityId: string, label: string }>>(
        defaultSelectedItems !== undefined ? defaultSelectedItems : new Map<string, { quantityId: string, label: string }>()
    );

    const BULKY_ITEMS_LABEL: string = 'Bulky Items Collected';
    const BULKY_ITEMS_DESCRIPTION: string = 'Please select each bulky item collected in the multi-select. Use the search bar to filter the bulky item options.';

    function handleChange(event: any) {
        if (event) {
            let selectedBulkyItemValues: string[] = [];
            if (event?.target?.checked && !bulkyItemQuantityInputs.has(event.target.id)) {
                let copyOfQuantityInputs: any[] = Array.from(bulkyItemQuantityInputs);
                console.log(copyOfQuantityInputs);
                copyOfQuantityInputs.push([event.target.id, { quantityId: `bulky-item-${event.target.value.split('|')[1]}-quantity`, label: event.target.labels[0].textContent }]);
                copyOfQuantityInputs.sort((itemA: any[], itemB: any[]) => {
                    return itemA[0].match(/\d+/)[0] - itemB[0].match(/\d+/);
                });
                setBulkyItemQuantityInputs(new Map<string, {quantityId: string, label: string}>(copyOfQuantityInputs));
                if (handleBulkyItemChange) {
                    copyOfQuantityInputs.map((input) => selectedBulkyItemValues.push(`${input[1].label}|${input[1].quantityId.match(/\d+/)}`));
                    handleBulkyItemChange(selectedBulkyItemValues);
                }
            } else {
                if (bulkyItemQuantityInputs.has(event.target.id)) {
                    let copyOfQuantityInputs: Map<string, any> = new Map<string, any>(Array.from(bulkyItemQuantityInputs));
                    copyOfQuantityInputs.delete(event.target.id);
                    setBulkyItemQuantityInputs(copyOfQuantityInputs);
                    if (handleBulkyItemChange) {
                        Array.from(copyOfQuantityInputs).map((input) => selectedBulkyItemValues.push(`${input[1].label}|${input[1].quantityId.match(/\d+/)}`));
                        handleBulkyItemChange(selectedBulkyItemValues);
                    }
                }
            }
        }
    }

    return (
        <span className="flex flex-col gap-4 mt-3">
            <MultiSelect
                label={BULKY_ITEMS_LABEL}
                multiSelectName={bulkyItemId}
                options={bulkyItemsReferenceString}
                descriptionText={BULKY_ITEMS_DESCRIPTION}
                isRequired={isRequired}
                hasSearch={true}
                orientation="grid"
                selectedValuesMap={bulkyItemQuantityInputs}
                errorText={ifErrorThenGetErrorText(errors, bulkyItemId)}
                handleChange={handleChange}>
            </MultiSelect>
            { bulkyItemQuantityInputs.size > 0 && 
                <div>
                    <fieldset>
                        <legend><p className="text-[1.06rem] font-semibold">Bulky Item Quantities</p></legend>
                        <div className="flex flex-col gap-2">
                            { Array.from(bulkyItemQuantityInputs).map((input) => 
                                (
                                    <Textbox
                                        key={`${input[1].quantityId}-key`}
                                        inputId={input[1].quantityId}
                                        inputType="number"
                                        inputName={input[1].quantityId}
                                        labelText={`${input[1].label} Quantity`}
                                        isRequired={true}
                                        labelFontWeight="font-normal"
                                        width="sm:w-24"
                                        defaultValue={defaultSelectedItems !== undefined ? `${defaultSelectedItems.get(input[0])?.quantity}` : undefined}
                                        errorText={ifErrorThenGetErrorText(errors, input[1].quantityId)}>
                                    </Textbox>
                                )
                            )}
                        </div>
                    </fieldset>
                </div>
            }
        </span>
    );
}