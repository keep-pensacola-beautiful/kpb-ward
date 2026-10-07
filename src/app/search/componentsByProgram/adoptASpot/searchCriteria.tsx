import { useState } from 'react';
import { ComboBox, Textbox } from '../../../components';

export function AdoptASpotSearchCriteria({ assignmentOptions, onSpotChange }: {
    assignmentOptions: string, onSpotChange?: (value: string) => void
}) {
    const [selectedAssignment, setSelectedAssignment] = useState<string>('');

    return (
        <div className="flex flex-col gap-3">
            <fieldset>
                <legend><p className="text-[1.06rem] font-semibold">Pounds of Litter Collected</p></legend>
                <div className="flex flex-row gap-4">
                    <Textbox
                        inputId="litter-min"
                        inputType="number"
                        labelText="Minimum"
                        labelFontWeight="font-normal">
                    </Textbox>
                    <Textbox
                        inputId="litter-max"
                        inputType="number"
                        labelText="Maximum"
                        labelFontWeight="font-normal">
                    </Textbox>
                </div>
            </fieldset>
            <fieldset>
                <legend><p className="text-[1.06rem] font-semibold">Pounds of Recycling Collected</p></legend>
                <div className="flex flex-row gap-4">
                    <Textbox
                        inputId="recycling-min"
                        inputType="number"
                        labelText="Minimum"
                        labelFontWeight="font-normal">
                    </Textbox>
                    <Textbox
                        inputId="recycling-max"
                        inputType="number"
                        labelText="Maximum"
                        labelFontWeight="font-normal">
                    </Textbox>
                </div>
            </fieldset>
            <ComboBox
                label="Adopted Spot"
                searchInputId="adopted-spot-combobox-input"
                listboxId="adopted-spot-list"
                buttonId="adopted-spot-toggle"
                value={selectedAssignment}
                listAriaLabel="Spots"
                options={assignmentOptions}
                isRequired={true}
                autocomplete="list"
                handleChange={setSelectedAssignment}>
            </ComboBox>
            <fieldset>
                <legend><p className="text-[1.06rem] font-semibold">Number of Volunteers</p></legend>
                <div className="flex flex-row gap-4">
                    <Textbox
                        inputId="vol-count-min"
                        inputType="number"
                        labelText="Minimum"
                        labelFontWeight="font-normal">
                    </Textbox>
                    <Textbox
                        inputId="vol-count-max"
                        inputType="number"
                        labelText="Maximum"
                        labelFontWeight="font-normal">
                    </Textbox>
                </div>
            </fieldset>
        </div>
    );
}