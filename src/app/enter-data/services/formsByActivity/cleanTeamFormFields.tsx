import { Textbox } from '../../../components';
import { ErrorModel } from '../../../models';
import { CLEAN_TEAM_FORM_DATA_IDS } from '../servicesJson';
import { ifErrorThenGetErrorText } from '../../../utils/ifErrorThenGetErrorText';
import { CleanTeamEventModel } from '../../../models/event';

export function CleanTeamFormFields({ data, errors }: { data?: CleanTeamEventModel, errors: Map<string, ErrorModel> }) {
    return (
        <div className="flex flex-col gap-4 mt-3">
            <Textbox
                inputId={CLEAN_TEAM_FORM_DATA_IDS.date}
                inputType="date"
                labelText="Date"
                descriptionText="Please enter the date that the litter was collected."
                isRequired={true}
                defaultValue={data !== undefined ? data.date : undefined}
                errorText={ifErrorThenGetErrorText(errors, CLEAN_TEAM_FORM_DATA_IDS.date)}>
            </Textbox>
            <Textbox
                inputId={CLEAN_TEAM_FORM_DATA_IDS.trashPounds}
                inputType="number"
                labelText="Pounds of Trash Collected"
                width="sm:w-24"
                isRequired={true}
                defaultValue={data !== undefined ? `${data.trashPounds}` : undefined}
                errorText={ifErrorThenGetErrorText(errors, CLEAN_TEAM_FORM_DATA_IDS.trashPounds)}>
            </Textbox>
            <Textbox
                inputId={CLEAN_TEAM_FORM_DATA_IDS.recyclingPounds}
                inputType="number"
                labelText="Pounds of Recycling Collected"
                width="sm:w-24"
                isRequired={true}
                defaultValue={data !== undefined ? `${data.recyclingPounds}` : undefined}
                errorText={ifErrorThenGetErrorText(errors, CLEAN_TEAM_FORM_DATA_IDS.recyclingPounds)}>
            </Textbox>
            <Textbox
                inputId={CLEAN_TEAM_FORM_DATA_IDS.description}
                inputType="text"
                labelText="Event Description"
                descriptionText={`Please enter a brief description of the event, such as "Mardi Gras Parade".`}
                width="sm:w-160"
                maxlength={70}
                isRequired={true}
                defaultValue={data !== undefined ? data.eventDescription : undefined}
                errorText={ifErrorThenGetErrorText(errors, CLEAN_TEAM_FORM_DATA_IDS.description)}>
            </Textbox>
        </div>
    );
}