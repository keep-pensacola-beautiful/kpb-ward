'use client'

import { RadioButton } from './radioButton';
import { RadioListModel } from './radioList.model';
import { RadioListOptionModel } from './radioListOption.model';
import { isBlank } from '../../utils/isBlank';
import { parseJsonStringOptions} from '../../utils/parseJsonStringOptions';

export function RadioList({ label, listName, options, orientation = 'col', descriptionText, isRequired, selectedValue, handleChange }: RadioListModel) {
    return (
        <div>
            <fieldset>
                <legend><p className="text-[1.06rem] font-semibold">{`${label}${isRequired ? ' (required)' : ''}`}</p></legend>
                <span className={`flex ${orientation === 'col' ? 'flex-col gap-2 mt-1' : 'flex-row gap-4'}`}>
                    { !isBlank(descriptionText) && <div id={`${listName}-description`}>{ descriptionText }</div>}
                    { parseJsonStringOptions(options).map((option: RadioListOptionModel) => (
                        <span key={option.key}>
                            <RadioButton
                                label={option.label}
                                inputId={option.inputId}
                                value={option.value}
                                listName={listName}
                                selectedValue={selectedValue}
                                handleChange={handleChange}
                            >
                            </RadioButton>
                        </span>
                    ))}
                </span>
            </fieldset>
        </div>
    );
}