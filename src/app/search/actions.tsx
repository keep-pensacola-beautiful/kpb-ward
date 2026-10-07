'use server'

import {
    AdoptASpotEventDAO,
    BagSwapEventDAO,
    CleanTeamEventDAO,
    CountyCleanupEventDAO,
    EducationEventDAO,
    RoadsideLitterEventDAO,
    TrashRoutesEventDAO,
    TreePlantingEventDAO
} from '../dao/event';
import { DistrictReferenceDataDAO } from '../dao/referenceData';
import { ReferenceDataModel } from '../models';
import { EventModel } from '../models/event';
import { ProgramCode } from '../models/search';
import { PROGRAM_CODES } from './searchJson';
import {
    getAdoptASpotAssignmentComboboxOptions,
    getCleanupLocationComboboxOptions,
    getCleanupOrganizationComboboxOptions
} from '../lib/comboBoxOptionRetrieval';
import { GroupCleanupEventDAO } from '../dao/event/groupCleanupEvent.DAO';

export async function getAdoptASpotAssignmentOptions() {
    return await getAdoptASpotAssignmentComboboxOptions();
}

export async function getCleanupLocationOptions() {
    return await getCleanupLocationComboboxOptions();
}

export async function getCleanupOrganizationOptions() {
    return await getCleanupOrganizationComboboxOptions();
}

export async function getDistrictRefData(): Promise<string> {
    let newDistrictOptions: { label: string, value: string }[] = [];
    const districtRefDAO: DistrictReferenceDataDAO = new DistrictReferenceDataDAO();
    try {
        const districts: ReferenceDataModel[] = await districtRefDAO.getAll();
        if (districts && districts.length >= 1) {
            for (let i = 0; i < districts.length; i++) {
                newDistrictOptions.push({
                    label: districts[i]?.description,
                    value: `${districts[i]?.code}`
                });
            }
            return JSON.stringify(newDistrictOptions);
        }
        return '[]';
    } catch (error) {
        console.error(`Error getting district reference values.`);
        return '[]';
    };
}

export async function deleteEventById(
    pgrmCode: ProgramCode, eventId: number
): Promise<boolean> {
    switch (pgrmCode) {
        case PROGRAM_CODES[0]:
            return await new CleanTeamEventDAO().deleteById(eventId) > 0;
        case PROGRAM_CODES[1]:
            return await new CountyCleanupEventDAO().deleteById(eventId) > 0;
        case PROGRAM_CODES[2]:
            return await new RoadsideLitterEventDAO().deleteById(eventId) > 0;
        case PROGRAM_CODES[3]:
            return await new TrashRoutesEventDAO().deleteById(eventId) > 0;
        case PROGRAM_CODES[4]:
            return await new AdoptASpotEventDAO().deleteById(eventId) > 0;
        case PROGRAM_CODES[5]:
            return await new GroupCleanupEventDAO().deleteById(eventId) > 0;
        case PROGRAM_CODES[6]:
            return await new BagSwapEventDAO().deleteById(eventId) > 0;
        case PROGRAM_CODES[7]:
            return await new EducationEventDAO().deleteById(eventId) > 0;
        case PROGRAM_CODES[8]:
            return await new TreePlantingEventDAO().deleteById(eventId) > 0;
        default:
            return false;
    }
}

export async function getEventByProgramAndById(
    pgrmCode: ProgramCode, eventId: number
): Promise<EventModel | null> {
    switch (pgrmCode) {
        case PROGRAM_CODES[0]:
            return await new CleanTeamEventDAO().getById(eventId);
        case PROGRAM_CODES[1]:
            return await new CountyCleanupEventDAO().getById(eventId);
        case PROGRAM_CODES[2]:
            return await new RoadsideLitterEventDAO().getById(eventId);
        case PROGRAM_CODES[3]:
            return await new TrashRoutesEventDAO().getById(eventId);
        case PROGRAM_CODES[4]:
            return await new AdoptASpotEventDAO().getById(eventId);
        case PROGRAM_CODES[5]:
            return await new GroupCleanupEventDAO().getById(eventId);
        case PROGRAM_CODES[6]:
            return await new BagSwapEventDAO().getById(eventId);
        case PROGRAM_CODES[7]:
            return await new EducationEventDAO().getById(eventId);
        case PROGRAM_CODES[8]:
            return await new TreePlantingEventDAO().getById(eventId);
        default:
            return null;
    }
}

export async function searchEventsByProgramAndByCriteria(pgrmCode: ProgramCode, searchCriteria: Map<string, string>) {
    switch (pgrmCode) {
        case PROGRAM_CODES[0]:
            return await new CleanTeamEventDAO().search(searchCriteria);
        case PROGRAM_CODES[1]:
            return await new CountyCleanupEventDAO().search(searchCriteria);
        case PROGRAM_CODES[2]:
            return await new RoadsideLitterEventDAO().search(searchCriteria);
        case PROGRAM_CODES[3]:
            return await new TrashRoutesEventDAO().search(searchCriteria);
        case PROGRAM_CODES[4]:
            return await new AdoptASpotEventDAO().search(searchCriteria);
        case PROGRAM_CODES[5]:
            return await new GroupCleanupEventDAO().search(searchCriteria);
        case PROGRAM_CODES[6]:
            return await new BagSwapEventDAO().search(searchCriteria);
        case PROGRAM_CODES[7]:
            return await new EducationEventDAO().search(searchCriteria);
        case PROGRAM_CODES[8]:
            return await new TreePlantingEventDAO().search(searchCriteria);
        default:
            return [];
    }
}