'use server'

import { AdoptASpotEventModel, GroupCleanupEventModel } from '../../models/event';
import { ErrorModel, ReferenceDataModel } from '../../models';
import { AdoptASpotGroupModel, GroupModel } from '../../models/group';
import { validateAdoptASpotData, validateAdoptASpotAssignment } from './validation/adoptASpotValidation';
import { validateGroupCleanupData, validateGroupCleanupLocation, validateGroupCleanupOrganization} from './validation/groupCleanupValidation';
import { AdoptASpotGroupDAO } from '../../dao/group';
import { AdoptASpotEventDAO } from '../../dao/event';
import { CleanupLocationReferenceDataDAO } from '../../dao/referenceData/cleanupLocationReferenceData.DAO';
import { CleanupOrganizationGroupDAO } from '../../dao/group/cleanupOrganizationGroup.DAO';
import { GroupCleanupEventDAO } from '../../dao/event/groupCleanupEvent.DAO';
import {
    getAdoptASpotAssignmentComboboxOptions,
    getCleanupLocationComboboxOptions,
    getCleanupOrganizationComboboxOptions
} from '../../lib/comboBoxOptionRetrieval';

export async function getAdoptASpotAssignmentOptions() {
    return await getAdoptASpotAssignmentComboboxOptions();
}

export async function getCleanupLocationOptions() {
    return await getCleanupLocationComboboxOptions();
}

export async function getCleanupOrganizationOptions() {
    return await getCleanupOrganizationComboboxOptions();
}

export async function saveAdoptASpotData(
    formData: FormData, spotId: string, isUpdate: boolean, id?: number
): Promise<{ isSuccessful: boolean, data: AdoptASpotEventModel | null, errors: Map<string, ErrorModel> }> {
    let addedId: number = -1;
    let validation: { data: AdoptASpotEventModel | null, errors: Map<string, ErrorModel> } =
        await validateAdoptASpotData(formData, spotId);
    if ((!validation.errors || validation.errors.size === 0) && validation.data) {
        if (isUpdate && id !== undefined) {
            validation.data.id = id;
        }
        const adoptASpotDAO: AdoptASpotEventDAO = new AdoptASpotEventDAO();
        addedId = await adoptASpotDAO.save(validation.data, isUpdate);
    }
    return { isSuccessful: addedId > 0, ...validation };
}

export async function saveGroupCleanupData(
    formData: FormData, orgId: string, locationId: string, isUpdate: boolean, id?: number
): Promise<{ isSuccessful: boolean, data: GroupCleanupEventModel | null, errors: Map<string, ErrorModel> }> {
    let addedId: number = -1;
    let validation: { data: GroupCleanupEventModel | null, errors: Map<string, ErrorModel> } = 
        await validateGroupCleanupData(formData, orgId, locationId);
    if ((!validation.errors || validation.errors.size === 0) && validation.data) {
        if (isUpdate && id !== undefined) {
            validation.data.id = id;
        }
        const groupCleanupDAO: GroupCleanupEventDAO = new GroupCleanupEventDAO();
        addedId = await groupCleanupDAO.save(validation.data, isUpdate);
    }
    return { isSuccessful: addedId > 0, ...validation };
}

export async function saveAdoptASpotAssignment(
    formData: FormData,
    nameInputId: string,
    nameInputLabel: string,
    spotInputId: string,
    spotInputLabel: string,
    existingAssignments: Map<string, string>
): Promise<{ addedId: number, data: AdoptASpotGroupModel | null, errors: Map<string, ErrorModel> }> {
    let addedId: number = -1;
    let validation: { data: AdoptASpotGroupModel | null, errors: Map<string, ErrorModel> } =
        validateAdoptASpotAssignment(formData, nameInputId, nameInputLabel, spotInputId, spotInputLabel, existingAssignments);
    if ((!validation.errors || validation.errors.size === 0) && validation.data) {
        const adoptASpotDAO: AdoptASpotGroupDAO = new AdoptASpotGroupDAO();
        addedId = await adoptASpotDAO.save(validation.data);
    }
    return { addedId: addedId, ...validation };
}

export async function saveCleanupLocation(
    formData: FormData,
    locationInputId: string,
    locationInputLabel: string,
    existingLocations: Map<string, string>
): Promise<{ addedId: number, data: ReferenceDataModel | null, errors: Map<string, ErrorModel> }> {
    let addedId: number = -1;
    let validation: { data: ReferenceDataModel | null, errors: Map<string, ErrorModel> } =
        validateGroupCleanupLocation(formData, locationInputId, locationInputLabel, existingLocations);
    if ((!validation.errors || validation.errors.size === 0) && validation.data) {
        const locationDAO: CleanupLocationReferenceDataDAO = new CleanupLocationReferenceDataDAO();
        addedId = await locationDAO.save(validation.data);
    }
    return { addedId: addedId, ...validation };
}

export async function saveCleanupOrganization(
    formData: FormData,
    orgInputId: string,
    orgInputLabel: string,
    existingOrganizations: Map<string, string>
): Promise<{ addedId: number, data: GroupModel | null, errors: Map<string, ErrorModel> }> {
    let addedId: number = -1;
    let validation: { data: GroupModel | null, errors: Map<string, ErrorModel> } =
        validateGroupCleanupOrganization(formData, orgInputId, orgInputLabel, existingOrganizations);
    if ((!validation.errors || validation.errors.size === 0) && validation.data) {
        const organizationDAO: CleanupOrganizationGroupDAO = new CleanupOrganizationGroupDAO();
        addedId = await organizationDAO.save(validation.data);
    }
    return { addedId: addedId, ...validation };
}