'use server'

import { ComboBoxListItemModel } from '../components/comboBox/comboBoxListItem.model';
import {
    AdoptASpotGroupDAO,
    CleanupOrganizationGroupDAO,
    EducationRecipientGroupDAO
} from '../dao/group';
import { CleanupLocationReferenceDataDAO, EducationTopicReferenceDataDAO } from '../dao/referenceData';
import { AdoptASpotGroupEntity } from '../entities/group/adoptASpotGroup.entity';
import { GroupEntity } from '../entities/group/group.entity';
import { ReferenceDataEntity } from '../entities/referenceData/referenceData.entity';

export async function getAdoptASpotAssignmentComboboxOptions() {
    let newAdoptASpotAssignmentOptions: ComboBoxListItemModel[] = [];
    const adoptASpotDAO: AdoptASpotGroupDAO = new AdoptASpotGroupDAO();
    try {
        const spots: AdoptASpotGroupEntity[] = await adoptASpotDAO.getAll();
        if (spots && spots.length >= 1) {
            for (let i = 0; i < spots.length; i++) {
                newAdoptASpotAssignmentOptions.push({
                    key: `${spots[i]?.id}`,
                    listItemId: `adopted-spot-${i + 1}`,
                    label: `${spots[i]?.location} - ${spots[i]?.name}`,
                    isSelected: false
                });
            }
            return JSON.stringify(newAdoptASpotAssignmentOptions);
        }
        return '[]';
    } catch (error) {
        console.error(`Error getting adopt-a-spot assignment options for combobox.`);
        return '[]';
    }
}

export async function getCleanupLocationComboboxOptions() {
    let newCleanupLocationOptions: ComboBoxListItemModel[] = [];
    const cleanupLocationRefDataDAO: CleanupLocationReferenceDataDAO = new CleanupLocationReferenceDataDAO();
    try {
        const locations: ReferenceDataEntity[] = await cleanupLocationRefDataDAO.getAll();
        if (locations && locations.length >= 1) {
            for (let i = 0; i < locations.length; i++) {
                newCleanupLocationOptions.push({
                    key: `${locations[i]?.code}`,
                    listItemId: `location-${i + 1}`,
                    label: `${locations[i]?.description}`,
                    isSelected: false
                });
            }
            return JSON.stringify(newCleanupLocationOptions);
        }
        return '[]';
    } catch (error) {
        console.error(`Error getting group cleanup location options for combobox.`);
        return '[]';
    }
}

export async function getCleanupOrganizationComboboxOptions() {
    let newCleanupOrganizationOptions: ComboBoxListItemModel[] = [];
    const cleanupOrganizationDAO: CleanupOrganizationGroupDAO = new CleanupOrganizationGroupDAO();
    try {
        const organizations: GroupEntity[] = await cleanupOrganizationDAO.getAll();
        if (organizations && organizations.length >= 1) {
            for (let i = 0; i < organizations.length; i++) {
                newCleanupOrganizationOptions.push({
                    key: `${organizations[i]?.id}`,
                    listItemId: `organization-${i + 1}`,
                    label: `${organizations[i]?.name}`,
                    isSelected: false
                });
            }
            return JSON.stringify(newCleanupOrganizationOptions);
        }
        return '[]';
    } catch (error) {
        console.error(`Error getting group cleanup organization options for combobox.`);
        return '[]';
    }
}

export async function getEducationRecipientComboboxOptions(): Promise<string> {
    let recipientOptions: ComboBoxListItemModel[] = [];
    const recipientDAO: EducationRecipientGroupDAO = new EducationRecipientGroupDAO();
    try {
        const recipients: GroupEntity[] = await recipientDAO.getAll();
        if (recipients && recipients.length >= 1) {
            for (let i = 0; i < recipients.length; i++) {
                recipientOptions.push({
                    key: `${recipients[i]?.id}`,
                    listItemId: `recipient-${i + 1}`,
                    label: recipients[i]?.name,
                    isSelected: false
                });
            }
            return JSON.stringify(recipientOptions);
        }
        return '[]';
    } catch (error) {
        console.error(`Error getting education recipient options.`);
        return '[]';
    }
}

export async function getEducationTopicComboboxOptions(): Promise<string> {
    let topicOptions: ComboBoxListItemModel[] = [];
    const topicDAO: EducationTopicReferenceDataDAO = new EducationTopicReferenceDataDAO();
    try {
        const topics: ReferenceDataEntity[] = await topicDAO.getAll();
        if (topics && topics.length >= 1) {
            for (let i = 0; i < topics.length; i++) {
                topicOptions.push({
                    key: `${topics[i]?.code}`,
                    listItemId: `recipient-${i + 1}`,
                    label: topics[i]?.description,
                    isSelected: false
                });
            }
            return JSON.stringify(topicOptions);
        }
        return '[]';
    } catch (error) {
        console.error(`Error getting education topic options.`);
        return '[]';
    }
}