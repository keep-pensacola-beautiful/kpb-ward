export const REPORTING_DATA_VALUES = {
    bagSwap: {
        code: 'bagSwap',
        label: 'Bag Swap'
    },
    education: {
        code: 'education',
        label: 'Education'
    },
    treePlanting: {
        code: 'treePlanting',
        label: 'Tree Planting'
    }
};

export const BAG_SWAP_CODE = 'bg-swp';
export const BAG_SWAP_FORM_DATA_IDS = {
    date: `${BAG_SWAP_CODE}-date`,
    bagsCollected: `${BAG_SWAP_CODE}-bags`,
    description: `${BAG_SWAP_CODE}-desc`,
    hasVolunteers: `${BAG_SWAP_CODE}-has-vol`,
    volunteerCount: `${BAG_SWAP_CODE}-vol-count`,
    volunteerHours: `${BAG_SWAP_CODE}-vol-hours`
};

export const EDUCATION_CODE = 'ed';
export const EDUCATION_FORM_DATA_IDS = {
    date: `${EDUCATION_CODE}-date`,
    recipient: `${EDUCATION_CODE}-recipient`,
    topic: `${EDUCATION_CODE}-topic`,
    duration: `${EDUCATION_CODE}-duration`,
    studentCount: `${EDUCATION_CODE}-stud-count`,
    hasVolunteers: `${EDUCATION_CODE}-has-vol`,
    volunteerCount: `${EDUCATION_CODE}-vol-count`,
    volunteerHours: `${EDUCATION_CODE}-vol-hours`
};

export const TREE_PLANTING_CODE = 'tr-plnt';
export const TREE_PLANTING_FORM_DATA_IDS = {
    date: `${TREE_PLANTING_CODE}-date`,
    treesPlanted: `${TREE_PLANTING_CODE}-trees`,
    description: `${TREE_PLANTING_CODE}-desc`,
    hasVolunteers: `${TREE_PLANTING_CODE}-has-vol`,
    volunteerCount: `${TREE_PLANTING_CODE}-vol-count`,
    volunteerHours: `${TREE_PLANTING_CODE}-vol-hours`
};

export const REPORTING_DATA_TYPE_LIST_NAME = 'reporting-data-types';
export const REPORTING_DATA_TYPE_OPTIONS = [
    {key:`${REPORTING_DATA_TYPE_LIST_NAME}-option1`,label:REPORTING_DATA_VALUES.bagSwap.label,inputId:REPORTING_DATA_VALUES.bagSwap.code,value:REPORTING_DATA_VALUES.bagSwap.code},
    {key:`${REPORTING_DATA_TYPE_LIST_NAME}-option2`,label:REPORTING_DATA_VALUES.education.label,inputId:REPORTING_DATA_VALUES.education.code,value:REPORTING_DATA_VALUES.education.code},
    {key:`${REPORTING_DATA_TYPE_LIST_NAME}-option3`,label:REPORTING_DATA_VALUES.treePlanting.label,inputId:REPORTING_DATA_VALUES.treePlanting.code,value:REPORTING_DATA_VALUES.treePlanting.code}
];

export const HAS_VOLUNTEERS_OPTIONS = [
    {key:`has-volunteers-option1`,label:'No',inputId:`has-volunteers-no`,value:'no'},
    {key:`has-volunteers-option2`,label:'Yes',inputId:`has-volunteers-yes`,value:'yes'}
];