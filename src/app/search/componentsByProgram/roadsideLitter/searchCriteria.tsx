import { Textbox } from '../../../components';

export function RoadsideLitterSearchCriteria({ districtOptions }: { districtOptions: string}) {
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

            <span>
                <label htmlFor="district"><p className="text-[1.06rem] font-semibold">District</p></label>
                <select name="district" id="district" className="border rounded-sm p-1 bg-white min-w-[6rem] w-[100%] sm:w-auto">
                    <option value=""></option>
                    { JSON.parse(districtOptions).map((district: { label: string, value: string }) => {
                        return (<option key={`district-${district.value}`} value={district.value}>{district.label}</option>);
                    }) }
                </select>
            </span>

            <Textbox
                inputId="location"
                inputType="string"
                labelText="Location"
                descriptionText={`Please enter a street name or other location where roadside litter was collected.
                    Only exact matches will be returned.`}
                maxlength={300}
                width="sm:w-80">
            </Textbox>

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