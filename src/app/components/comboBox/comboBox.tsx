'use client'

import { useEffect, useState, useRef } from 'react';
import { ComboBoxModel } from './comboBox.model';
import { ComboBoxListItemModel } from './comboBoxListItem.model';
import { parseJsonStringOptions } from '../../utils/parseJsonStringOptions';
import { isBlank } from '../../utils/isBlank';

export function ComboBox({
    label,
    descriptionText,
    searchInputId,
    listboxId,
    buttonId,
    value,
    listAriaLabel,
    options,
    isRequired,
    autocomplete,
    errorText,
    handleChange,
    addOptionBtn
}: ComboBoxModel) {
    const [comboBoxNodeActiveDescendant, setComboBoxNodeActiveDescendant] = useState<string>('');
    const [comboBoxNodeValue, setComboBoxNodeValue] = useState<string>('');
    const [comboBoxHasVisualFocus, setComboBoxHasVisualFocus] = useState<boolean>(false);
    const [listboxHasVisualFocus, setListboxHasVisualFocus] = useState<boolean>(false);
    const [filteredOptions, setFilteredOptions] = useState<ComboBoxListItemModel[]>(parseJsonStringOptions(options));
    const [isListboxExpanded, setIsListboxExpanded] = useState<boolean>(false);
    const [firstOption, setFirstOption] = useState<ComboBoxListItemModel | null>(null);
    const [lastOption, setLastOption] = useState<ComboBoxListItemModel | null>(null);
    const [currOption, setCurrOption] = useState<ComboBoxListItemModel | null>(null);
    const [filter, setFilter] = useState<string>('');
    const listboxRef = useRef<HTMLUListElement>(null);
    const comboBoxNodeRef = useRef<HTMLInputElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        document.body.addEventListener('pointerup', onBackgroundPointerUp, true);
        if (value) {
            setComboBoxNodeValue(value);
        } else if (isBlank(options) || options === '[]') {
            setComboBoxNodeValue('Loading...');
        } else {
            setComboBoxNodeValue('');
        }
        return () => {
            document.body.removeEventListener('pointerup', onBackgroundPointerUp, true);
        }
    }, [options])
    
    let hasHover: boolean = false;
    let isNone: boolean = (autocomplete === 'none' || autocomplete === undefined);
    let isList: boolean = (autocomplete === 'list');
    let isBoth: boolean = (autocomplete === 'both');
    let allOptions: ComboBoxListItemModel[] = parseJsonStringOptions(options);
    const BLANK_LIST_ITEM_OBJECT = { key: '', listItemId: '', label: '', isSelected: false};

    function getLowercaseContent(option: ComboBoxListItemModel): string {
        return option.label.toLowerCase();
    }

    function isOptionInView(option: HTMLElement): boolean {
        const bounding: DOMRect = option.getBoundingClientRect();
        return (
            bounding.top >= 0 &&
            bounding.left >= 0 &&
            bounding.bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
            bounding.right <=
            (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function setActiveDescendant(option: ComboBoxListItemModel | null, listboxHasVisualFocusCopy?: boolean): void {
        if (option && (listboxHasVisualFocus || listboxHasVisualFocusCopy)) {
            setComboBoxNodeActiveDescendant(option.listItemId);
            let optionAsHTMLElement = getOptionAsHTMLElement(option);
            if (optionAsHTMLElement && !isOptionInView(optionAsHTMLElement)) {
                optionAsHTMLElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        } else {
            setComboBoxNodeActiveDescendant(''); 
        }
    }

    function setValue(value: string): void {
        setFilter(value);
        setComboBoxNodeValue(value);
        if (comboBoxNodeRef?.current) {
            comboBoxNodeRef.current.setSelectionRange(filter.length, filter.length);
        }
        filterOptions(value);
    }

    function getOptionAsHTMLElement(option: ComboBoxListItemModel): HTMLElement | null {
        return (listboxRef?.current) ? listboxRef.current.querySelector(`#${option.listItemId}`) : null;
    }

    function setOption(option: ComboBoxListItemModel | null, flag?: any): void {
        if (typeof flag !== 'boolean') {
            flag = false;
        }

        if (option) {
            setCurrOption(option);
            setCurrentOptionStyle(option);
            setActiveDescendant(option);

            if (isBoth) {
                setComboBoxNodeValue(option?.label)
                if (comboBoxNodeRef?.current) {
                    if (flag) {
                        comboBoxNodeRef.current.setSelectionRange(option?.label.length, option?.label.length);
                    } else {
                        comboBoxNodeRef.current.setSelectionRange(filter.length, option?.label.length);
                    }
                }
            }
        }
    }

    function setVisualFocusCombobox(): void {
        if (listboxRef.current) {
            listboxRef.current.classList.remove('focus');
        }
        if (comboBoxNodeRef.current && comboBoxNodeRef.current.parentElement) {
            comboBoxNodeRef.current.parentElement.classList.add('focus');
        }
        setComboBoxHasVisualFocus(true);
        setListboxHasVisualFocus(false);
        setActiveDescendant(null);
    }

    function setVisualFocusListbox(activeDescendant?: ComboBoxListItemModel | null): void {
        const comboBoxHasVisualFocusCopy: boolean = false;
        const listboxHasVisualFocusCopy: boolean = true;
        if (comboBoxNodeRef.current && comboBoxNodeRef.current.parentElement) {
            comboBoxNodeRef.current.parentElement.classList.remove('focus');
        }
        setComboBoxHasVisualFocus(comboBoxHasVisualFocusCopy);
        setListboxHasVisualFocus(listboxHasVisualFocusCopy);
        if (listboxRef.current) {
            listboxRef.current.classList.add('focus');
        }
        setActiveDescendant((activeDescendant) ? activeDescendant : currOption, listboxHasVisualFocusCopy);
    }

    function removeVisualFocusAll(): void {
        if (comboBoxNodeRef.current && comboBoxNodeRef.current.parentElement) {
            comboBoxNodeRef.current.parentElement.classList.remove('focus');
        }
        if (listboxRef.current) {
            listboxRef.current.classList.remove('focus');
        }
        setComboBoxHasVisualFocus(false);
        setListboxHasVisualFocus(false);
        setCurrOption(null);
        setActiveDescendant(null);
    }

    /* COMBOBOX EVENTS */

    function filterOptions(filterStr: string): ComboBoxListItemModel | null {
        // Do not filter any options if autocomplete is none
        if (isNone) {
            filterStr = '';
        }

        let option: ComboBoxListItemModel | null;
        const currentOption: ComboBoxListItemModel | null = currOption;
        const lowercaseFilter: string = filterStr.toLowerCase();
        let updatedFilteredObjects: ComboBoxListItemModel[] = [];

        for (var i = 0; i < allOptions.length; i++) {
            option = allOptions[i];
            if (
                lowercaseFilter.length === 0 ||
                getLowercaseContent(option).indexOf(lowercaseFilter) === 0
            ) {
                updatedFilteredObjects.push(option);
            }
        }

        setTimeout(() => setFilteredOptions(updatedFilteredObjects), 100);

        // Use populated options array to initialize firstOption and lastOption.
        var numItems = updatedFilteredObjects.length;
        if (numItems > 0) {
            setFirstOption(updatedFilteredObjects[0]);
            setLastOption(updatedFilteredObjects[numItems - 1]);
            if (currentOption && updatedFilteredObjects.findIndex((option) => option.listItemId === currentOption.listItemId) >= 0) {
                option = currentOption;
            } else {
                option = firstOption;
            }
        } else {
            setFirstOption(null);
            option = null;
            setLastOption(null);
        }

        return option;
    }

    function setCurrentOptionStyle(option: ComboBoxListItemModel): void {
        let updatedFilteredOptions: any[] = JSON.parse(JSON.stringify(filteredOptions));
        for (let i = 0; i < updatedFilteredOptions.length; i++) {
            const opt: ComboBoxListItemModel = updatedFilteredOptions[i];
            if (opt.listItemId === option.listItemId) {
                opt.isSelected = true;
                let optAsHTMLElement: HTMLElement | null = getOptionAsHTMLElement(opt);
                if (
                    listboxRef.current && optAsHTMLElement &&
                    (
                        (listboxRef.current.scrollTop + listboxRef.current.offsetHeight) <
                            (optAsHTMLElement.offsetTop + optAsHTMLElement.offsetHeight)
                    )
                ) {
                    listboxRef.current.scrollTop =
                        optAsHTMLElement.offsetTop + optAsHTMLElement.offsetHeight - listboxRef.current.offsetHeight;
                } else if (listboxRef.current && optAsHTMLElement &&
                    (listboxRef.current.scrollTop > (optAsHTMLElement.offsetTop + 2))
                ) {
                    listboxRef.current.scrollTop = optAsHTMLElement.offsetTop;
                }
            } else { 
                opt.isSelected = false;
            }
            updatedFilteredOptions[i] = opt;
        }
        setFilteredOptions(updatedFilteredOptions);
    }

    function getPreviousOption(currentOption: ComboBoxListItemModel | null): ComboBoxListItemModel | null {
        if (currentOption && (currentOption.listItemId !== firstOption?.listItemId)) {
            const index: number = filteredOptions.findIndex((option) => option.listItemId === currentOption.listItemId);
            return filteredOptions[index - 1];
        }
        return lastOption;
    }

    function getNextOption(currentOption: ComboBoxListItemModel | null): ComboBoxListItemModel | null {
        if (currentOption && (currentOption.listItemId !== lastOption?.listItemId)) {
            const index: number = filteredOptions.findIndex((option) => option.listItemId === currentOption.listItemId);
            return filteredOptions[index + 1];
        }
        return firstOption;
    }

    /* MENU DISPLAY METHODS */

    function doesOptionHaveFocus(): boolean {
        return comboBoxNodeActiveDescendant !== '';
    }

    function isOpen(): boolean {
        return isListboxExpanded;
    }

    function isClosed(): boolean {
        return !isListboxExpanded;
    }

    function hasOptions(): number {
        return filteredOptions.length;
    }

    function open(): void {
        if (listboxRef.current && !isBlank(options) && options !== '[]') {
            listboxRef.current.style.display = 'block';
            setIsListboxExpanded(true);
        }
    }

    function close(force?: any): void {
        if (typeof force !== 'boolean') {
            force = false;
        }

        if (
            force ||
            (!comboBoxHasVisualFocus &&
                !listboxHasVisualFocus &&
                !hasHover)
        ) {
            
            setCurrentOptionStyle(BLANK_LIST_ITEM_OBJECT);
            if (listboxRef.current) {
                listboxRef.current.style.display = 'none';
                setIsListboxExpanded(false);
            }
            setActiveDescendant(null);
            setComboBoxHasVisualFocus(true);
        }
    }

    /* COMBOBOX EVENTS */

    function onComboBoxKeyDown(event: any): void {
        let flag: boolean = false;
        const altKey: any = event.altKey;

        if (event.ctrlKey || event.shiftKey) {
            return;
        }

        switch (event.key) {
            case 'Enter':
                if (listboxHasVisualFocus) {
                    if (currOption) {
                        setValue(currOption.label);
                        if (handleChange) {
                            handleChange(currOption.label);
                        }
                    }
                    close(true);
                    setVisualFocusCombobox();
                    flag = true;
                } else {
                    open();
                }
                break;

            case 'Down':
            case 'ArrowDown':
                if (filteredOptions.length > 0) {
                    if (altKey) {
                        open();
                    } else {
                        open();
                        if (
                            listboxHasVisualFocus ||
                            (isBoth && filteredOptions.length > 1)
                        ) {
                            const nextOption: ComboBoxListItemModel | null = JSON.parse(JSON.stringify(getNextOption(currOption)));
                            setOption(nextOption, true);
                            setVisualFocusListbox(nextOption);
                        } else {
                            setOption(firstOption, true);
                            setVisualFocusListbox(firstOption);
                        }
                    }
                }
                flag = true;
                break;

            case 'Up':
            case 'ArrowUp':
                if (hasOptions()) {
                    if (listboxHasVisualFocus) {
                        setOption(getPreviousOption(currOption), true);
                    } else {
                        open();
                        if (!altKey) {
                            setOption(lastOption, true);
                            setVisualFocusListbox();
                        }
                    }
                }
                flag = true;
                break;

            case 'Esc':
            case 'Escape':
                if (isOpen()) {
                    close(true);
                    setFilter(comboBoxNodeValue);
                    filterOptions(comboBoxNodeValue);
                    setVisualFocusCombobox();
                } else {
                    setValue('');
                }
                setCurrOption(null);
                flag = true;
                break;

            case 'Tab':
                close(true);
                if (listboxHasVisualFocus) {
                    if (currOption) {
                        setValue(currOption.label);
                        if (handleChange) {
                            handleChange(currOption.label);
                        }
                    }
                }
                break;

            case 'Home':
                if (comboBoxNodeRef.current) {
                    comboBoxNodeRef.current.setSelectionRange(0, 0);
                }
                flag = true;
                break;

            case 'End':
                if (comboBoxNodeRef.current) {
                    const length: number = comboBoxNodeValue.length;
                    comboBoxNodeRef.current.setSelectionRange(length, length);
                }
                flag = true;
                break;

            default:
                break;
        }

        if (flag) {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    function isPrintableCharacter(str: string): boolean | RegExpMatchArray | null {
        return str.length === 1 && str.match(/\S| /);
    }

    function onComboboxKeyUp(event: any) {
        let flag: boolean = false;
        let option: ComboBoxListItemModel | null = null;
        const char = event.key;
        let filterCopy: string = filter;

        if (isPrintableCharacter(char)) {
            filterCopy = filter + char;
            setFilter(filter + char);
        }

        // this is for the case when a selection in the textbox has been deleted
        if (comboBoxNodeValue.length < filter.length) {
            filterCopy = comboBoxNodeValue;
            setFilter(comboBoxNodeValue);
            setCurrOption(null);
            filterOptions(comboBoxNodeValue);
        }

        if (event.key === 'Escape' || event.key === 'Esc') {
            return;
        }

        switch (event.key) {
            case 'Backspace':
                setVisualFocusCombobox();
                setCurrentOptionStyle(BLANK_LIST_ITEM_OBJECT);
                setFilter(comboBoxNodeValue);
                setCurrOption(null);
                filterOptions(comboBoxNodeValue);
                if (handleChange) {
                    handleChange('');
                }
                flag = true;
                break;

            case 'Left':
            case 'ArrowLeft':
            case 'Right':
            case 'ArrowRight':
            case 'Home':
            case 'End':
                if (isBoth) {
                    setFilter(comboBoxNodeValue);
                } else {
                    option = null;
                    setCurrentOptionStyle(BLANK_LIST_ITEM_OBJECT);
                }
                setVisualFocusCombobox();
                flag = true;
                break;

            default:
                if (isPrintableCharacter(char)) {
                    setVisualFocusCombobox();
                    setCurrentOptionStyle(BLANK_LIST_ITEM_OBJECT);
                    flag = true;

                    if (isList || isBoth) {
                        option = filterOptions(filterCopy);
                        if (option) {
                            if (isClosed() && comboBoxNodeValue.length) {
                                open();
                            }

                            if (getLowercaseContent(option).indexOf(comboBoxNodeValue.toLowerCase()) === 0) {
                                setCurrOption(option);
                                if (isBoth || listboxHasVisualFocus) {
                                    setCurrentOptionStyle(option);
                                    if (isBoth) {
                                        setOption(option);
                                    }
                                }
                            } else {
                                setCurrOption(null);
                                setCurrentOptionStyle(BLANK_LIST_ITEM_OBJECT);
                            }
                        } else {
                            close();
                            option = null;
                            setActiveDescendant(null);
                        }
                    } else if (comboBoxNodeValue.length) {
                        open();
                    }
                }

                break;
        }

        if (flag) {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    function onComboboxClick(): void {
        isOpen() ? close(true) : open();
    }

    function onComboboxFocus(): void {
        setFilter(comboBoxNodeValue);
        filterOptions(comboBoxNodeValue);
        setVisualFocusCombobox();
        setCurrOption(null);
        setCurrentOptionStyle(BLANK_LIST_ITEM_OBJECT);
    }

    function onComboboxBlur(): void {
        removeVisualFocusAll();
    }

    function onBackgroundPointerUp(event: any): void {
        if (
            comboBoxNodeRef.current &&
            !comboBoxNodeRef.current.contains(event.target) &&
            listboxRef.current &&
            !listboxRef.current.contains(event.target) &&
            buttonRef.current &&
            !buttonRef.current.contains(event.target)
        ) {
            setComboBoxHasVisualFocus(false);
            setCurrentOptionStyle(BLANK_LIST_ITEM_OBJECT);
            setTimeout(() => {
                close(true);
                removeVisualFocusAll();
            }, 300);
        }
    }

    function onButtonClick(): void {
        isOpen() ? close(true) : open();
        if (comboBoxNodeRef.current) {
            comboBoxNodeRef.current.focus();
        }
        setVisualFocusCombobox();
    }

    /* LISTBOX EVENTS */

    function onListboxPointerover(): void {
        hasHover = true;
    }

    function onListboxPointerout(): void {
        hasHover = false;
        setTimeout(() => close(false), 300);
    }

    /* LISTBOX OPTION EVENTS */

    function onOptionClick(event: any): void {
        setComboBoxNodeValue(event.target.textContent);
        if (handleChange) {
            handleChange(event.target.textContent);
        }
        close(true);
    }

    function onOptionPointerOver(): void {
        hasHover = true;
        open();
    }

    function onOptionPointerOut(): void {
        hasHover = false;
        setTimeout(() => close(false), 300);
    }

    return (
        <div>
            <style>
                {`
                    .combobox .group.focus,
                    .combobox .group:hover {
                        /* 
                            padding: 2px;
                            border: 2px solid currentcolor; 
                            border-radius: 4px;
                        */
                        outline: 3px solid var(--deepBlue);
                        box-shadow: 0 0 0 6px white;
                    }
                    
                    #${searchInputId}:focus-visible {
                        outline: 0px;
                        box-shadow: none;
                    }

                    .combobox .group.focus polygon,
                    .combobox .group:hover polygon {
                        fill-opacity: 1;
                    }

                    [role="listbox"].focus [role="option"][aria-selected="true"],
                    [role="listbox"] [role="option"]:hover {
                        background-color: #def;
                        padding-top: 0;
                        padding-bottom: 0;
                        border-top: 2px solid currentcolor;
                        border-bottom: 2px solid currentcolor;
                    }
                `}
            </style>
            <label id={`${searchInputId}-label`} htmlFor={searchInputId} className="text-[1.06rem] font-semibold">
                {label}{isRequired ? ' (required)' : ''}
            </label>
            { !isBlank(descriptionText) &&
                <div id={`${searchInputId}-description`}>{ descriptionText }</div>
            }
            <div className="flex flex-row gap-3 flex-wrap">
                <div className="relative combobox combobox-list">
                    <div className={`group inline-flex  cursor-pointer rounded-md ${comboBoxHasVisualFocus ? 'focus' : ''}`}>
                        <input
                            id={searchInputId}
                            className={`cb_edit w-64 bg-white text-black box-border p-1 m-0
                                align-bottom border-t-1 border-b-1 border-l-1 border-gray 
                                border-solid relative cursor-pointer border-r-none
                                rounded-l-md hover:bg-[#def] focus:bg-[#def]
                                ${errorText && !isBlank(errorText) ? 'border-t-2 border-b-2 border-l-2 border-red-500' : ''}`}
                            type="text"
                            value={comboBoxNodeValue}
                            onChange={(event) => setComboBoxNodeValue(event.target.value)}
                            role="comboBox"
                            autoComplete="off"
                            aria-autocomplete="list"
                            aria-expanded={isListboxExpanded}
                            aria-controls={listboxId}
                            onKeyDown={onComboBoxKeyDown}
                            onKeyUp={onComboboxKeyUp}
                            onClick={onComboboxClick}
                            onFocus={onComboboxFocus}
                            onBlur={onComboboxBlur}
                            aria-describedby={`${`${searchInputId}-label`} ${descriptionText ? `${searchInputId}-description` : ''} ${errorText ? `${searchInputId}-error` : ''}`}
                            aria-activedescendant={comboBoxNodeActiveDescendant}
                            ref={comboBoxNodeRef}>
                        </input>
                        <button
                            id={buttonId}
                            type="button"
                            className={`bg-white text-black box-border p-1 m-0
                                align-bottom border border-gray border-solid relative
                                cursor-pointer w-[26px] border-l-0 text-[rgb(0 90 156)]
                                rounded-r-md hover:bg-[#def] focus:bg-[#def]
                                ${errorText && !isBlank(errorText) ? 'border-t-2 border-b-2 border-r-2 border-red-500' : ''}`}
                            tabIndex={-1}
                            aria-label={listAriaLabel}
                            aria-expanded={isListboxExpanded}
                            aria-controls={listboxId}
                            onClick={onButtonClick}
                            ref={buttonRef}
                            >
                            <svg width="18" height="16" aria-hidden="true" focusable="false" style={{ forcedColorAdjust: "auto" }}>
                                <polygon className="arrow" strokeWidth="0" fillOpacity="0.75" fill="currentcolor" points="3,6 15,6 9,14"></polygon>
                            </svg>
                        </button>
                    </div>
                    <ul
                        id={listboxId}
                        className={`m-0 p-0 absolute left-[2px] top-[38px] list-none bg-white z-10
                            hidden box-border border-2 border-current border-solid max-h-[250px]
                            w-64 overflow-scroll overflow-x-hidden text-[87.5%] cursor-pointer
                            ${listboxHasVisualFocus ? 'focus' : ''}`}
                        role="listbox"
                        aria-label={listAriaLabel ? listAriaLabel : label}
                        ref={listboxRef}
                        onPointerOver={onListboxPointerover}
                        onPointerOut={onListboxPointerout}
                        >
                        {
                            filteredOptions.map(option => {
                                if (option.isSelected) {
                                    return (
                                        <li
                                            key={`${option.listItemId}-key`}
                                            id={option.listItemId}
                                            role="option"
                                            className="m-0 block pl-[3px] pt-[2px] pb-[2px] text-[1.06rem]"
                                            aria-selected={option.isSelected}
                                            onClick={onOptionClick}
                                            onPointerOver={onOptionPointerOver}
                                            onPointerOut={onOptionPointerOut}
                                            >
                                            {option.label}
                                        </li>
                                    );
                                } else {
                                    return (
                                        <li
                                            key={`${option.listItemId}-key`}
                                            id={option.listItemId}
                                            role="option"
                                            className="m-0 block pl-[3px] pt-[2px] pb-[2px] text-[1.06rem]"
                                            onClick={onOptionClick}
                                            onPointerOver={onOptionPointerOver}
                                            onPointerOut={onOptionPointerOut}
                                            >
                                            {option.label}
                                        </li>
                                    );
                                }
                            })
                        }
                    </ul>
                </div>
                { addOptionBtn !== undefined && addOptionBtn }
            </div>
            { !isBlank(errorText) &&
                <div id={`${searchInputId}-error`} className="mt-1">
                    <span className="border-2 border-white-500 bg-red-500 text-white pl-[7px] pr-[7px] p-[3px] rounded-[100px] font-bold text-lg" aria-label="Error: ">X</span>
                    <span className="text-red-700 font-semibold ml-1">{ errorText }</span>
                </div>
            }
        </div>
    );
}