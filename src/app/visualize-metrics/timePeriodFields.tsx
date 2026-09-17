import { Textbox } from '../components';
import { ErrorModel } from '../models';
import { IntervalCode } from '../models/metrics';
import { MONTHS, QUARTERS } from '../constValues';
import { isBlank } from '../utils/isBlank';

export function TimePeriodFields({ interval, errors }: { interval: IntervalCode, errors: Map<string, ErrorModel> }) {
    function getDateErrors(): React.ReactNode[] {
        let errorsToDisplay: React.ReactNode[] = [];
        if (errors && errors.size > 0) {
            const dateInputIds: string[] = ['start-month', 'start-year', 'end-month', 'end-year'];
            let firstInputIdWithError: string = '';
            for (let i = 0; i < dateInputIds.length; i++) {
                if (errors.has(dateInputIds[i])) {
                    if (isBlank(firstInputIdWithError)) {
                        firstInputIdWithError = dateInputIds[i];
                    }
                    const dateError = errors.get(dateInputIds[i]);
                    if (dateError !== undefined) {
                        errorsToDisplay.push(
                            <div key={`${dateError.inputId}-error`} id={`${dateError.inputId}-error`} className="mt-1">
                                <span className="border-2 border-white-500 bg-red-500 text-white pl-[7px] pr-[7px] p-[3px] rounded-[100px] font-bold text-lg" aria-label="Error: ">X</span>
                                <span className="text-red-700 font-semibold ml-1">{ dateError.message }</span>
                            </div>
                        );
                    }
                }
            }
            document.getElementById(firstInputIdWithError)?.focus();
        }
        return errorsToDisplay;
    }

    switch (interval) {
        case 'quarter':
            return (
                <fieldset>
                    <legend><p className="text-[1.06rem] font-semibold">Time Period</p></legend>
                    <div className="flex flex-row">
                        <span className="w-[7.5rem]">
                            <label htmlFor="start-quarter">Start Quarter</label>
                            <select name="start-quarter" id="start-quarter" className="border rounded-sm p-1 bg-white"
                                aria-describedby={`${errors.has('start-quarter') ? 'start-quarter-error' : ''}`}
                                >
                                <option value=""></option>
                                { QUARTERS.map((quarter: [number, string]) => {
                                    return (<option key={`quarter-${quarter[0]}`} value={quarter[0]}>{quarter[1]}</option>);
                                }) }
                            </select>
                        </span>
                        <span className="w-[7rem]">
                            <Textbox
                                inputId="start-year"
                                inputType="text"
                                labelText="Start FY"
                                width="sm:w-13"
                                labelFontWeight="font-normal"
                                maxlength={4}
                                compact={true}
                                ariaDescribedBy={`${errors.has('start-year') ? 'start-year-error' : ''}`}>
                            </Textbox>
                        </span>
                    </div>
                    <div className="flex flex-row mt-1">
                        <span className="w-[7.5rem]">
                            <label htmlFor="end-quarter">End Quarter</label>
                            <select name="end-quarter" id="end-quarter" className="border rounded-sm p-1 bg-white"
                                aria-describedby={`${errors.has('end-quarter') ? 'end-quarter-error' : ''}`}
                                >
                                <option value=""></option>
                                { QUARTERS.map((quarter: [number, string]) => {
                                    return (<option key={`quarter-${quarter[0]}`} value={quarter[0]}>{quarter[1]}</option>)
                                }) }
                            </select>
                        </span>
                        <span className="w-[7rem]">
                            <Textbox
                                inputId="end-year"
                                inputType="text"
                                labelText="End FY"
                                width="sm:w-13"
                                labelFontWeight="font-normal"
                                maxlength={4}
                                compact={true}
                                ariaDescribedBy={`${errors.has('end-year') ? 'end-year-error' : ''}`}>
                            </Textbox>
                        </span>
                    </div>
                    { getDateErrors() }
                </fieldset>
            );
        case 'year': 
            return (
                <fieldset>
                    <legend><p className="text-[1.06rem] font-semibold">Time Period</p></legend>
                    <div className="flex flex-row">
                        <span className="w-[7rem]">
                            <Textbox
                                inputId="start-year"
                                inputType="text"
                                labelText="Start FY"
                                width="sm:w-13"
                                labelFontWeight="font-normal"
                                maxlength={4}
                                compact={true}
                                ariaDescribedBy={`${errors.has('start-year') ? 'start-year-error' : ''}`}>
                            </Textbox>
                        </span>
                        <span className="w-[7rem]">
                            <Textbox
                                inputId="end-year"
                                inputType="text"
                                labelText="End FY"
                                width="sm:w-13"
                                labelFontWeight="font-normal"
                                maxlength={4}
                                compact={true}
                                ariaDescribedBy={`${errors.has('end-year') ? 'end-year-error' : ''}`}>
                            </Textbox>
                        </span>
                    </div>
                    { getDateErrors() }
                </fieldset>
            );
        default:
            return (
                <fieldset>
                    <legend><p className="text-[1.06rem] font-semibold">Time Period</p></legend>
                    <div className="flex flex-row">
                        <span className="w-[7.5rem]">
                            <label htmlFor="start-month">Start Month</label>
                            <select name="start-month" id="start-month" className="border rounded-sm p-1 bg-white"
                                aria-describedby={`${errors.has('start-month') ? 'start-month-error' : ''}`}
                                >
                                <option value=""></option>
                                { MONTHS.map((month: [number, string]) => {
                                    return (<option key={`month-${month[0]}`} value={month[0]}>{month[1]}</option>);
                                }) }
                            </select>
                        </span>
                        <span className="w-[7rem]">
                            <Textbox
                                inputId="start-year"
                                inputType="text"
                                labelText="Start Year"
                                width="sm:w-13"
                                labelFontWeight="font-normal"
                                maxlength={4}
                                compact={true}
                                ariaDescribedBy={`${errors.has('start-year') ? 'start-year-error' : ''}`}>
                            </Textbox>
                        </span>
                    </div>
                    <div className="flex flex-row mt-1">
                        <span className="w-[7.5rem]">
                            <label htmlFor="end-month">End Month</label>
                            <select name="end-month" id="end-month" className="border rounded-sm p-1 bg-white"
                                aria-describedby={`${errors.has('end-month') ? 'end-month-error' : ''}`}
                                >
                                <option value=""></option>
                                { MONTHS.map((month: [number, string]) => {
                                    return (<option key={`month-${month[0]}`} value={month[0]}>{month[1]}</option>)
                                }) }
                            </select>
                        </span>
                        <span className="w-[7rem]">
                            <Textbox
                                inputId="end-year"
                                inputType="text"
                                labelText="End Year"
                                width="sm:w-13"
                                labelFontWeight="font-normal"
                                maxlength={4}
                                compact={true}
                                ariaDescribedBy={`${errors.has('end-year') ? 'end-year-error' : ''}`}>
                            </Textbox>
                        </span>
                    </div>
                    { getDateErrors() }
                </fieldset>
            );
    }
}