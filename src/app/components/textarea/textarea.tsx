import { TextareaModel } from './textarea.model';
import { isBlank } from '../../utils/isBlank';

export function Textarea({
    textareaId,
    textareaName,
    labelText,
    descriptionText,
    maxlength,
    rows,
    cols,
    isRequired,
    defaultValue,
    labelFontWeight,
    errorText
}: TextareaModel) {
    const DEFAULT_ROWS = 3;
    const DEFAULT_COLS = 100;
    
    return (
        <div>
            <label id={`${textareaId}-label`} htmlFor={textareaName}>
                <p className={`text-[1.06rem] ${labelFontWeight ? labelFontWeight : 'font-semibold'}`}>
                    {`${labelText}${isRequired ? ' (required)' : ''}`}
                </p>
            </label>
            { !isBlank(descriptionText) && <div id={`${textareaId}-description`}>{descriptionText}</div> }
            <textarea
                id={textareaId}
                name={textareaName ? textareaName : textareaId}
                className={`block p-1 border rounded-sm bg-white w-full md:w-180
                    ${errorText && !isBlank(errorText) ? 'border-2 border-red-500' : ''}`}
                maxLength={maxlength}
                rows={rows ? rows : DEFAULT_ROWS}
                cols={cols ? cols : DEFAULT_COLS}
                {...((defaultValue !== undefined) ? { defaultValue: defaultValue } : {})}
                aria-required={isRequired}
                aria-invalid={!isBlank(errorText)}
                aria-describedby={`${textareaId}-label ${descriptionText ? `${textareaId}-description` : ''} ${errorText ? `${textareaId}-error` : ''}`}>
            </textarea>
            { !isBlank(errorText) &&
                <div id={`${textareaId}-error`} className="mt-1">
                    <span className="border-2 border-white-500 bg-red-500 text-white pl-[7px] pr-[7px] p-[3px] rounded-[100px] font-bold text-lg">X</span>
                    <span className="text-red-700 font-semibold ml-1">{ errorText }</span>
                </div>
            }
        </div>
    );
}