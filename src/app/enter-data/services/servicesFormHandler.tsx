'use client'

import { useState } from 'react';
import { EventModel } from '../../models';
import { ServicesForm } from './servicesForm';
import { getFormattedDate } from '../../utils/getFormattedDate';
import { Button } from '../../components';

export function ServicesFormHandler({ isUpdate, reportingDataType, data, onSuccessfulUpdate, onModifyCancel }: {
    isUpdate: boolean,
    reportingDataType: string,
    data?: EventModel,
    onSuccessfulUpdate?: (nextPage: 'search' | 'table' | 'modify') => void,
    onModifyCancel?: () => void
}) {
    const [isFormSubmittedSuccessfully, setIsFormSubmittedSuccessfully] = useState<boolean>(false);
    const [dataType, setDataType] = useState<string>(reportingDataType);
    const [submittedDataType, setSubmittedDataType] = useState<{ code: string, label: string}>({ code: '', label: '' });
    const [submittedData, setSubmittedData] = useState<EventModel>();

    function onSuccessfulFormSubmit(event: EventModel, dataType: { code: string, label: string }) {
        setSubmittedDataType(dataType);
        setSubmittedData(event);
        setIsFormSubmittedSuccessfully(true);
    }

    function handleSubmitAnotherEvent(e: any) {
        setDataType(submittedDataType.code);
        setIsFormSubmittedSuccessfully(false);
    }

    if (!isFormSubmittedSuccessfully) {
        return (
            <ServicesForm
                isUpdate={isUpdate}
                selectedDataType={dataType}
                data={data}
                onSuccessfulSubmit={onSuccessfulFormSubmit}
                onModifyCancel={onModifyCancel}>
            </ServicesForm>
        );
    } else {
        return (
            <div>
                <h1 id="main-content-header" className="text-xl md:text-2xl mb-4" tabIndex={-1}>
                    Successfully { isUpdate ? 'Updated' : 'Submitted' } { submittedDataType.label }
                </h1>
                <main>
                    <p className="mb-2">
                        The { submittedDataType.label } { submittedData ? `that took place on ${getFormattedDate(submittedData.date)} ` : '' }
                        was successfully saved.
                    </p>
                    { !isUpdate &&
                        <div>
                            <p className="mb-4">
                                Select the 'Submit Another { submittedDataType.label }' button to return to the form.
                            </p>
                            <Button design="primary" width="sm:w-85" onClick={handleSubmitAnotherEvent}>
                                Submit Another { submittedDataType.label }
                            </Button>
                        </div>
                    }
                    { isUpdate &&
                        <div>
                            <p className="mb-4">
                                Select the 'Return to Search Results' button to return to the search results table, or
                                select the 'Conduct a New Search' button to return to the search criteria form.
                            </p>
                            <div className="flex flex-row gap-2">
                                <Button
                                    onClick={() => { if (onSuccessfulUpdate) { onSuccessfulUpdate('table') }}}
                                    width="sm:w-55"
                                    design="primary">
                                    Return to Search Results
                                </Button>
                                <Button
                                    onClick={() => { if (onSuccessfulUpdate) { onSuccessfulUpdate('search') }}}
                                    width="sm:w-55"
                                    design="primary">
                                    Conduct a New Search
                                </Button>
                            </div>
                        </div>
                    }
                </main>
            </div>
        );
    }

}