import { Textbox } from '../../../components';
import { ErrorModel } from '../../../models';
import { TRASH_ROUTES_FORM_DATA_IDS } from '../servicesJson';
import { ifErrorThenGetErrorText } from '../../../utils/ifErrorThenGetErrorText';
import { TrashRoutesEventModel } from '../../../models/event';

export function TrashRoutesFormFields({ data, errors }: { data?: TrashRoutesEventModel, errors: Map<string, ErrorModel> }) {
    return (
        <div className="flex flex-col gap-4 mt-3">
            <Textbox
                inputId={TRASH_ROUTES_FORM_DATA_IDS.date}
                inputType="date"
                labelText="Date"
                descriptionText="Please enter the date that the trash was collected."
                isRequired={true}
                defaultValue={data !== undefined ? data.date : undefined}
                errorText={ifErrorThenGetErrorText(errors, TRASH_ROUTES_FORM_DATA_IDS.date)}>
            </Textbox>
            <Textbox
                inputId={TRASH_ROUTES_FORM_DATA_IDS.trashPounds}
                inputType="number"
                labelText="Pounds of Trash Collected"
                width="sm:w-24"
                isRequired={true}
                defaultValue={data !== undefined ? `${data.trashPounds}` : undefined}
                errorText={ifErrorThenGetErrorText(errors, TRASH_ROUTES_FORM_DATA_IDS.trashPounds)}>
            </Textbox>
            <Textbox
                inputId={TRASH_ROUTES_FORM_DATA_IDS.recyclingPounds}
                inputType="number"
                labelText="Pounds of Recycling Collected"
                width="sm:w-24"
                isRequired={true}
                defaultValue={data !== undefined ? `${data.recyclingPounds}` : undefined}
                errorText={ifErrorThenGetErrorText(errors, TRASH_ROUTES_FORM_DATA_IDS.recyclingPounds)}>
            </Textbox>
        </div>
    );
}