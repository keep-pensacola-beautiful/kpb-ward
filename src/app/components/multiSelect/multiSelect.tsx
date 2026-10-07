import { useState } from 'react';
import { MultiSelectModel } from './multiSelect.model';
import { isBlank } from '../../utils/isBlank';
import { SearchBar } from './searchBar';
import { parseJsonStringOptions } from '../../utils/parseJsonStringOptions';
import { MultiSelectOptionModel } from './multiSelectOption.model';
import { Checkbox } from './checkbox/checkbox';

export function MultiSelect({
    label,
    multiSelectName,
    options,
    descriptionText,
    isRequired,
    hasSearch,
    orientation,
    selectedValuesMap,
    errorText,
    handleChange
}: MultiSelectModel) {
    const [filter, setFilter] = useState<string>('');

    function orient(orient: string | undefined): string {
        return (orient === 'grid') ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'flex flex-col w-100 gap-2'
    }

    return (
        <fieldset>
            <legend><p className="text-[1.06rem] font-semibold">{`${label}${isRequired ? ' (required)' : ''}`}</p></legend>

            { !isBlank(descriptionText) && <div id={`${multiSelectName}-description`}>{ descriptionText }</div>}
            { hasSearch &&
                <SearchBar
                    multiSelectName={multiSelectName}
                    currValue={filter}
                    handleChange={(event) => { event.preventDefault(); setFilter(event?.target?.value); }}>
                </SearchBar>
            }
            <div className={`${orient(orientation)} mt-1`}>
                {parseJsonStringOptions(options).map((option: MultiSelectOptionModel) => {
                    if ((!filter || filter === '') || (option.label.toLowerCase().indexOf(filter.toLowerCase()) === 0)) {
                        return (<span key={option.key}>
                            <Checkbox
                                inputId={option.inputId}
                                inputName={multiSelectName}
                                label={option.label}
                                value={option.value}
                                isChecked={option.checked || selectedValuesMap?.has(option.inputId)}
                                handleChange={handleChange}>
                            </Checkbox>
                        </span>);
                    } else {
                        return '';
                    }
                })}
                { JSON.parse(options).length === 0 && <span>loading...</span> }
            </div>
            { !isBlank(errorText) &&
                <div id={`${multiSelectName}-error`} className="mt-1">
                    <span className="border-2 border-white-500 bg-red-500 text-white pl-[7px] pr-[7px] p-[3px] rounded-[100px] font-bold text-lg">X</span>
                    <span className="text-red-700 font-semibold ml-1">{ errorText }</span>
                </div>
            }
        </fieldset>
    );
}