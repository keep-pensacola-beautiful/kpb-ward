import { useState } from 'react';
import { Textbox } from '../../components';
import { ErrorModel, ReferenceDataModel } from '../../models';
import { AddOptionDialog, StatusDialog } from '../../components';
import { ifErrorThenGetErrorText } from '../../utils/ifErrorThenGetErrorText';
import { saveAdoptASpotAssignment, saveCleanupLocation, saveCleanupOrganization } from './actions';
import { AdoptASpotGroupModel, GroupModel } from '../../models/group';
import { DialogType } from '../../components/dialog/dialogType.model';

export function VolunteerCleanupDialogs(
{ 
    isAssignmentOpen,
    onAddAssignment,
    onCloseAssignment,
    currentAssignmentValues,
    isLocationOpen,
    onAddLocation,
    onCloseLocation,
    currentLocationValues,
    isOrganizationOpen,
    onAddOrganization,
    onCloseOrganization,
    currentOrganizationValues
}: {
    isAssignmentOpen: boolean,
    onAddAssignment?: (newAssignment: string) => void,
    onCloseAssignment: (e: any) => void,
    currentAssignmentValues: Map<string, string>,
    isLocationOpen: boolean,
    onAddLocation?: (newLocation: string) => void,
    onCloseLocation: (e: any) => void,
    currentLocationValues: Map<string, string>,
    isOrganizationOpen: boolean,
    onAddOrganization?: (newOrganization: string) => void,
    onCloseOrganization: (e: any) => void,
    currentOrganizationValues: Map<string, string>
}) {
    const [errors, setErrors] = useState<Map<string, ErrorModel>>(new Map<string, ErrorModel>());
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState<boolean>(false);
    const [statusDialogContent, setStatusDialogContent] = useState<{ id: string, title: string, body: React.ReactNode, type: DialogType }>(
        { id: '', title: '', body: '', type: 'info' });

    function clearAssignmentDialogInputs() {
        const nameInput: HTMLInputElement = document.getElementById('group-name') as HTMLInputElement;
        const spotInput: HTMLInputElement = document.getElementById('spot-location') as HTMLInputElement;
        if (nameInput) {
            nameInput.value = '';
        }
        if (spotInput) {
            spotInput.value = '';
        }
    }

    function clearLocationDialogInputs() {
        const locationInput: HTMLInputElement = document.getElementById('location') as HTMLInputElement;
        if (locationInput) {
            locationInput.value = '';
        }
    }

    function clearOrganizationDialogInputs() {
        const orgNameInput: HTMLInputElement = document.getElementById('org-name') as HTMLInputElement;
        if (orgNameInput) {
            orgNameInput.value = '';
        }
    }

    function onAssignmentDialogClose(e: any) {
        clearAssignmentDialogInputs();
        setErrors(new Map<string, ErrorModel>());
        onCloseAssignment(e);
    }

    function onLocationDialogClose(e: any) {
        clearLocationDialogInputs();
        setErrors(new Map<string, ErrorModel>());
        onCloseLocation(e);
    }

    function onOrganizationDialogClose(e: any) {
        clearOrganizationDialogInputs();
        setErrors(new Map<string, ErrorModel>());
        onCloseOrganization(e);
    }

    async function handleAddAssignment(formData: FormData) {
        const result: { addedId: number, data: AdoptASpotGroupModel | null, errors: Map<string, ErrorModel> } =
            await saveAdoptASpotAssignment(
                formData,
                'group-name',
                'Group/Individual Name',
                'spot-location',
                'Spot Location',
                currentAssignmentValues
            );

        if (result.errors && result.errors.size > 0) {
            if (result.errors.has('group-name')) {
                setTimeout(() => {
                    document.getElementById('group-name')?.focus();
                }, 50);
            } else {
                setTimeout(() => {
                    document.getElementById('spot-location')?.focus();
                }, 50);
            }
        } else {
            if (result.addedId === -1) {
                setStatusDialogContent({
                    id: 'add-assignment-error',
                    title: `Error: Unable to Assign Location to Group`,
                    body: <p>Location <strong>{result.data?.location}</strong> was not assigned to <strong>{result.data?.name}</strong>.
                        If it is outside of normal business hours, the database may be off.
                        Please try again later. Select 'Okay' to return to the Add Recipient dialog window.</p>,
                    type: 'danger'
                });
                setTimeout(() => setIsStatusDialogOpen(true), 100);
                if (onAddAssignment) {
                    onAddAssignment('');
                }
            } else {
                setStatusDialogContent({
                    id: 'add-assignment-success',
                    title: `Successfully Assigned Location to Group`,
                    body: <p>Assignment <strong>{result.data?.location} - {result.data?.name}</strong> is automatically selected.
                        Please select 'Okay' to return to the Group Cleanup entry form.</p>,
                    type: 'success'
                });
                setTimeout(() => {
                    setIsStatusDialogOpen(true);
                    clearAssignmentDialogInputs();
                }, 100);
                if (onAddAssignment) {
                    onAddAssignment(`${result.data?.location} - ${result.data?.name}`);
                }
            }
        }
        
        setErrors(result.errors);
    }

    async function handleAddLocation(formData: FormData) {
        const result: { addedId: number, data: ReferenceDataModel | null, errors: Map<string, ErrorModel> } =
            await saveCleanupLocation(
                formData,
                'location',
                'Location',
                currentLocationValues
            );

        if (result.errors && result.errors.size > 0) {
            setTimeout(() => {
                document.getElementById('location')?.focus();
            }, 50);
        } else {
            if (result.addedId === -1) {
                setStatusDialogContent({
                    id: 'add-location-error',
                    title: `Error: Unable to Add Cleanup Location`,
                    body: <p>Location <strong>{result.data?.description}</strong> was not added.
                        If it is outside of normal business hours, the database may be off.
                        Please try again later. Select 'Okay' to return to the Add a New Cleanup Location dialog window.</p>,
                    type: 'danger'
                });
                setTimeout(() => setIsStatusDialogOpen(true), 100);
                if (onAddLocation) {
                    onAddLocation('');
                }
            } else {
                setStatusDialogContent({
                    id: 'add-location-success',
                    title: `Successfully Added Cleanup Location`,
                    body: <p>Location <strong>{result.data?.description}</strong> is automatically selected.
                        Please select 'Okay' to return to the Group Cleanup entry form.</p>,
                    type: 'success'
                });
                setTimeout(() => {
                    setIsStatusDialogOpen(true);
                    clearLocationDialogInputs();
                }, 100);
                if (onAddLocation) {
                    onAddLocation(result.data?.description ? result.data?.description : '');
                }
            }
        }
        
        setErrors(result.errors);
    }

    async function handleAddOrganization(formData: FormData) {
        const result: { addedId: number, data: GroupModel | null, errors: Map<string, ErrorModel> } =
            await saveCleanupOrganization(
                formData,
                'org-name',
                'Organization Name',
                currentOrganizationValues
            );

        if (result.errors && result.errors.size > 0) {
            setTimeout(() => {
                document.getElementById('org-name')?.focus();
            }, 50);
        } else {
            if (result.addedId === -1) {
                setStatusDialogContent({
                    id: 'add-organization-error',
                    title: `Error: Unable to Add Organization`,
                    body: <p>Organization <strong>{result.data?.name}</strong> was not added.
                        If it is outside of normal business hours, the database may be off.
                        Please try again later. Select 'Okay' to return to the Add a New Organization dialog window.</p>,
                    type: 'danger'
                });
                setTimeout(() => setIsStatusDialogOpen(true), 100);
                if (onAddOrganization) {
                    onAddOrganization('');
                }
            } else {
                setStatusDialogContent({
                    id: 'add-organization-success',
                    title: `Successfully Added Organization`,
                    body: <p>Organization <strong>{result.data?.name}</strong> is automatically selected.
                        Please select 'Okay' to return to the Group Cleanup entry form.</p>,
                    type: 'success'
                });
                setTimeout(() => {
                    setIsStatusDialogOpen(true);
                    clearOrganizationDialogInputs();
                }, 100);
                if (onAddOrganization) {
                    onAddOrganization(result.data?.name ? result.data?.name : '');
                }
            }
        }
        
        setErrors(result.errors);
    }

    return (
        <span>
            <AddOptionDialog
                isOpen={isAssignmentOpen}
                onClose={onAssignmentDialogClose}
                dialogId="add-assignment-dialog"
                dialogTitle="Assign an Unadopted Spot"
                addBtnLabel="Assign"
                cancelBtnLabel="Cancel"
                onAddOption={handleAddAssignment}>
                <Textbox
                    inputId="group-name"
                    inputType="text"
                    labelText="Group/Individual Name"
                    maxlength={50}
                    width="sm:w-80"
                    isRequired={true}
                    errorText={ifErrorThenGetErrorText(errors, 'group-name')}>
                </Textbox>
                <Textbox
                    inputId="spot-location"
                    inputType="text"
                    labelText="Spot Location"
                    maxlength={50}
                    width="sm:w-80"
                    isRequired={true}
                    errorText={ifErrorThenGetErrorText(errors, 'spot-location')}>
                </Textbox>
            </AddOptionDialog>

            <AddOptionDialog
                isOpen={isLocationOpen}
                onClose={onLocationDialogClose}
                dialogId="add-location-dialog"
                dialogTitle="Add a New Cleanup Location"
                addBtnLabel="Add"
                cancelBtnLabel="Cancel"
                onAddOption={handleAddLocation}>
                <Textbox
                    inputId="location"
                    inputType="text"
                    labelText="Location"
                    maxlength={50}
                    width="sm:w-80"
                    isRequired={true}
                    errorText={ifErrorThenGetErrorText(errors, 'location')}>
                </Textbox>
            </AddOptionDialog>

            <AddOptionDialog
                isOpen={isOrganizationOpen}
                onClose={onOrganizationDialogClose}
                dialogId="add-organization-dialog"
                dialogTitle="Add a New Organization"
                addBtnLabel="Add"
                cancelBtnLabel="Cancel"
                onAddOption={handleAddOrganization}>
                <Textbox
                    inputId="org-name"
                    inputType="text"
                    labelText="Organization Name"
                    maxlength={50}
                    width="sm:w-80"
                    isRequired={true}
                    errorText={ifErrorThenGetErrorText(errors, 'org-name')}>
                </Textbox>
            </AddOptionDialog>

            <StatusDialog
                dialogId={statusDialogContent.id}
                isOpen={isStatusDialogOpen}
                onClose={() => setIsStatusDialogOpen(false)}
                title={statusDialogContent.title}
                body={statusDialogContent.body}
                type={statusDialogContent.type}>
            </StatusDialog>
        </span>
    );
}