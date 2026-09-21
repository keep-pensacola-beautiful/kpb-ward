'use client'

import { useState } from 'react';
import { EventModel } from '../../models';
import { ServicesForm } from './servicesForm';
import { getFormattedDate } from '../../utils/getFormattedDate';

export function ServicesFormHandler({ isUpdate, reportingDataType }: { isUpdate: boolean, reportingDataType: string }) {
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
                onSuccessfulSubmit={onSuccessfulFormSubmit}>
            </ServicesForm>
        );
    } else {
        return (
            <div>
                <h1 id="main-content-header" className="text-xl md:text-2xl mb-4" tabIndex={-1}>
                    Successfully Submitted { submittedDataType.label }
                </h1>
                <main>
                    <p className="mb-2">
                        The { submittedDataType.label } { submittedData ? `that took place on ${getFormattedDate(submittedData.date)} ` : '' }
                        was successfully saved.
                    </p>
                    <p>
                        Select the 'Submit Another { submittedDataType.label }' button to return to the form.
                    </p>
                    <button onClick={handleSubmitAnotherEvent} className="border p-2 rounded-md bg-[var(--deepBlue)] text-[var(--tan)] text-[1.06rem] mt-4">
                        Submit Another { submittedDataType.label }
                    </button>
                </main>
            </div>
        );
    }

}