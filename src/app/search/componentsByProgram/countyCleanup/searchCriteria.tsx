import { Textbox } from '../../../components';

export function CountyCleanupSearchCriteria() {
    return (
        <div className="flex flex-col gap-3">
            <fieldset>
                <legend><p className="text-[1.06rem] font-semibold">Number of Tires Collected</p></legend>
                <div className="flex flex-row gap-4">
                    <Textbox
                        inputId="tire-count-min"
                        inputType="number"
                        labelText="Minimum"
                        labelFontWeight="font-normal">
                    </Textbox>
                    <Textbox
                        inputId="tire-count-max"
                        inputType="number"
                        labelText="Maximum"
                        labelFontWeight="font-normal">
                    </Textbox>
                </div>
            </fieldset>
            <fieldset>
                <legend><p className="text-[1.06rem] font-semibold">Number of Paint Cans & Household Chemicals Collected</p></legend>
                <div className="flex flex-row gap-4">
                    <Textbox
                        inputId="cans-chemicals-min"
                        inputType="number"
                        labelText="Minimum"
                        labelFontWeight="font-normal">
                    </Textbox>
                    <Textbox
                        inputId="cans-chemicals-max"
                        inputType="number"
                        labelText="Maximum"
                        labelFontWeight="font-normal">
                    </Textbox>
                </div>
            </fieldset>
            <fieldset>
                <legend><p className="text-[1.06rem] font-semibold">Pounds of Bulky Items Collected</p></legend>
                <div className="flex flex-row gap-4">
                    <Textbox
                        inputId="bulky-item-lbs-min"
                        inputType="number"
                        labelText="Minimum"
                        labelFontWeight="font-normal">
                    </Textbox>
                    <Textbox
                        inputId="bulky-item-lbs-max"
                        inputType="number"
                        labelText="Maximum"
                        labelFontWeight="font-normal">
                    </Textbox>
                </div>
            </fieldset>
            <fieldset>
                <legend><p className="text-[1.06rem] font-semibold">Number of Bulky Items Collected</p></legend>
                <div className="flex flex-row gap-4">
                    <Textbox
                        inputId="bulky-item-count-min"
                        inputType="number"
                        labelText="Minimum"
                        labelFontWeight="font-normal">
                    </Textbox>
                    <Textbox
                        inputId="bulky-item-count-max"
                        inputType="number"
                        labelText="Maximum"
                        labelFontWeight="font-normal">
                    </Textbox>
                </div>
            </fieldset>
        </div>
    );
}