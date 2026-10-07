import { Textbox } from '../../../components';

export function CleanTeamSearchCriteria() {
    return (
        <div className="flex flex-col gap-3">
            <fieldset>
                <legend><p className="text-[1.06rem] font-semibold">Pounds of Trash Collected</p></legend>
                <div className="flex flex-row gap-4">
                    <Textbox
                        inputId="trash-min"
                        inputType="number"
                        labelText="Minimum"
                        labelFontWeight="font-normal">
                    </Textbox>
                    <Textbox
                        inputId="trash-max"
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
            <Textbox
                inputId="event-desc"
                inputType="text"
                labelText="Event Description"
                descriptionText="This is a free-form field and will only return exact matches."
                width="sm:w-80">
            </Textbox>
        </div>
    );
}