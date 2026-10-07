export const REPORTING_DATA_VALUES = {
    roadsideLitter: {
        code: 'roadside',
        label: 'Roadside Litter'
    },
    cleanTeam: {
        code: 'cleanTeam',
        label: 'Clean Team'
    },
    trashRoutes: {
        code: 'routes',
        label: 'Trash Can Routes'
    },
    countyCleanup: {
        code: 'countyCleanup',
        label: 'County Neighborhood Cleanup'
    }
};

const ROADSIDE_LITTER_CODE: string = 'rd-ltr';
export const ROADSIDE_LITTER_FORM_DATA_IDS = {
    date: `${ROADSIDE_LITTER_CODE}-date`,
    litterPounds: `${ROADSIDE_LITTER_CODE}-trash`,
    recyclingPounds: `${ROADSIDE_LITTER_CODE}-recycling`,
    districts: `${ROADSIDE_LITTER_CODE}-districts`,
    locations: `${ROADSIDE_LITTER_CODE}-locations`,
    hasBulkyItems: `${ROADSIDE_LITTER_CODE}-has-bulky-items`,
    bulkyItems: `${ROADSIDE_LITTER_CODE}-bulky-items`
};

const CLEAN_TEAM_CODE: string = 'cln-tm';
export const CLEAN_TEAM_FORM_DATA_IDS = {
    date: `${CLEAN_TEAM_CODE}-date`,
    trashPounds: `${CLEAN_TEAM_CODE}-trash`,
    recyclingPounds: `${CLEAN_TEAM_CODE}-recycling`,
    description: `${CLEAN_TEAM_CODE}-desc`
};

const TRASH_ROUTES_CODE: string = 'tr-rts';
export const TRASH_ROUTES_FORM_DATA_IDS = {
    date: `${TRASH_ROUTES_CODE}-date`,
    trashPounds: `${TRASH_ROUTES_CODE}-trash`,
    recyclingPounds: `${TRASH_ROUTES_CODE}-recycling`
};

const COUNTY_CLEANUP_CODE: string = 'co-cln';
/**
 * County Neighborhood Cleanup
 */
export const COUNTY_CLEANUP_FORM_DATA_IDS = {
    date: `${COUNTY_CLEANUP_CODE}-date`,
    tiresCollected: `${COUNTY_CLEANUP_CODE}-tires`,
    cansChemicalsCollected: `${COUNTY_CLEANUP_CODE}-cans-chemicals`,
    hasBulkyItems: `${COUNTY_CLEANUP_CODE}-has-bulky-items`,
    bulkyItems: `${COUNTY_CLEANUP_CODE}-bulky-items`,
    bulkyItemWeight: `${COUNTY_CLEANUP_CODE}-bulky-item-weight`
};

export const REPORTING_DATA_TYPE_LIST_NAME = 'reporting-data-types';

export const REPORTING_DATA_TYPE_OPTIONS = [
    {key:`${REPORTING_DATA_TYPE_LIST_NAME}-option1`,label:REPORTING_DATA_VALUES.cleanTeam.label,inputId:REPORTING_DATA_VALUES.cleanTeam.code,value:REPORTING_DATA_VALUES.cleanTeam.code},
    {key:`${REPORTING_DATA_TYPE_LIST_NAME}-option2`,label:REPORTING_DATA_VALUES.countyCleanup.label,inputId:REPORTING_DATA_VALUES.countyCleanup.code,value:REPORTING_DATA_VALUES.countyCleanup.code},
    {key:`${REPORTING_DATA_TYPE_LIST_NAME}-option3`,label:REPORTING_DATA_VALUES.roadsideLitter.label,inputId:REPORTING_DATA_VALUES.roadsideLitter.code,value:REPORTING_DATA_VALUES.roadsideLitter.code},
    {key:`${REPORTING_DATA_TYPE_LIST_NAME}-option4`,label:REPORTING_DATA_VALUES.trashRoutes.label,inputId:REPORTING_DATA_VALUES.trashRoutes.code,value:REPORTING_DATA_VALUES.trashRoutes.code},
];

export const HAS_BULKY_ITEMS_OPTIONS = [
    {key:`${ROADSIDE_LITTER_FORM_DATA_IDS.hasBulkyItems}-option1`,label:'No',inputId:`${ROADSIDE_LITTER_FORM_DATA_IDS.hasBulkyItems}-no`,value:'no'},
    {key:`${ROADSIDE_LITTER_FORM_DATA_IDS.hasBulkyItems}-option2`,label:'Yes',inputId:`${ROADSIDE_LITTER_FORM_DATA_IDS.hasBulkyItems}-yes`,value:'yes'}
];