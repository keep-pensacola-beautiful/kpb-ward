import { Textbox } from '../../../components';

export function BagSwapSearchCriteria() {
    return (
        <div className="flex flex-col gap-3">
            <fieldset>
                <legend><p className="text-[1.06rem] font-semibold">Number of Bags Collected</p></legend>
                <div className="flex flex-row gap-4">
                    <Textbox
                        inputId="bag-min"
                        inputType="number"
                        labelText="Minimum"
                        labelFontWeight="font-normal">
                    </Textbox>
                    <Textbox
                        inputId="bag-max"
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