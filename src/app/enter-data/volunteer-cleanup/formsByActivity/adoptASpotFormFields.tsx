import { Button, ComboBox, Textbox } from '../../../components';
import { ErrorModel } from '../../../models';
import { AdoptASpotEventModel } from '../../../models/event';
import { ifErrorThenGetErrorText } from '../../../utils/ifErrorThenGetErrorText';
import { ADOPT_A_SPOT_FORM_DATA_IDS } from '../volunteerCleanupJson';

export function AdoptASpotFormFields(
{
    data, assignmentOptions, selectedAssignment, errors, handleSpotChange, onAddAssignment
}: {
    data?: AdoptASpotEventModel,
    assignmentOptions: string,
    selectedAssignment: string,
    errors: Map<string, ErrorModel>,
    handleSpotChange?: (value: string) => void,
    onAddAssignment?: (event: any) => void
}) {
    return (
        <div className="flex flex-col gap-4 mt-3">
            <Textbox
                inputId={ADOPT_A_SPOT_FORM_DATA_IDS.date}
                inputType="date"
                labelText="Date"
                descriptionText="Please enter the date of the Adopt-a-Spot cleanup."
                isRequired={true}
                defaultValue={data !== undefined ? data.date : undefined}
                errorText={ifErrorThenGetErrorText(errors, ADOPT_A_SPOT_FORM_DATA_IDS.date)}>
            </Textbox>
            <ComboBox
                label="Adopted Spot"
                descriptionText="Please select an adopted spot.
                    If the spot is not listed, please select 'Assign an Unadopted Spot' below to assign a new spot to a group/individual."
                searchInputId={`${ADOPT_A_SPOT_FORM_DATA_IDS.spot}-input`}
                listboxId={`${ADOPT_A_SPOT_FORM_DATA_IDS.spot}-list`}
                buttonId={`${ADOPT_A_SPOT_FORM_DATA_IDS.spot}-toggle`}
                value={selectedAssignment}
                listAriaLabel="Spots"
                options={assignmentOptions}
                isRequired={true}
                autocomplete="list"
                errorText={ifErrorThenGetErrorText(errors, `${ADOPT_A_SPOT_FORM_DATA_IDS.spot}-input`)}
                handleChange={handleSpotChange}
                addOptionBtn={
                    <button type="button" onClick={onAddAssignment} className="border-none cursor-pointer underline mb-2 self-end">
                        Assign an Unadopted Spot
                    </button>
                }>
            </ComboBox>
            <Textbox
                inputId={ADOPT_A_SPOT_FORM_DATA_IDS.volunteerCount}
                inputType="number"
                labelText="Number of Volunteers"
                width="sm:w-24"
                isRequired={true}
                defaultValue={data !== undefined ? `${data.volunteerCount}` : undefined}
                errorText={ifErrorThenGetErrorText(errors, ADOPT_A_SPOT_FORM_DATA_IDS.volunteerCount)}>
            </Textbox>
            <Textbox
                inputId={ADOPT_A_SPOT_FORM_DATA_IDS.volunteerHours}
                inputType="number"
                labelText="Volunteer Hours"
                descriptionText="Please enter the combined volunteer hours of all volunteers at the cleanup. Please round to the nearest quarter number (0.00, 0.25, 0.50, or 0.75)."
                step={0.25}
                width="sm:w-24"
                isRequired={true}
                defaultValue={data !== undefined ? `${data.volunteerHours}` : undefined}
                errorText={ifErrorThenGetErrorText(errors, ADOPT_A_SPOT_FORM_DATA_IDS.volunteerHours)}>
            </Textbox>
            <Textbox
                inputId={ADOPT_A_SPOT_FORM_DATA_IDS.litterCollected}
                inputType="number"
                labelText="Pounds of Litter Collected"
                width="sm:w-24"
                isRequired={true}
                defaultValue={data !== undefined ? `${data.litterCollected}` : undefined}
                errorText={ifErrorThenGetErrorText(errors, ADOPT_A_SPOT_FORM_DATA_IDS.litterCollected)}>
            </Textbox>
            <Textbox
                inputId={ADOPT_A_SPOT_FORM_DATA_IDS.recyclingCollected}
                inputType="number"
                labelText="Pounds of Recycling Collected"
                width="sm:w-24"
                isRequired={true}
                defaultValue={data !== undefined ? `${data.recyclingCollected}` : undefined}
                errorText={ifErrorThenGetErrorText(errors, ADOPT_A_SPOT_FORM_DATA_IDS.recyclingCollected)}>
            </Textbox>
        </div>
    );
}