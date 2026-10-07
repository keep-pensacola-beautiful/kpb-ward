'use client'

import { useCallback, useEffect, useState, useRef } from 'react';
import { ErrorModel } from '../../models';
import { AdoptASpotEventModel, EventModel, GroupCleanupEventModel } from '../../models/event';
import { Alert, Button, ErrorSummary, RadioList } from '../../components';
import { AdoptASpotFormFields, GroupCleanupFormFields } from './formsByActivity';
import { REPORTING_DATA_TYPE_LIST_NAME, REPORTING_DATA_TYPE_OPTIONS, REPORTING_DATA_VALUES } from './volunteerCleanupJson';
import {
    getAdoptASpotAssignmentOptions,
    getCleanupLocationOptions,
    getCleanupOrganizationOptions,
    saveAdoptASpotData,
    saveGroupCleanupData
} from './actions';
import { isBlank } from '../../utils/isBlank';
import { scrollToTopAndFocusAnElementById } from '../../utils/scrollToTopAndFocusHeader';
import { ComboBoxListItemModel } from '../../components/comboBox/comboBoxListItem.model';
import { VolunteerCleanupDialogs } from './volunteerCleanupDialogs';
import { isAdoptASpotEvent, isGroupCleanupEvent } from '../../utils/eventTypeGuards';

export function VolunteerCleanupForm({
    isUpdate, selectedDataType, data, onSuccessfulSubmit, onModifyCancel
}: {
    isUpdate: boolean,
    selectedDataType: string,
    data?: EventModel,
    onSuccessfulSubmit: (event: EventModel, reportingDataType: { code: string, label: string }) => void,
    onModifyCancel?: () => void
}) {
    const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState<boolean>(false);
    const [isLocationDialogOpen, setIsLocationDialogOpen] = useState<boolean>(false);
    const [isOrganizationDialogOpen, setIsOrganizationDialogOpen] = useState<boolean>(false);
    const [reportingDataType, setReportingDataType] = useState<string>(selectedDataType);
    const [errors, setErrors] = useState<Map<string, ErrorModel>>(new Map<string, ErrorModel>());
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(false);

    const [adoptASpotAssignmentOptions, setAdoptASpotAssignmentOptions] = useState<string>('[]');
    const [adoptASpotAssignmentValueToIdMap, setAdoptASpotAssignmentValueToIdMap] = useState<Map<string, string>>(new Map<string, string>());
    
    const [cleanupLocationOptions, setCleanupLocationOptions] = useState<string>('[]');
    const [cleanupLocationValueToIdMap, setCleanupLocationValueToIdMap] = useState<Map<string, string>>(new Map<string, string>());

    const [cleanupOrganizationOptions, setCleanupOrganizationOptions] = useState<string>('[]');
    const [cleanupOrganizationValueToIdMap, setCleanupOrganizationValueToIdMap] = useState<Map<string, string>>(new Map<string, string>());
    
    const [selectedAdoptASpot, setSelectedAdoptASpot] = useState<string>('');
    const [selectedCleanupLoc, setSelectedCleanupLoc] = useState<string>('');
    const [selectedCleanupOrg, setSelectedCleanupOrg] = useState<string>('');

    const [alertHeader, setAlertHeader] = useState<string>('');
    const formRef = useRef<HTMLFormElement>(null);
    const MS_DELAY_100: number = 100;

    useEffect(() => {
        if (!isInitialLoad) {
            setIsInitialLoad(true);
            getAssignments();
            getLocations();
            getOrganizations();

            if (formRef.current) {
                formRef.current.addEventListener('keydown', (event: any) => {
                    if (event.target && event.key === 'Enter' && event.target.role === 'comboBox') {
                        event.preventDefault();
                    }
                });
            }
        }

        if (data !== undefined) {
            if (isAdoptASpotEvent(data)) {
                setSelectedAdoptASpot(`${data.spot.location} - ${data.spot.name}`);
                
            } else if (isGroupCleanupEvent(data)) {
                setSelectedCleanupLoc(data.location.description);
                setSelectedCleanupOrg(data.organization.name);
            }
        }
    }, [data]);

    const getAssignments: any = useCallback((onSuccessFn?: () => void) => {
        getAdoptASpotAssignmentOptions().then((assignments: string) => {
            if (!isBlank(assignments) && assignments !== '[]') {
                setAdoptASpotAssignmentOptions(assignments);
                let assignmentValueToIdMap: Map<string, string> = new Map<string, string>();
                JSON.parse(assignments).map((assignment: ComboBoxListItemModel) => {
                    assignmentValueToIdMap.set(assignment.label, assignment.key);
                });
                setAdoptASpotAssignmentValueToIdMap(assignmentValueToIdMap);
                if (onSuccessFn) {
                    onSuccessFn();
                }
            }
        });
    }, []);

    const getLocations: any = useCallback((onSuccessFn?: () => void) => {
        getCleanupLocationOptions().then((locations: string) => {
            if (!isBlank(locations) && locations !== '[]') {
                setCleanupLocationOptions(locations);
                let locationValueToIdMap: Map<string, string> = new Map<string, string>();
                JSON.parse(locations).map((location: ComboBoxListItemModel) => {
                    locationValueToIdMap.set(location.label, location.key);
                });
                setCleanupLocationValueToIdMap(locationValueToIdMap);
                if (onSuccessFn) {
                    onSuccessFn();
                }
            }
        });
    }, []);

    const getOrganizations: any = useCallback((onSuccessFn?: () => void) => {
        getCleanupOrganizationOptions().then((organizations: string) => {
            if (!isBlank(organizations) && organizations !== '[]') {
                setCleanupOrganizationOptions(organizations);
                let organizationValueToIdMap: Map<string, string> = new Map<string, string>();
                JSON.parse(organizations).map((organization: ComboBoxListItemModel) => {
                    organizationValueToIdMap.set(organization.label, organization.key);
                });
                setCleanupOrganizationValueToIdMap(organizationValueToIdMap);
                if (onSuccessFn) {
                    onSuccessFn();
                }
            }
        });
    }, []);

    const handleReportingDataTypeChange: any = useCallback((event: any) => {
        setReportingDataType(event.target.value);
        setSelectedAdoptASpot('');
        setSelectedCleanupLoc('');
        setSelectedCleanupOrg('');
        setErrors(new Map<string, ErrorModel>());
        setAlertHeader('');
    }, []);

    const getFormByActivity = (activity: string) => {
        switch (activity) {
            case(REPORTING_DATA_VALUES.adoptASpot.code):
                return (
                    <div>
                        <AdoptASpotFormFields
                            data={isAdoptASpotEvent(data) ? data : undefined}
                            assignmentOptions={adoptASpotAssignmentOptions}
                            selectedAssignment={selectedAdoptASpot}
                            errors={errors}
                            handleSpotChange={setSelectedAdoptASpot}
                            onAddAssignment={(e: any) => setIsAssignmentDialogOpen(true)}>
                        </AdoptASpotFormFields>
                    </div>
                );
            case (REPORTING_DATA_VALUES.groupCleanup.code):
                return (
                    <div>
                        <GroupCleanupFormFields
                            data={isGroupCleanupEvent(data) ? data : undefined}
                            locationOptions={cleanupLocationOptions}
                            selectedLocation={selectedCleanupLoc}
                            organizationOptions={cleanupOrganizationOptions}
                            selectedOrganization={selectedCleanupOrg}
                            errors={errors}
                            handleLocationChange={setSelectedCleanupLoc}
                            handleOrganizationChange={setSelectedCleanupOrg}
                            onAddLocation={(e: any) => setIsLocationDialogOpen(true)}
                            onAddOrganization={(e: any) => setIsOrganizationDialogOpen(true)}>
                        </GroupCleanupFormFields>
                    </div>
                );
        }
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        switch (reportingDataType) {
            case (REPORTING_DATA_VALUES.adoptASpot.code):
                handleAdoptASpotEventSubmit(new FormData(e.target));
                break;
            case (REPORTING_DATA_VALUES.groupCleanup.code):
                handleGroupCleanupEventSubmit(new FormData(e.target));
                break;
        }
    }

    async function handleAdoptASpotEventSubmit(formData: FormData): Promise<void> {
        const selectedSpotId: string | undefined = adoptASpotAssignmentValueToIdMap.has(selectedAdoptASpot)
            ? adoptASpotAssignmentValueToIdMap.get(selectedAdoptASpot) : '';
        const adoptResult: { isSuccessful: boolean, data: AdoptASpotEventModel | null, errors: Map<string, ErrorModel> } =
            await saveAdoptASpotData(formData, selectedSpotId ? selectedSpotId : '', isUpdate, data?.id);
        setErrors(adoptResult.errors);
        if (adoptResult.isSuccessful && adoptResult.data) {
            onSuccessfulSubmit(adoptResult.data, {
                code: REPORTING_DATA_VALUES.adoptASpot.code,
                label: `${REPORTING_DATA_VALUES.adoptASpot.label} Cleanup`
            });
        } else if (adoptResult.errors !== null && adoptResult.errors.size > 0) {
            scrollToTopAndFocusAnElementById('error-header', MS_DELAY_100);
        } else if (!adoptResult.isSuccessful) {
            setAlertHeader(`Unable to Save ${REPORTING_DATA_VALUES.adoptASpot.label}`);
            scrollToTopAndFocusAnElementById('save-failure-alert-header', MS_DELAY_100);
        }
    }

    async function handleGroupCleanupEventSubmit(formData: FormData): Promise<void> {
        const selectedOrgId: string | undefined = cleanupOrganizationValueToIdMap.has(selectedCleanupOrg)
            ? cleanupOrganizationValueToIdMap.get(selectedCleanupOrg) : '';
        const selectedLocationId: string | undefined = cleanupLocationValueToIdMap.has(selectedCleanupLoc)
            ? cleanupLocationValueToIdMap.get(selectedCleanupLoc) : '';
        const groupResult: { isSuccessful: boolean, data: GroupCleanupEventModel | null, errors: Map<string, ErrorModel> } =
            await saveGroupCleanupData(
                formData,
                selectedOrgId ? selectedOrgId : '',
                selectedLocationId ? selectedLocationId : '',
                isUpdate,
                data?.id
            );
        setErrors(groupResult.errors);
        if (groupResult.isSuccessful && groupResult.data) {
            onSuccessfulSubmit(groupResult.data, {
                code: REPORTING_DATA_VALUES.groupCleanup.code,
                label: REPORTING_DATA_VALUES.groupCleanup.label
            });
        } else if (groupResult.errors !== null && groupResult.errors.size > 0) {
            scrollToTopAndFocusAnElementById('error-header', MS_DELAY_100);
        } else if (!groupResult.isSuccessful) {
            setAlertHeader(`Unable to Save ${REPORTING_DATA_VALUES.groupCleanup.label}`);
            scrollToTopAndFocusAnElementById('save-failure-alert-header', MS_DELAY_100);
        }
    }

    function handleAddAssignment(newAssignment: string) {
        if (!isBlank(newAssignment)) {
            setIsAssignmentDialogOpen(false);
            getAssignments(() => {
                setSelectedAdoptASpot(newAssignment);
            });
        }
    }

    function handleAddLocation(newLocation: string) {
        if (!isBlank(newLocation)) {
            setIsLocationDialogOpen(false);
            getLocations(() => {
                setSelectedCleanupLoc(newLocation);
            });
        }
    }

    function handleAddOrganization(newOrganization: string) {
        if (!isBlank(newOrganization)) {
            setIsOrganizationDialogOpen(false);
            getOrganizations(() => {
                setSelectedCleanupOrg(newOrganization);
            });
        }
    }

    return (
        <div>
            <VolunteerCleanupDialogs
                isAssignmentOpen={isAssignmentDialogOpen}
                onCloseAssignment={(e: any) => setIsAssignmentDialogOpen(false)}
                onAddAssignment={handleAddAssignment}
                currentAssignmentValues={adoptASpotAssignmentValueToIdMap}
                isLocationOpen={isLocationDialogOpen}
                onCloseLocation={(e: any) => setIsLocationDialogOpen(false)}
                onAddLocation={handleAddLocation}
                currentLocationValues={cleanupLocationValueToIdMap}
                isOrganizationOpen={isOrganizationDialogOpen}
                onCloseOrganization={(e: any) => setIsOrganizationDialogOpen(false)}
                onAddOrganization={handleAddOrganization}
                currentOrganizationValues={cleanupOrganizationValueToIdMap}>
            </VolunteerCleanupDialogs>
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
                {isUpdate ? 'Update' : 'Enter'} Data: Volunteer Cleanup Data
            </h1>
            <main>
                <form ref={formRef} className="flex flex-col gap-2" onSubmit={handleSubmit}>
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