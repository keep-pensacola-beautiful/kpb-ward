import { ComboBox, Textbox } from '../../../components';
import { ErrorModel } from '../../../models';
import { GroupCleanupEventModel } from '../../../models/event';
import { ifErrorThenGetErrorText } from '../../../utils/ifErrorThenGetErrorText';
import { GROUP_CLEANUP_FORM_DATA_IDS } from '../volunteerCleanupJson';

export function GroupCleanupFormFields(
{
    data, organizationOptions, selectedOrganization, locationOptions, selectedLocation, errors, handleLocationChange, handleOrganizationChange, onAddLocation, onAddOrganization
}: {
    data?: GroupCleanupEventModel
    organizationOptions: string,
    selectedOrganization: string,
    locationOptions: string,
    selectedLocation: string,
    errors: Map<string, ErrorModel>,
    handleLocationChange: (value: string) => void,
    handleOrganizationChange: (value: string) => void,
    onAddLocation?: (event: any) => void,
    onAddOrganization?: (event: any) => void
}) {
    return (
        <div className="flex flex-col gap-4 mt-3">
            <Textbox
                inputId={GROUP_CLEANUP_FORM_DATA_IDS.date}
                inputType="date"
                labelText="Date"
                descriptionText="Please enter the date of the Group Cleanup."
                isRequired={true}
                defaultValue={data !== undefined ? data.date : undefined}
                errorText={ifErrorThenGetErrorText(errors, GROUP_CLEANUP_FORM_DATA_IDS.date)}>
            </Textbox>
            <ComboBox
                label="Organization"
                descriptionText="Please select the organization that did the cleanup.
                    If the organization is not listed, please select 'Add a New Organization' below."
                searchInputId={`${GROUP_CLEANUP_FORM_DATA_IDS.organization}-input`}
                listboxId={`${GROUP_CLEANUP_FORM_DATA_IDS.organization}-list`}
                buttonId={`${GROUP_CLEANUP_FORM_DATA_IDS.organization}-toggle`}
                value={selectedOrganization}
                listAriaLabel="Organizations"
                options={organizationOptions}
                isRequired={true}
                autocomplete="list"
                errorText={ifErrorThenGetErrorText(errors, `${GROUP_CLEANUP_FORM_DATA_IDS.organization}-input`)}
                handleChange={handleOrganizationChange}
                addOptionBtn={
                    <button type="button" onClick={onAddOrganization} className="border-none cursor-pointer underline mb-2 self-end">
                        Add a New Organization
                    </button>
                }>
            </ComboBox>
            <ComboBox
                label="Cleanup Location"
                descriptionText="Please select the location of the cleanup.
                    If the location is not listed, please select 'Add a New Location' below."
                searchInputId={`${GROUP_CLEANUP_FORM_DATA_IDS.location}-input`}
                listboxId={`${GROUP_CLEANUP_FORM_DATA_IDS.location}-list`}
                buttonId={`${GROUP_CLEANUP_FORM_DATA_IDS.location}-toggle`}
                value={selectedLocation}
                listAriaLabel="Locations"
                options={locationOptions}
                isRequired={true}
                autocomplete="list"
                errorText={ifErrorThenGetErrorText(errors, `${GROUP_CLEANUP_FORM_DATA_IDS.location}-input`)}
                handleChange={handleLocationChange}
                addOptionBtn={
                    <button type="button" onClick={onAddLocation} className="border-none cursor-pointer underline mb-2 self-end">
                        Add a New Location
                    </button>
                }>
            </ComboBox>
            <Textbox
                inputId={GROUP_CLEANUP_FORM_DATA_IDS.volunteerCount}
                inputType="number"
                labelText="Number of Volunteers"
                width="sm:w-24"
                isRequired={true}
                defaultValue={data !== undefined ? `${data.volunteerCount}` : undefined}
                errorText={ifErrorThenGetErrorText(errors, GROUP_CLEANUP_FORM_DATA_IDS.volunteerCount)}>
            </Textbox>
            <Textbox
                inputId={GROUP_CLEANUP_FORM_DATA_IDS.volunteerHours}
                inputType="number"
                labelText="Volunteer Hours"
                descriptionText="Please enter the combined volunteer hours of all volunteers at the cleanup."
                step={0.25}
                width="sm:w-24"
                isRequired={true}
                defaultValue={data !== undefined ? `${data.volunteerHours}` : undefined}
                errorText={ifErrorThenGetErrorText(errors, GROUP_CLEANUP_FORM_DATA_IDS.volunteerHours)}>
            </Textbox>
            <Textbox
                inputId={GROUP_CLEANUP_FORM_DATA_IDS.litterCollected}
                inputType="number"
                labelText="Pounds of Litter Collected"
                width="sm:w-24"
                isRequired={true}
                defaultValue={data !== undefined ? `${data.litterCollected}` : undefined}
                errorText={ifErrorThenGetErrorText(errors, GROUP_CLEANUP_FORM_DATA_IDS.litterCollected)}>
            </Textbox>
            <Textbox
                inputId={GROUP_CLEANUP_FORM_DATA_IDS.recyclingCollected}
                inputType="number"
                labelText="Pounds of Recycling Collected"
                width="sm:w-24"
                isRequired={true}
                defaultValue={data !== undefined ? `${data.recyclingCollected}` : undefined}
                errorText={ifErrorThenGetErrorText(errors, GROUP_CLEANUP_FORM_DATA_IDS.recyclingCollected)}>
            </Textbox>
        </div>
    );
}