'use client'

import { useCallback, useEffect, useState, useRef } from 'react';
import { ErrorModel } from '../../models';
import { AdoptASpotEventModel, EventModel, GroupCleanupEventModel } from '../../models/event';
import { Alert, ErrorSummary, RadioList } from '../../components';
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

export function VolunteerCleanupForm({
    isUpdate, selectedDataType, onSuccessfulSubmit
}: {
    isUpdate: boolean,
    selectedDataType: string,
    onSuccessfulSubmit: (event: EventModel, reportingDataType: { code: string, label: string }) => void
}) {
    const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState<boolean>(false);
    const [isLocationDialogOpen, setIsLocationDialogOpen] = useState<boolean>(false);
    const [isOrganizationDialogOpen, setIsOrganizationDialogOpen] = useState<boolean>(false);
    const [reportingDataType, setReportingDataType] = useState<string>(selectedDataType);
    const [errors, setErrors] = useState<Map<string, ErrorModel>>(new Map<string, ErrorModel>());
    const [hasReferenceDataBeenRequested, setHasReferenceDataBeenRequested] = useState<boolean>(false);

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
        if (!hasReferenceDataBeenRequested) {
            setHasReferenceDataBeenRequested(true);
            getAssignments();
            getLocations();
            getOrganizations();
        }

        if (formRef.current) {
            formRef.current.addEventListener('keydown', (event: any) => {
                if (event.target && event.key === 'Enter' && event.target.role === 'comboBox') {
                    event.preventDefault();
                }
            });
        }
    }, [hasReferenceDataBeenRequested]);

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
                            assignmentOptions={adoptASpotAssignmentOptions}
                            selectedAssignment={selectedAdoptASpot}
                            errors={errors}
                            handleSpotChange={setSelectedAdoptASpot}
                            onAddAssignment={(e: any) => setIsAssignmentDialogOpen(true)}>
                        </AdoptASpotFormFields>
                    </div>
                );
            case(REPORTING_DATA_VALUES.groupCleanup.code):
                return (
                    <div>
                        <GroupCleanupFormFields
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
            await saveAdoptASpotData(formData, selectedSpotId ? selectedSpotId : '', isUpdate);
        setErrors(adoptResult.errors);
        if (adoptResult.isSuccessful && adoptResult.data) {
            onSuccessfulSubmit(adoptResult.data, REPORTING_DATA_VALUES.adoptASpot);
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
                isUpdate
            );
        setErrors(groupResult.errors);
        if (groupResult.isSuccessful && groupResult.data) {
            onSuccessfulSubmit(groupResult.data, REPORTING_DATA_VALUES.groupCleanup);
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
                    type="error"
                    header={alertHeader}
                    body="If it is outside of normal business hours, the database may be off.
                        Please copy the values you entered and try again later."
                    onClose={() => setAlertHeader('')}>
                </Alert>
            }

            {(errors && errors.size >= 1) &&
                <ErrorSummary errors={JSON.stringify(Array.from(errors.values()))}></ErrorSummary>}
            <h1 id="main-content-header" className="text-xl md:text-2xl" tabIndex={-1}>
                {isUpdate ? 'Update' : 'Enter'} Data: Volunteer Cleanup Data
            </h1>
            <main>
                <form ref={formRef} className="flex flex-col gap-2" onSubmit={handleSubmit}>
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
                </form>
            </main>
            
        </div>
    );
}