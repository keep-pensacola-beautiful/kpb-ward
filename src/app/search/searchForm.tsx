'use client'

import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, LoadingDialog, RadioList, Textbox } from '../components';
import { ErrorModel } from '../models';
import { EventModel } from '../models/event';
import { CategoryCode, ProgramCode } from '../models/search';
import {
    CATEGORY_CODES,
    CRITERIA_FORM_FIELD_IDS,
    DATA_CATEGORY_LIST_NAME,
    DATA_CATEGORY_OPTIONS,
    PROGRAM_CODES,
    PROGRAM_LIST_NAME,
    PROGRAM_OPTIONS
} from './searchJson';
import { searchEventsByProgramAndByCriteria } from './actions';
import { AdoptASpotSearchCriteria } from './componentsByProgram/adoptASpot/searchCriteria';
import { BagSwapSearchCriteria } from './componentsByProgram/bagSwap/searchCriteria';
import { CleanTeamSearchCriteria } from './componentsByProgram/cleanTeam/searchCriteria';
import { CountyCleanupSearchCriteria } from './componentsByProgram/countyCleanup/searchCriteria';
import { GroupCleanupSearchCriteria } from './componentsByProgram/groupCleanup/searchCriteria';
import { RoadsideLitterSearchCriteria } from './componentsByProgram/roadsideLitter/searchCriteria';
import { TrashRoutesSearchCriteria } from './componentsByProgram/trashRoutes/searchCriteria';
import { isFormDataEntryValueNullOrBlank, validateDate } from '../utils/commonFormValidation';
import { getDistrictRefData } from './actions';
import {
    getAdoptASpotAssignmentComboboxOptions,
    getCleanupLocationComboboxOptions,
    getCleanupOrganizationComboboxOptions,
    getEducationRecipientComboboxOptions,
    getEducationTopicComboboxOptions
} from '../lib/comboBoxOptionRetrieval';
import { ComboBoxListItemModel } from '../components/comboBox/comboBoxListItem.model';
import { isBlank } from '../utils/isBlank';
import { TreePlantingSearchCriteria } from './componentsByProgram/treePlanting/searchCriteria';
import { EducationSearchCriteria } from './componentsByProgram/education/searchCriteria';

export function SearchForm({ onSearch }: {
    onSearch: (pgrmCode: ProgramCode, events: EventModel[], searchCriteria: Map<string, string>) => void 
}) {
    const [category, setCategory] = useState<string>(DATA_CATEGORY_OPTIONS[0].value);
    const [program, setProgram] = useState<string>(PROGRAM_CODES[0]);
    const [programOptions, setProgramOptions] = useState<string>(JSON.stringify(PROGRAM_OPTIONS[CATEGORY_CODES[0]]));
    const [displayNoCriteriaError, setDisplayNoCriteriaError] = useState<boolean>(false);
    const [dateRangeErrors, setDateRangeErrors] = useState<Map<string, ErrorModel>>(new Map<string, ErrorModel>());
    const [districtOptions, setDistrictOptions] = useState<string>('[]');
    const [assignmentOptions, setAssignmentOptions] = useState<string>('[]');
    const [locationOptions, setLocationOptions] = useState<string>('[]');
    const [organizationOptions, setOrganizationOptions] = useState<string>('[]');
    const [topicOptions, setTopicOptions] = useState<string>('[]');
    const [recipientOptions, setRecipientOptions] = useState<string>('[]');
    const [isLoadingDialogOpen, setIsLoadingDialogOpen] = useState<boolean>(false);
    
    useEffect(() => {
        getDistrictRefData().then((options: string) => setDistrictOptions(options));
        getAdoptASpotAssignmentComboboxOptions().then((options: string) => setAssignmentOptions(options));
        getCleanupLocationComboboxOptions().then((options: string) => setLocationOptions(options));
        getCleanupOrganizationComboboxOptions().then((options: string) => setOrganizationOptions(options));
        getEducationRecipientComboboxOptions().then((options: string) => setRecipientOptions(options));
        getEducationTopicComboboxOptions().then((options: string) => setTopicOptions(options));
    }, [])

    const handleCategoryChange: any = useCallback((event: any) => {
        const value: any = event.target.value;
        const ctgyCode: CategoryCode = CATEGORY_CODES.includes(value) ? value : CATEGORY_CODES[0];
        setCategory(ctgyCode);
        setProgramOptions(JSON.stringify(PROGRAM_OPTIONS[ctgyCode]));
        setProgram(PROGRAM_OPTIONS[ctgyCode][0].value);
        setDisplayNoCriteriaError(false);
        setDateRangeErrors(new Map<string, ErrorModel>());
    }, []);

    const handleProgramChange: any = useCallback((event: any) => {
        const value: any = event.target.value;
        const pgrmCode: ProgramCode = PROGRAM_CODES.includes(value) ? value : PROGRAM_CODES[0];
        setProgram(pgrmCode);
        setDisplayNoCriteriaError(false);
        setDateRangeErrors(new Map<string, ErrorModel>());
    }, []);

    async function handleSubmit(event: any) {
        event.preventDefault();
        setIsLoadingDialogOpen(true);
        const pgrmCode: ProgramCode = PROGRAM_CODES.includes(program as any) ? program as any : PROGRAM_CODES[0];
        const formIds: string[] = CRITERIA_FORM_FIELD_IDS[pgrmCode];
        const searchCriteria = validateFormFields(pgrmCode, new FormData(event.target), formIds);
        if (searchCriteria.size > 0) {
            const events: EventModel[] = await searchEventsByProgramAndByCriteria(pgrmCode, searchCriteria);
            setIsLoadingDialogOpen(false);
            onSearch(pgrmCode, events, searchCriteria);
        } else {
            setIsLoadingDialogOpen(false);
        }
    }

    function validateFormFields(pgrmCode: ProgramCode, formData: FormData, formIds: string[]): Map<string, string> {
        let searchCriteria: Map<string, string> = new Map<string, string>();
        let dateErrors: Map<string, ErrorModel> = new Map<string, ErrorModel>;
        let field: FormDataEntryValue | null;

        field = formData.get('start-date');
        if (field !== null && !isFormDataEntryValueNullOrBlank(field)) {
            searchCriteria.set('start-date', field.toString());
        } else {
            dateErrors.set('start-date', { inputId: 'start-date', fieldName: 'Start Date', message: 'Please enter a start date' });
        }

        field = formData.get('end-date');
        if (field !== null && !isFormDataEntryValueNullOrBlank(field)) {
            searchCriteria.set('end-date', field.toString());
        } else {
            dateErrors.set('end-date', { inputId: 'end-date', fieldName: 'End Date', message: 'Please enter an end date' });
        }

        setDateRangeErrors(dateErrors);
        if (dateErrors.size > 0) {
            let [firstKey] = dateErrors.keys();
            setTimeout(() => {
                document.getElementById(firstKey)?.focus();
            }, 50);
            return new Map<string, string>();
        }

        let fieldContent: string;
        let id: string;
        for (let i = 0; i < formIds.length; i++) {
            field = formData.get(formIds[i]);
            if (field !== null && !isFormDataEntryValueNullOrBlank(field)) {
                fieldContent = field.toString();
                if (isComboboxInput(formIds[i])) {
                    id = getIdOfSelectedComboboxOption(formIds[i], fieldContent);
                    if (!isBlank(id)) {
                        searchCriteria.set(formIds[i], id);
                    }
                } else {
                    searchCriteria.set(formIds[i], fieldContent);
                }
            }
        }
        if (searchCriteria.size < 3) {
            setDisplayNoCriteriaError(true);
            setTimeout(() => {
                document.getElementById('criteria-missing-error-header')?.focus();
            }, 50);
            return new Map<string, string>();
        } else {
            setDisplayNoCriteriaError(false);
        }
        return searchCriteria;
    }

    function isComboboxInput(formId: string) {
        return (/combobox/).test(formId);
    }

    function getIdOfSelectedComboboxOption(formId: string, selectedOptionText: string): string {
        let options: ComboBoxListItemModel[];
        if ((/^adopted-spot/).test(formId)) {
            options = JSON.parse(assignmentOptions);
        } else if ((/^organization/).test(formId)) {
            options = JSON.parse(organizationOptions);
        } else if ((/^location/).test(formId)) {
            options = JSON.parse(locationOptions);
        } else if ((/^topic/).test(formId)) {
            options = JSON.parse(topicOptions);
        } else if ((/^recipient/).test(formId)) {
            options = JSON.parse(recipientOptions);
        } else {
            return '';
        }
        let option: ComboBoxListItemModel | undefined = options.find((element, index, array) => {
            return element.label === selectedOptionText;
        });
        return (option === undefined) ? '' : option.key;
    }

    function getFormByProgram(program: string) {
        const pgrmCode: ProgramCode = PROGRAM_CODES.includes(program as any) ? program as any : PROGRAM_CODES[0];
            switch (pgrmCode) {
                case 'cleanTeam':
                    return (<CleanTeamSearchCriteria></CleanTeamSearchCriteria>);
                case 'countyCleanup':
                    return (<CountyCleanupSearchCriteria></CountyCleanupSearchCriteria>);
                case 'roadside':
                    return (
                        <RoadsideLitterSearchCriteria
                            districtOptions={districtOptions}>
                        </RoadsideLitterSearchCriteria>);
                case 'routes':
                    return (<TrashRoutesSearchCriteria></TrashRoutesSearchCriteria>);
                case 'adoptASpot':
                    return (
                        <AdoptASpotSearchCriteria
                            assignmentOptions={assignmentOptions}>
                        </AdoptASpotSearchCriteria>);
                case 'groupCleanup':
                    return (
                        <GroupCleanupSearchCriteria
                            organizationOptions={organizationOptions}
                            locationOptions={locationOptions}>
                        </GroupCleanupSearchCriteria>
                    );
                case 'bagSwap':
                    return (<BagSwapSearchCriteria></BagSwapSearchCriteria>);
                case 'education':
                    return (
                        <EducationSearchCriteria
                            topicOptions={topicOptions}
                            recipientOptions={recipientOptions}>
                        </EducationSearchCriteria>);
                case 'treePlanting':
                    return (<TreePlantingSearchCriteria></TreePlantingSearchCriteria>);
            }
    }

    return (
        <div>
            <LoadingDialog
                isOpen={isLoadingDialogOpen}
                dialogId="searching-dialog"
                dialogTitle="Please wait while we search for Events matching the criteria">
            </LoadingDialog>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-3">
                <p>
                    Select a Data Category and a KPB Program, then enter at least one of the criteria and select the Search button.
                </p>
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

                <fieldset>
                    <legend><p className="text-[1.06rem] font-semibold">Date Range</p></legend>
                    <div className="flex flex-row gap-4">
                        <Textbox
                            inputId="start-date"
                            inputType="date"
                            labelText="Start Date"
                            labelFontWeight="font-normal"
                            isRequired={true}
                            ariaDescribedBy={dateRangeErrors.has('start-date') ? 'start-date-error' : ''}>
                        </Textbox>
                        <Textbox
                            inputId="end-date"
                            inputType="date"
                            labelText="End Date"
                            labelFontWeight="font-normal"
                            isRequired={true}
                            ariaDescribedBy={dateRangeErrors.has('end-date') ? 'end-date-error' : ''}>
                        </Textbox>
                    </div>
                    { Array.from(dateRangeErrors).map((error) => (
                        <div key={`${error[1].inputId}-error`} id={`${error[1].inputId}-error`} className="mt-1">
                            <span className="border-2 border-white-500 bg-red-500 text-white pl-[7px] pr-[7px] p-[3px] rounded-[100px] font-bold text-lg" aria-label="Error: ">X</span>
                            <span className="text-red-700 font-semibold ml-1">{ error[1].message }</span>
                        </div>
                    ))}
                </fieldset>

                <section className="flex flex-col gap-3 mt-3">
                    <header>
                        <h2 className="text-lg md:text-xl">Search Criteria</h2>
                        <p>
                            Please provide at least one of the following criteria for the search.
                            We encourage you to enter as many criteria as possible to narrow the search results.
                        </p>
                    </header>
                    { displayNoCriteriaError &&
                        <Alert
                            id="criteria-missing-error"
                            type="danger"
                            header="No Search Criteria Provided"
                            body="Please enter at least one search criteria."
                            closeButton={false}
                            onClose={() => console.log('Closing')}>
                        </Alert>
                    }
                    { getFormByProgram(program) }
                </section>
                <Button design="primary">Search</Button>
            </form>
        </div>
    );
}