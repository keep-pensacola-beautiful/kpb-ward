'use client'

import { useCallback, useEffect, useState, useRef } from 'react';
import { Alert, ErrorSummary, RadioList } from '../../components';
import { ErrorModel } from '../../models';
import { BagSwapEventModel, EducationEventModel, EventModel, TreePlantingEventModel } from '../../models/event';
import { ComboBoxListItemModel } from '../../components/comboBox/comboBoxListItem.model';
import {
    getEducationRecipients,
    getEducationTopics,
    saveBagSwapData,
    saveEducationData,
    saveTreePlantingData
} from './actions';
import { BagSwapFormFields, EducationFormFields, TreePlantingFormFields } from './formsByActivity';
import { REPORTING_DATA_TYPE_LIST_NAME, REPORTING_DATA_TYPE_OPTIONS, REPORTING_DATA_VALUES } from './otherJson';
import { isBlank } from '../../utils/isBlank';
import { scrollToTopAndFocusAnElementById } from '../../utils/scrollToTopAndFocusHeader';
import { OtherDialogs } from './otherDialogs';

export function OtherForm({
    isUpdate, selectedDataType, onSuccessfulSubmit
}: {
    isUpdate: boolean,
    selectedDataType: string,
    onSuccessfulSubmit: (event: EventModel, reportingDataType: { code: string, label: string }) => void
}) {
    const [isRecipientDialogOpen, setIsRecipientDialogOpen] = useState<boolean>(false);
    const [isTopicDialogOpen, setIsTopicDialogOpen] = useState<boolean>(false);
    const [reportingDataType, setReportingDataType] = useState<string>(selectedDataType);
    const [errors, setErrors] = useState<Map<string, ErrorModel>>(new Map<string, ErrorModel>());
    const [hasReferenceDataBeenRequested, setHasReferenceDataBeenRequested] = useState<boolean>(false);

    const [edRecipientOptions, setEdRecipientOptions] = useState<string>('[]');
    const [edRecipientValueToIdMap, setEdRecipientValueToIdMap] = useState<Map<string, string>>(new Map<string, string>());

    const [edTopicOptions, setEdTopicOptions] = useState<string>('[]');
    const [edTopicValueToIdMap, setEdTopicValueToIdMap] = useState<Map<string, string>>(new Map<string, string>());

    const [selectedEdRecipient, setSelectedEdRecipient] = useState<string>('');
    const [selectedEdTopic, setSelectedEdTopic] = useState<string>('');

    const [alertHeader, setAlertHeader] = useState<string>('');
    const formRef = useRef<HTMLFormElement>(null);
    const MS_DELAY_100: number = 100;

    useEffect(() => {
        if (!hasReferenceDataBeenRequested) {
            setHasReferenceDataBeenRequested(true);
            getEdRecipients();
            getEdTopics();
        }

        if (formRef.current) {
            formRef.current.addEventListener('keydown', (event: any) => {
                if (event.target && event.key === 'Enter' && event.target.role === 'comboBox') {
                    event.preventDefault();
                }
            });
        }
    }, [hasReferenceDataBeenRequested]);

    const getEdRecipients: any = useCallback((onSuccessFn?: () => void) => {
        getEducationRecipients().then((recipients) => {
            if (!isBlank(recipients) && recipients !== '[]') {
                setEdRecipientOptions(recipients);
                let recipientValueToIdMap: Map<string, string> = new Map<string, string>();
                JSON.parse(recipients).map((recipient: ComboBoxListItemModel) => {
                    recipientValueToIdMap.set(recipient.label, recipient.key);
                });
                setEdRecipientValueToIdMap(recipientValueToIdMap);
                if (onSuccessFn) {
                    onSuccessFn();
                }
            }
        });
    }, []);

    const getEdTopics: any = useCallback((onSuccessFn?: () => void) => {
        getEducationTopics().then((topics) => {
            if (!isBlank(topics) && topics !== '[]') {
                setEdTopicOptions(topics);
                let topicValueToIdMap: Map<string, string> = new Map<string, string>();
                JSON.parse(topics).map((topic: ComboBoxListItemModel) => {
                    topicValueToIdMap.set(topic.label, topic.key);
                });
                setEdTopicValueToIdMap(topicValueToIdMap);
                if (onSuccessFn) {
                    onSuccessFn();
                }
            }
        });
    }, []);

    const handleReportingDataTypeChange: any = useCallback((event: any) => {
        setReportingDataType(event.target.value);
        setErrors(new Map<string, ErrorModel>());
        setAlertHeader('');
    }, []);

    const getFormByActivity: any = (activity: string) => {
        switch (activity) {
            case REPORTING_DATA_VALUES.bagSwap.code:
                return (<BagSwapFormFields errors={errors}></BagSwapFormFields>);
            case REPORTING_DATA_VALUES.education.code:
                return (
                    <EducationFormFields
                        recipientOptions={edRecipientOptions}
                        selectedRecipient={selectedEdRecipient}
                        topicOptions={edTopicOptions}
                        selectedTopic={selectedEdTopic}
                        errors={errors}
                        handleRecipientChange={setSelectedEdRecipient}
                        handleTopicChange={setSelectedEdTopic}
                        onAddRecipient={() => setIsRecipientDialogOpen(true)}
                        onAddTopic={() => setIsTopicDialogOpen(true)}>
                    </EducationFormFields>
                );
            case REPORTING_DATA_VALUES.treePlanting.code:
                return (<TreePlantingFormFields errors={errors}></TreePlantingFormFields>);
        }
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        switch (reportingDataType) {
            case REPORTING_DATA_VALUES.bagSwap.code:
                handleBagSwapEventSubmit(new FormData(e.target));
                break;
            case REPORTING_DATA_VALUES.education.code:
                handleEducationEventSubmit(new FormData(e.target))
                break;
            case REPORTING_DATA_VALUES.treePlanting.code:
                handleTreePlantingEventSubmit(new FormData(e.target));
                break;
        }
    }

    async function handleBagSwapEventSubmit(formData: FormData): Promise<void> {
        const bagResult: { isSuccessful: boolean, data: BagSwapEventModel | null, errors: Map<string, ErrorModel> } =
            await saveBagSwapData(formData, isUpdate);
        setErrors(bagResult.errors);
        if (bagResult.isSuccessful && bagResult.data) {
            onSuccessfulSubmit(bagResult.data, REPORTING_DATA_VALUES.bagSwap);
        } else if (bagResult.errors !== null && bagResult.errors.size > 0) {
            scrollToTopAndFocusAnElementById('error-header', MS_DELAY_100);
        } else if (!bagResult.isSuccessful) {
            setAlertHeader(`Unable to Save ${REPORTING_DATA_VALUES.bagSwap.label}`);
            scrollToTopAndFocusAnElementById('save-failure-alert-header', MS_DELAY_100);
        }
    }

    async function handleEducationEventSubmit(formData: FormData): Promise<void> {
        const selectedRecipientId: string | undefined = edRecipientValueToIdMap.has(selectedEdRecipient)
            ? edRecipientValueToIdMap.get(selectedEdRecipient) : '';
        const selectedTopicId: string | undefined = edTopicValueToIdMap.has(selectedEdTopic)
            ? edTopicValueToIdMap.get(selectedEdTopic) : '';
        const edResult: { isSuccessful: boolean, data: EducationEventModel | null, errors: Map<string, ErrorModel> } =
            await saveEducationData(
                formData,
                selectedRecipientId ? selectedRecipientId : '',
                selectedTopicId ? selectedTopicId : '',
                isUpdate
            );
        setErrors(edResult.errors);
        if (edResult.isSuccessful && edResult.data) {
            onSuccessfulSubmit(edResult.data, REPORTING_DATA_VALUES.education);
        } else if (edResult.errors !== null && edResult.errors.size > 0) {
            scrollToTopAndFocusAnElementById('error-header', MS_DELAY_100);
        } else if (!edResult.isSuccessful) {
            setAlertHeader(`Unable to Save ${REPORTING_DATA_VALUES.education.label}`);
            scrollToTopAndFocusAnElementById('save-failure-alert-header', MS_DELAY_100);
        }
    }

    async function handleTreePlantingEventSubmit(formData: FormData): Promise<void> {
        const treeResult: { isSuccessful: boolean, data: TreePlantingEventModel | null, errors: Map<string, ErrorModel> } =
            await saveTreePlantingData(formData, isUpdate);
        setErrors(treeResult.errors);
        if (treeResult.isSuccessful && treeResult.data) {
            onSuccessfulSubmit(treeResult.data, REPORTING_DATA_VALUES.treePlanting);
        } else if (treeResult.errors !== null && treeResult.errors.size > 0) {
            scrollToTopAndFocusAnElementById('error-header', MS_DELAY_100);
        } else if (!treeResult.isSuccessful) {
            setAlertHeader(`Unable to Save ${REPORTING_DATA_VALUES.treePlanting.label}`);
            scrollToTopAndFocusAnElementById('save-failure-alert-header', MS_DELAY_100);
        }
    }

    function handleAddRecipient(newRecipient: string) {
        if (!isBlank(newRecipient)) {
            setIsRecipientDialogOpen(false);
            getEdRecipients(() => {
                setSelectedEdRecipient(newRecipient);
            });
        }
    }

    function handleAddTopic(newTopic: string) {
        if (!isBlank(newTopic)) {
            setIsTopicDialogOpen(false);
            getEdTopics(() => {
                setSelectedEdTopic(newTopic);
            });
        }
    }

    return (
        <div>
            <OtherDialogs
                isRecipientOpen={isRecipientDialogOpen}
                onCloseRecipient={(e: any) => setIsRecipientDialogOpen(false)}
                onAddRecipient={handleAddRecipient}
                currentRecipientValues={edRecipientValueToIdMap}
                isTopicOpen={isTopicDialogOpen}
                onCloseTopic={(e: any) => setIsTopicDialogOpen(false)}
                onAddTopic={handleAddTopic}
                currentTopicValues={edTopicValueToIdMap}>
            </OtherDialogs>
            { alertHeader !== '' &&
                <Alert
                    id="save-failure-alert"
                    type="error"
                    header={alertHeader}
                    body="If it is outside of normal business hours, the database may be off.
                        Please copy the values you entered and try again later."
                    onClose={() => setAlertHeader('')}>
                </Alert>
            }
            
            
            <form ref={formRef} className="flex flex-col gap-2 mt-2" onSubmit={handleSubmit}>
                {(errors && errors.size >= 1) &&
                    <ErrorSummary errors={JSON.stringify(Array.from(errors.values()))}></ErrorSummary>}
                <h1 id="main-content-header" className="text-xl md:text-2xl" tabIndex={-1}>
                    {isUpdate ? 'Update' : 'Enter'} Data: Other Data
                </h1>
                <main>
                    {!isUpdate &&
                        <RadioList
                            label="Reporting Data Type"
                            listName={REPORTING_DATA_TYPE_LIST_NAME}
                            options={JSON.stringify(REPORTING_DATA_TYPE_OPTIONS)}
                            isRequired={true}
                            selectedValue={reportingDataType}
                            handleChange={handleReportingDataTypeChange}>
                        </RadioList>
                    }
                    { getFormByActivity(reportingDataType) }
                    {reportingDataType !== '' &&
                        <button className="border p-2 w-25 rounded-md bg-[var(--deepBlue)] text-[var(--tan)] text-[1.06rem] mt-4 mb-4">
                            Submit
                        </button>
                    }
                </main>
            </form>
        </div>
    );
}