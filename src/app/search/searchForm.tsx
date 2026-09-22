'use client'

import { useCallback, useState } from 'react';
import { RadioList, Textbox } from '../components';
import { CategoryCode, ProgramCode } from '../models/search';
import {
    CATEGORY_CODES,
    DATA_CATEGORY_LIST_NAME,
    DATA_CATEGORY_OPTIONS,
    PROGRAM_CODES,
    PROGRAM_LIST_NAME,
    PROGRAM_OPTIONS
} from './searchJson';

export function SearchForm({ onSearch }: { onSearch: () => void }) {
    const [category, setCategory] = useState<string>(DATA_CATEGORY_OPTIONS[0].value);
    const [program, setProgram] = useState<string>(PROGRAM_CODES[0]);
    const [programOptions, setProgramOptions] = useState<string>(JSON.stringify(PROGRAM_OPTIONS[CATEGORY_CODES[0]]));

    const handleCategoryChange: any = useCallback((event: any) => {
        const value: any = event.target.value;
        const ctgyCode: CategoryCode = CATEGORY_CODES.includes(value) ? value : CATEGORY_CODES[0];
        setCategory(ctgyCode);
        setProgramOptions(JSON.stringify(PROGRAM_OPTIONS[ctgyCode]));
        setProgram(PROGRAM_OPTIONS[ctgyCode][0].value);
    }, []);

    const handleProgramChange: any = useCallback((event: any) => {
        const value: any = event.target.value;
        const pgrmCode: ProgramCode = PROGRAM_CODES.includes(value) ? value : PROGRAM_CODES[0];
        setProgram(pgrmCode);
    }, []);

    function handleSubmit(event: any) {
        console.log(new FormData(event.target));
        onSearch();
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-3">
            <RadioList
                label="Data Category"
                listName={DATA_CATEGORY_LIST_NAME}
                options={JSON.stringify(DATA_CATEGORY_OPTIONS)}
                selectedValue={category}
                handleChange={handleCategoryChange}>
            </RadioList>

            <RadioList
                label="KPB Program"
                listName={PROGRAM_LIST_NAME}
                options={programOptions}
                selectedValue={program}
                handleChange={handleProgramChange}>
            </RadioList>

            <section className="flex flex-col gap-3 mt-3">
                <header>
                    <h2 className="text-lg md:text-xl">Search Criteria</h2>
                    <p>
                        Please provide at least one of the following criteria for the search.
                        We encourage you to enter as many criteria as possible to narrow the search results.
                    </p>
                </header>
                <fieldset>
                    <legend><p className="text-[1.06rem] font-semibold">Date Range</p></legend>
                    <div className="flex flex-row gap-4">
                        <Textbox
                            inputId="start-date"
                            inputType="date"
                            labelText="Start Date"
                            labelFontWeight="font-normal">
                        </Textbox>
                        <Textbox
                            inputId="end-date"
                            inputType="date"
                            labelText="End Date"
                            labelFontWeight="font-normal">
                        </Textbox>
                    </div>
                </fieldset>
            </section>
            <button className="border p-1 rounded-md sm:w-20 bg-[var(--deepBlue)] text-[var(--tan)] text-[1.06rem]">
                Search
            </button>
        </form>
    );
}