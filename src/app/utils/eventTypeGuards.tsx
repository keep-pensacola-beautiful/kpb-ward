import {
    AdoptASpotEventModel,
    BagSwapEventModel,
    CleanTeamEventModel,
    CountyCleanupEventModel,
    EducationEventModel,
    GroupCleanupEventModel,
    RoadsideLitterEventModel,
    TrashRoutesEventModel,
    TreePlantingEventModel
} from '../models/event';

export function isAdoptASpotEvent(event: any): event is AdoptASpotEventModel {
    return typeof event === 'object' && event !== null &&
        'spot' in event &&
        'volunteerCount' in event &&
        'volunteerHours' in event &&
        'litterCollected' in event &&
        'recyclingCollected' in event;
}

export function isAdoptASpotEventArray(events: any): events is AdoptASpotEventModel[] {
    return typeof events === 'object' && events !== null && events.length > 0 && events.constructor === [].constructor &&
        'spot' in events[0] &&
        'volunteerCount' in events[0] &&
        'volunteerHours' in events[0] &&
        'litterCollected' in events[0] &&
        'recyclingCollected' in events[0];
}

export function isBagSwapEvent(event: any): event is BagSwapEventModel {
    return typeof event === 'object' && event !== null &&
        'bagsCollected' in event &&
        'eventDescription' in event &&
        'volunteerCount' in event &&
        'volunteerHours' in event;
}

export function isBagSwapEventArray(events: any): events is BagSwapEventModel[] {
    return typeof events === 'object' && events !== null && events.length > 0 && events.constructor === [].constructor &&
        'bagsCollected' in events[0] &&
        'eventDescription' in events[0] &&
        'volunteerCount' in events[0] &&
        'volunteerHours' in events[0];
}

export function isCleanTeamEvent(event: any): event is CleanTeamEventModel {
    return typeof event === 'object' && event !== null &&
        'eventDescription' in event &&
        'trashPounds' in event &&
        'recyclingPounds' in event;
}

export function isCleanTeamEventArray(events: any[]): events is CleanTeamEventModel[] {
    return typeof events === 'object' && events !== null && events.length > 0 && events.constructor === [].constructor &&
        'eventDescription' in events[0] &&
        'trashPounds' in events[0] &&
        'recyclingPounds' in events[0];
}

export function isCountyCleanupEvent(event: any): event is CountyCleanupEventModel {
    return typeof event === 'object' && event !== null &&
        'tireCount' in event &&
        'paintCanAndHouseholdChemicalCount' in event &&
        'otherBulkyItems' in event &&
        'otherBulkyItemPounds' in event;
}

export function isCountyCleanupEventArray(events: any): events is CountyCleanupEventModel[] {
    return typeof events === 'object' && events !== null && events.length > 0 && events.constructor === [].constructor &&
        'tireCount' in events[0] &&
        'paintCanAndHouseholdChemicalCount' in events[0] &&
        'otherBulkyItems' in events[0] &&
        'otherBulkyItemPounds' in events[0] &&
        'bulkyItemCount' in events[0];
}

export function isEducationEvent(event: any): event is EducationEventModel {
    return typeof event === 'object' && event !== null &&
        'recipient' in event &&
        'topic' in event &&
        'duration' in event &&
        'studentCount' in event &&
        'volunteerCount' in event &&
        'volunteerHours' in event;
}

export function isEducationEventArray(events: any): events is EducationEventModel[] {
    return typeof events === 'object' && events !== null && events.length > 0 && events.constructor === [].constructor &&
        'recipient' in events[0] &&
        'topic' in events[0] &&
        'duration' in events[0] &&
        'studentCount' in events[0] &&
        'volunteerCount' in events[0] &&
        'volunteerHours' in events[0];
}

export function isGroupCleanupEvent(event: any): event is GroupCleanupEventModel {
    return typeof event === 'object' && event !== null &&
        'organization' in event &&
        'location' in event &&
        'volunteerCount' in event &&
        'volunteerHours' in event &&
        'litterCollected' in event &&
        'recyclingCollected' in event;
}

export function isGroupCleanupEventArray(events: any): events is GroupCleanupEventModel[] {
    return typeof events === 'object' && events !== null && events.length > 0 && events.constructor === [].constructor &&
        'organization' in events[0] &&
        'location' in events[0] &&
        'volunteerCount' in events[0] &&
        'volunteerHours' in events[0] &&
        'litterCollected' in events[0] &&
        'recyclingCollected' in events[0];
}

export function isRoadsideLitterEvent(event: any): event is RoadsideLitterEventModel {
    return typeof event === 'object' && event !== null &&
        'litterPounds' in event &&
        'recyclingPounds' in event &&
        'locations' in event &&
        'districts' in event &&
        'bulkyItems' in event;
}

export function isRoadsideLitterEventArray(events: any): events is RoadsideLitterEventModel[] {
    return typeof events === 'object' && events !== null && events.length > 0 && events.constructor === [].constructor &&
        'litterPounds' in events[0] &&
        'recyclingPounds' in events[0] &&
        'locations' in events[0] &&
        'districts' in events[0] &&
        'bulkyItems' in events[0];
}

export function isTrashRoutesEvent(event: any): event is TrashRoutesEventModel {
    return typeof event === 'object' && event !== null &&
        'trashPounds' in event &&
        'recyclingPounds' in event;
}

export function isTrashRoutesEventArray(events: any): events is TrashRoutesEventModel[] {
    return typeof events === 'object' && events !== null && events.length > 0 && events.constructor === [].constructor &&
        'trashPounds' in events[0] &&
        'recyclingPounds' in events[0];
}

export function isTreePlantingEvent(event: any): event is TreePlantingEventModel {
    return typeof event === 'object' && event !== null &&
        'treesPlanted' in event &&
        'eventDescription' in event &&
        'volunteerCount' in event &&
        'volunteerHours' in event;
}

export function isTreePlantingEventArray(events: any): events is TreePlantingEventModel[] {
    return typeof events === 'object' && events !== null && events.length > 0 && events.constructor === [].constructor &&
        'treesPlanted' in events[0] &&
        'eventDescription' in events[0] &&
        'volunteerCount' in events[0] &&
        'volunteerHours' in events[0];
}