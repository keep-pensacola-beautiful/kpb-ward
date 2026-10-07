import { useEffect, useState } from 'react';
import { CheckboxModel } from './checkbox.model';

export function Checkbox({ inputId, inputName, label, value, isChecked, handleChange }: CheckboxModel) {
    const [checked, setChecked] = useState(isChecked);

    useEffect(() => {
        setChecked(isChecked);
    }, [isChecked])

    function updateCheckbox(event: any) {
        setChecked(!checked);
        if (handleChange !== undefined) { handleChange(event); }
    }

    return (
        <span className="flex flex-row items-center">
            <input
                type="checkbox"
                id={inputId}
                name={inputName ? inputName : inputId}
                value={value}
                onChange={updateCheckbox}
                checked={checked ? true : false}
                className="w-[20px] h-[20px]">
            </input>
            <label htmlFor={inputId} className="ml-1 text-[1.06rem]">{label}</label>
        </span>
    );
}