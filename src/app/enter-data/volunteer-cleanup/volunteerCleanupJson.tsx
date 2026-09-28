export const REPORTING_DATA_VALUES = {
    adoptASpot: {
        code: 'adopt-a-spot',
        label: 'Adopt-a-Spot'
    },
    groupCleanup: {
        code: 'group-cleanup',
        label: 'Group Cleanup'
    }
};

const ADOPT_A_SPOT_CODE: string = 'adpt-spt';
export const ADOPT_A_SPOT_FORM_DATA_IDS = {
    date: `${ADOPT_A_SPOT_CODE}-date`,
    spot: `${ADOPT_A_SPOT_CODE}-spot`,
    volunteerCount: `${ADOPT_A_SPOT_CODE}-vol-count`,
    volunteerHours: `${ADOPT_A_SPOT_CODE}-vol-hours`,
    litterCollected: `${ADOPT_A_SPOT_CODE}-litter`,
    recyclingCollected: `${ADOPT_A_SPOT_CODE}-recycling`
};

const GROUP_CLEANUP_CODE: string = 'grp-cln';
export const GROUP_CLEANUP_FORM_DATA_IDS = {
    date: `${GROUP_CLEANUP_CODE}-date`,
    organization: `${GROUP_CLEANUP_CODE}-organization`,
    location: `${GROUP_CLEANUP_CODE}-location`,
    volunteerCount: `${GROUP_CLEANUP_CODE}-vol-count`,
    volunteerHours: `${GROUP_CLEANUP_CODE}-vol-hours`,
    litterCollected: `${GROUP_CLEANUP_CODE}-litter`,
    recyclingCollected: `${GROUP_CLEANUP_CODE}-recycling`
};

export const REPORTING_DATA_TYPE_LIST_NAME = 'reporting-data-types';

export const REPORTING_DATA_TYPE_OPTIONS = [
    {key:`${REPORTING_DATA_TYPE_LIST_NAME}-option1`,label:REPORTING_DATA_VALUES.adoptASpot.label,inputId:REPORTING_DATA_VALUES.adoptASpot.code,value:REPORTING_DATA_VALUES.adoptASpot.code},
    {key:`${REPORTING_DATA_TYPE_LIST_NAME}-option2`,label:REPORTING_DATA_VALUES.groupCleanup.label,inputId:REPORTING_DATA_VALUES.groupCleanup.code,value:REPORTING_DATA_VALUES.groupCleanup.code},
];