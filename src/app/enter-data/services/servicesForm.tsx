'use client'

import { useState, useEffect, useCallback } from 'react';
import { Alert, Button, ErrorSummary, RadioList } from '../../components';
import { REPORTING_DATA_TYPE_LIST_NAME, REPORTING_DATA_TYPE_OPTIONS, REPORTING_DATA_VALUES } from './servicesJson';
import {
    getBulkyItemRefData,
    getDistrictRefData,
    saveCleanTeamData,
    saveCountyCleanupData,
    saveRoadsideLitterData,
    saveTrashRoutesData
} from './actions';
import { BulkyItemModel, DistrictModel, ErrorModel } from '../../models';
import {
    CleanTeamEventModel,
    CountyCleanupEventModel,
    EventModel,
    RoadsideLitterEventModel,
    TrashRoutesEventModel
} from '../../models/event';
import {
    CleanTeamFormFields,
    CountyCleanupFormFields,
    RoadsideLitterFormFields,
    TrashRoutesFormFields
} from './formsByActivity';
import { isBlank } from '../../utils/isBlank';
import { scrollToTopAndFocusAnElementById } from '../../utils/scrollToTopAndFocusHeader';
import {
    isCleanTeamEvent,
    isCountyCleanupEvent,
    isRoadsideLitterEvent,
    isTrashRoutesEvent
} from '../../utils/eventTypeGuards';

export function ServicesForm({
    isUpdate, selectedDataType, data, onSuccessfulSubmit, onModifyCancel
}: {
    isUpdate: boolean,
    selectedDataType: string,
    data?: EventModel,
    onSuccessfulSubmit: (event: EventModel, reportingDataType: { code: string, label: string }) => void,
    onModifyCancel?: () => void
}) {
    const [reportingDataType, setReportingDataType] = useState<string>(selectedDataType);
    const [errors, setErrors] = useState<Map<string, ErrorModel>>(new Map<string, ErrorModel>());
    const [hasReferenceDataBeenRequested, setHasReferenceDataBeenRequested] = useState<boolean>(false);
    const [bulkyItemOptions, setBulkyItemOptions] = useState<string>('[]');
    const [districtOptions, setDistrictOptions] = useState<string>('[]');
    const [selectedBulkyItemValues, setSelectedBulkyItemValues] = useState<string[]>([]);
    const [alertHeader, setAlertHeader] = useState<string>('');
    const MS_DELAY_100: number = 100;

    useEffect(() => {
        if (!hasReferenceDataBeenRequested) {
            setHasReferenceDataBeenRequested(true);
            getBulkyItems();
            getDistricts();
        }
    }, [hasReferenceDataBeenRequested]);

    const getBulkyItems = useCallback(() => {
        getBulkyItemRefData().then((items: string) => {
            if (!isBlank(items)) {
                setBulkyItemOptions(items);
            }
        });
    }, []);

    const getDistricts = useCallback(() => {
        getDistrictRefData().then((districts: string) => {
            if (!isBlank(districts)) {
                setDistrictOptions(districts);
            }
        });
    }, []);

    const getFormByActivity = (activity: string) => {
        switch (activity) {
            case (REPORTING_DATA_VALUES.cleanTeam.code):
                return (
                    <CleanTeamFormFields
                        data={isCleanTeamEvent(data) ? data : undefined}
                        errors={errors}>
                    </CleanTeamFormFields>
                );
            case (REPORTING_DATA_VALUES.countyCleanup.code):
                return (
                    <CountyCleanupFormFields
                        data={isCountyCleanupEvent(data) ? data : undefined}
                        bulkyItemsReferenceString={bulkyItemOptions}
                        errors={errors}
                        handleBulkyItemChange={handleBulkyItemChange}>
                    </CountyCleanupFormFields>
                );
            case (REPORTING_DATA_VALUES.roadsideLitter.code):
                return (
                    <RoadsideLitterFormFields
                        data={isRoadsideLitterEvent(data) ? data : undefined}
                        bulkyItemsReferenceString={bulkyItemOptions}
                        districtsReferenceString={districtOptions}
                        errors={errors}
                        handleBulkyItemChange={handleBulkyItemChange}>
                    </RoadsideLitterFormFields>
                );
            case (REPORTING_DATA_VALUES.trashRoutes.code):
                return (
                    <TrashRoutesFormFields
                        data={isTrashRoutesEvent(data) ? data : undefined}
                        errors={errors}>
                    </TrashRoutesFormFields>
                );
        }
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        switch (reportingDataType) {
            case (REPORTING_DATA_VALUES.cleanTeam.code):
                handleCleanTeamEventSubmit(new FormData(e.target));
                break;
            case (REPORTING_DATA_VALUES.countyCleanup.code):
                handleCountyCleanupEventSubmit(new FormData(e.target));
                break;
            case (REPORTING_DATA_VALUES.roadsideLitter.code):
                handleRoadsideLitterEventSubmit(new FormData(e.target));
                break;
            case (REPORTING_DATA_VALUES.trashRoutes.code):
                handleTrashRoutesEventSubmit(new FormData(e.target));
                break;
        }
    }

    async function handleCleanTeamEventSubmit(formData: FormData): Promise<void> {
        const cleanResult: { isSuccessful: boolean, data: CleanTeamEventModel | null, errors: Map<string, ErrorModel> } =
            await saveCleanTeamData(formData, isUpdate, data?.id);
        setErrors(cleanResult.errors);
        if (cleanResult.isSuccessful && cleanResult.data) {
            onSuccessfulSubmit(cleanResult.data, {
                code: REPORTING_DATA_VALUES.cleanTeam.code,
                label: `${REPORTING_DATA_VALUES.cleanTeam.label} Event`
            });
        } else if (cleanResult.errors !== null && cleanResult.errors.size > 0) {
            scrollToTopAndFocusAnElementById('error-header', MS_DELAY_100);
        } else if (!cleanResult.isSuccessful) {
            setAlertHeader(`Unable to Save ${REPORTING_DATA_VALUES.cleanTeam.label}`);
            scrollToTopAndFocusAnElementById('save-failure-alert-header', MS_DELAY_100);
        }
    }

    async function handleCountyCleanupEventSubmit(formData: FormData): Promise<void> {
        let prevSavedBulkyItems: BulkyItemModel[] = isCountyCleanupEvent(data) ? data.otherBulkyItems : [];
        const countyResult: { isSuccessful: boolean, data: CountyCleanupEventModel | null, errors: Map<string, ErrorModel> } =
            await saveCountyCleanupData(formData, selectedBulkyItemValues, isUpdate, data?.id, prevSavedBulkyItems);
        setErrors(countyResult.errors);
        if (countyResult.isSuccessful && countyResult.data) {
            onSuccessfulSubmit(countyResult.data, {
                code: REPORTING_DATA_VALUES.countyCleanup.code,
                label: REPORTING_DATA_VALUES.countyCleanup.label
            });
        } else if (countyResult.errors !== null && countyResult.errors.size > 0) {
            scrollToTopAndFocusAnElementById('error-header', MS_DELAY_100);
        } else if (!countyResult.isSuccessful) {
            setAlertHeader(`Unable to Save ${REPORTING_DATA_VALUES.countyCleanup.label}`);
            scrollToTopAndFocusAnElementById('save-failure-alert-header', MS_DELAY_100);
        }
    }

    async function handleRoadsideLitterEventSubmit(formData: FormData): Promise<void> {
        let prevSavedBulkyItems: BulkyItemModel[] = [];
        let prevSavedDistricts: DistrictModel[] = [];
        if (isRoadsideLitterEvent(data)) {
            prevSavedBulkyItems = data.bulkyItems;
            prevSavedDistricts = data.districts;
        }
        const roadsideResult: { isSuccessful: boolean, data: RoadsideLitterEventModel | null, errors: Map<string, ErrorModel> } =
            await saveRoadsideLitterData(formData, selectedBulkyItemValues, isUpdate, data?.id, prevSavedBulkyItems, prevSavedDistricts);
        setErrors(roadsideResult.errors);
        if (roadsideResult.isSuccessful && roadsideResult.data) {
            onSuccessfulSubmit(roadsideResult.data, {
                code: REPORTING_DATA_VALUES.roadsideLitter.code,
                label: `${REPORTING_DATA_VALUES.roadsideLitter.label} Cleanup`
            });
        } else if (roadsideResult.errors !== null && roadsideResult.errors.size > 0) {
            scrollToTopAndFocusAnElementById('error-header', MS_DELAY_100);
        } else if (!roadsideResult.isSuccessful) {
            setAlertHeader(`Unable to Save ${REPORTING_DATA_VALUES.roadsideLitter.label}`);
            scrollToTopAndFocusAnElementById('save-failure-alert-header', MS_DELAY_100);
        }
    }

    async function handleTrashRoutesEventSubmit(formData: FormData): Promise<void> {
        const routesResult: { isSuccessful: boolean, data: TrashRoutesEventModel | null, errors: Map<string, ErrorModel> } =
            await saveTrashRoutesData(formData, isUpdate, data?.id);
        setErrors(routesResult.errors);
        if (routesResult.isSuccessful && routesResult.data) {
            onSuccessfulSubmit(routesResult.data, {
                code: REPORTING_DATA_VALUES.trashRoutes.code,
                label: REPORTING_DATA_VALUES.trashRoutes.label
            });
        } else if (routesResult.errors !== null && routesResult.errors.size > 0) {
            scrollToTopAndFocusAnElementById('error-header', MS_DELAY_100);
        } else if (!routesResult.isSuccessful) {
            setAlertHeader(`Unable to Save ${REPORTING_DATA_VALUES.trashRoutes.label}`);
            scrollToTopAndFocusAnElementById('save-failure-alert-header', MS_DELAY_100);
        }
    }

    const handleReportingDataTypeChange: any = useCallback((event: any) => {
        setReportingDataType(event.target.value);
        setSelectedBulkyItemValues([]);
        setErrors(new Map<string, ErrorModel>());
        setAlertHeader('');
    }, []);

    function handleBulkyItemChange(selectedBulkyItemValues: string[]) {
        setSelectedBulkyItemValues(selectedBulkyItemValues);
    }

    return (
        <div>
            { alertHeader !== '' &&
                <Alert
                    id="save-failure-alert"
                    type="danger"
                    header={alertHeader}
                    body="If it is outside of normal business hours, the database may be off.
                        Please copy the values you entered and try again later."
                    closeButton={true}
                    onClose={() => setAlertHeader('')}>
                </Alert>
            }

            
            
            {(errors && errors.size >= 1) &&
                <ErrorSummary errors={JSON.stringify(Array.from(errors.values()))}></ErrorSummary>}
            <h1 id="main-content-header" className="text-xl md:text-2xl mb-2" tabIndex={-1}>
                {isUpdate ? 'Update' : 'Enter'} Data: Services Data
            </h1>
            <main>
                <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                    {!isUpdate &&
                        <RadioList
                            label="KPB Program"
                            listName={REPORTING_DATA_TYPE_LIST_NAME}
                            options={JSON.stringify(REPORTING_DATA_TYPE_OPTIONS)}
                            isRequired={true}
                            selectedValue={reportingDataType}
                            handleChange={handleReportingDataTypeChange}>
                        </RadioList>
                    }
                    { getFormByActivity(reportingDataType) }
                    <div className="flex flex-row gap-2 mt-4 mb-4">
                        {reportingDataType !== '' &&
                            <Button design="primary" width="sm:w-22">Submit</Button>
                        }
                        { (isUpdate && onModifyCancel !== undefined) &&
                            <Button
                                design="secondary"
                                type="button"
                                width="sm:w-35"
                                onClick={onModifyCancel}>
                                Cancel Update
                            </Button>
                        }
                    </div>
                </form>
            </main>
        </div>
    );
}