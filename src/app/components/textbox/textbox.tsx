import { TextboxModel } from './textbox.model';
import { isBlank } from '../../utils/isBlank';

export function Textbox({
    inputId, inputType, inputName, labelText, descriptionText, maxlength, step, width, isRequired, labelFontWeight, errorText, compact, ariaDescribedBy
}: TextboxModel) {
    const DEFAULT_TEXT_WIDTH: string = 'sm:w-32';
    const DEFAULT_DATE_WIDTH: string = 'sm:w-[138px]';
    
    return (
        <div>
            <label id={`${inputId}-label`} htmlFor={inputName ? inputName : inputId}>
                <p className={`text-[1.06rem] ${labelFontWeight ? labelFontWeight : 'font-semibold'}`}
                    >
                    {`${labelText}${isRequired ? ' (required)' : ''}`}
                </p>
            </label>
            { !isBlank(descriptionText) &&
                <div id={`${inputId}-description`}>{ descriptionText }</div>
            }
            <input
                id={inputId}
                type={inputType}
                name={inputName ? inputName : inputId}
                className={`block border rounded-sm bg-white
                    ${compact ? 'pl-1 pr-1' : 'p-1'}
                    ${width ? `${width}` : (inputType === 'date' ? DEFAULT_DATE_WIDTH : DEFAULT_TEXT_WIDTH)} w-full
                    ${errorText && !isBlank(errorText) ? 'border-2 border-red-500' : ''}`}
                maxLength={maxlength}
                step={step ? step : 1}
                aria-required={isRequired}
                aria-invalid={!isBlank(errorText)}
                aria-describedby={`${descriptionText ? `${inputId}-description` : ''} ${errorText ? `${inputId}-error` : ''} ${ariaDescribedBy !== undefined ? ariaDescribedBy : ''}`}>
            </input>
            { !isBlank(errorText) &&
                <div id={`${inputId}-error`} className="mt-1">
                    <span className="border-2 border-white-500 bg-red-500 text-white pl-[7px] pr-[7px] p-[3px] rounded-[100px] font-bold text-lg" aria-label="Error: ">X</span>
                    <span className="text-red-700 font-semibold ml-1">{ errorText }</span>
                </div>
            }
        </div>
    );
}