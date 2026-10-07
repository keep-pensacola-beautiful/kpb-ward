import { useState } from 'react';
import { ComboBox, Textbox } from '../../../components';

export function GroupCleanupSearchCriteria({ locationOptions, organizationOptions }: {
    locationOptions: string,
    organizationOptions: string
}) {
    const [selectedOrganization, setSelectedOrganization] = useState<string>('');
    const [selectedLocation, setSelectedLocation] = useState<string>('');

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
                label="Organization Name"
                searchInputId="organization-combobox-input"
                listboxId="organization-list"
                buttonId="organization-toggle"
                value={selectedOrganization}
                listAriaLabel="Organizations"
                options={organizationOptions}
                isRequired={false}
                autocomplete="list"
                handleChange={setSelectedOrganization}>
            </ComboBox>
            <ComboBox
                label="Cleanup Location"
                searchInputId="location-combobox-input"
                listboxId="location-list"
                buttonId="location-toggle"
                value={selectedLocation}
                listAriaLabel="Locations"
                options={locationOptions}
                isRequired={false}
                autocomplete="list"
                handleChange={setSelectedLocation}>
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