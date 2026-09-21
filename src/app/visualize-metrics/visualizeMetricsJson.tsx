import { RadioListOptionModel } from '../components/radioList/radioListOption.model';
import { CategoryCode, IntervalCode, ProgramCode } from '../models/metrics';

export const VIEW_FORMAT_VALUES: { chart:  { code: string, label: string }, table:  { code: string, label: string } } = {
    chart: { code: 'chart', label: 'Chart View' },
    table: { code: 'table', label: 'Table View' }
};
export const VIEW_FORMAT_LIST_NAME: string = 'view-formats';
export const VIEW_FORMAT_OPTIONS: RadioListOptionModel[] = [
    {key:`${VIEW_FORMAT_LIST_NAME}-option1`,label:VIEW_FORMAT_VALUES.chart.label,inputId:VIEW_FORMAT_VALUES.chart.code,value:VIEW_FORMAT_VALUES.chart.code},
    {key:`${VIEW_FORMAT_LIST_NAME}-option2`,label:VIEW_FORMAT_VALUES.table.label,inputId:VIEW_FORMAT_VALUES.table.code,value:VIEW_FORMAT_VALUES.table.code},
];

export const CATEGORY_CODES: CategoryCode[] = ['total', 'services', 'cleanup', 'other'];
// export const DATA_CATEGORY_VALUES: {
//     total: { code: CategoryCode, label: string },
//     services: { code: CategoryCode, label: string },
//     volCleanup: { code: CategoryCode, label: string },
//     other: { code: CategoryCode, label: string }
// } = {
//     total: { code: CATEGORY_CODES[0], label: 'Total Across Categories' },
//     services: { code: CATEGORY_CODES[1], label: 'Services Data' },
//     volCleanup: { code: CATEGORY_CODES[2], label: 'Volunteer Cleanup Data' },
//     other: { code: CATEGORY_CODES[3], label: 'Other Data' }
// };
export const DATA_CATEGORY_LIST_NAME: string = 'data-categories';
export const DATA_CATEGORY_OPTIONS: RadioListOptionModel[] = [
    {
        key:`${DATA_CATEGORY_LIST_NAME}-option1`,
        label:'Total Across Categories',
        inputId:CATEGORY_CODES[0],
        value:CATEGORY_CODES[0]
    },
    {
        key:`${DATA_CATEGORY_LIST_NAME}-option2`,
        label:'Services Data',
        inputId:CATEGORY_CODES[1],
        value:CATEGORY_CODES[1]
    },
    {
        key:`${DATA_CATEGORY_LIST_NAME}-option3`,
        label:'Volunteer Cleanup Data',
        inputId:CATEGORY_CODES[2],
        value:CATEGORY_CODES[2]
    },
    {
        key:`${DATA_CATEGORY_LIST_NAME}-option4`,
        label:'Other Data',
        inputId:CATEGORY_CODES[3],
        value:CATEGORY_CODES[3]
    },
];

export const PROGRAM_CODES: ProgramCode[] = [
    'total', 'cleanTeam', 'countyCleanup', 'roadside', 'routes', 'adoptASpot',
    'groupCleanup', 'bagSwap', 'education', 'treePlanting'
];
// export const PROGRAM_VALUES = {
//     total: { option1: { code: '', label: '' }},
//     services: {
//         option1: { code: 'cleanTeam', label: 'Clean Team' },
//         option2: { code: 'countyCleanup', label: 'County Neighborhood Cleanup' },
//         option3: { code: 'roadside', label: 'Roadside Litter' },
//         option4: { code: 'routes', label: 'Trash Can Routes' }
//     },
//     cleanup: {
//         option1: { code: 'adoptASpot', label: 'Adopt-a-Spot' },
//         option2: { code: 'groupCleanup', label: 'Group Cleanup' }
//     },
//     other: {
//         option1: { code: 'bagSwap', label: 'Bag Swap' },
//         option2: { code: 'education', label: 'Education' },
//         option3: { code: 'treePlanting', label: 'Tree Planting' }
//     }
// }
export const PROGRAM_LIST_NAME: string = 'programs';
export const PROGRAM_OPTIONS: {
    total: RadioListOptionModel[],
    services: RadioListOptionModel[],
    cleanup: RadioListOptionModel[],
    other: RadioListOptionModel[]
} = {
    total: [{ key:'total', label:'', inputId:'', value:PROGRAM_CODES[0] }],
    services: [
        {
            key:`${PROGRAM_LIST_NAME}-option1`,
            label:'Clean Team',
            inputId:`${PROGRAM_LIST_NAME}-option1`,
            value:PROGRAM_CODES[1]
        },
        {
            key:`${PROGRAM_LIST_NAME}-option2`,
            label:'County Neighborhood Cleanup',
            inputId:`${PROGRAM_LIST_NAME}-option2`,
            value:PROGRAM_CODES[2]
        },
        {
            key:`${PROGRAM_LIST_NAME}-option3`,
            label:'Roadside Litter',
            inputId:`${PROGRAM_LIST_NAME}-option3`,
            value:PROGRAM_CODES[3]
        },
        {
            key:`${PROGRAM_LIST_NAME}-option4`,
            label:'Trash Can Routes',
            inputId:`${PROGRAM_LIST_NAME}-option4`,
            value:PROGRAM_CODES[4]
        }
    ],
    cleanup: [
        {
            key:`${PROGRAM_LIST_NAME}-option1`,
            label:'Adopt-a-Spot',
            inputId:`${PROGRAM_LIST_NAME}-option1`,
            value:PROGRAM_CODES[5]
        },
        {
            key:`${PROGRAM_LIST_NAME}-option2`,
            label:'Group Cleanup',
            inputId:`${PROGRAM_LIST_NAME}-option2`,
            value:PROGRAM_CODES[6]
        }
    ],
    other: [
        {
            key:`${PROGRAM_LIST_NAME}-option1`,
            label:'Bag Swap',
            inputId:`${PROGRAM_LIST_NAME}-option1`,
            value:PROGRAM_CODES[7]
        },
        {
            key:`${PROGRAM_LIST_NAME}-option2`,
            label:'Education',
            inputId:`${PROGRAM_LIST_NAME}-option2`,
            value:PROGRAM_CODES[8]
        },
        {
            key:`${PROGRAM_LIST_NAME}-option3`,
            label:'Tree Planting',
            inputId:`${PROGRAM_LIST_NAME}-option3`,
            value:PROGRAM_CODES[9]
        }
    ]
};

export const PROGRAM_CODES_BY_CATEGORY: {
    total: ProgramCode[],
    services: ProgramCode[],
    cleanup: ProgramCode[],
    other: ProgramCode[]
} = {
    total: [ 'total' ],
    services: [ 'cleanTeam', 'countyCleanup', 'roadside', 'routes' ],
    cleanup: [ 'adoptASpot', 'groupCleanup' ],
    other: [ 'bagSwap', 'education', 'treePlanting' ]
};
export const METRIC_LIST_NAME: string = 'metrics';
export const METRIC_OPTIONS: {
    total: RadioListOptionModel[],
    cleanTeam: RadioListOptionModel[],
    countyCleanup: RadioListOptionModel[],
    roadside: RadioListOptionModel[],
    routes: RadioListOptionModel[],
    adoptASpot: RadioListOptionModel[],
    groupCleanup: RadioListOptionModel[],
    bagSwap: RadioListOptionModel[],
    education: RadioListOptionModel[],
    treePlanting: RadioListOptionModel[]
} = {
    total: [
        {
            key:`${METRIC_LIST_NAME}-option1`,
            label:'Trash/Litter Collected (lbs)',
            inputId:`${METRIC_LIST_NAME}-option1`,
            value:'trashLbs'
        },
        {
            key:`${METRIC_LIST_NAME}-option2`,
            label:'Recycling Collected (lbs)',
            inputId:`${METRIC_LIST_NAME}-option2`,
            value:'recyclingLbs'
        },
        {
            key:`${METRIC_LIST_NAME}-option3`,
            label:'Volunteer Hours',
            inputId:`${METRIC_LIST_NAME}-option3`,
            value:'volunteerHours'
        },
        
            {key:`${METRIC_LIST_NAME}-option4`,
            label:'Number of Volunteers',
            inputId:`${METRIC_LIST_NAME}-option4`,
            value:'volunteerCount'
        }
    ],
    cleanTeam: [
        {
            key:`${METRIC_LIST_NAME}-option1`,
            label:'Trash Collected (lbs)',
            inputId:`${METRIC_LIST_NAME}-option1`,
            value:'trashLbs'
        },
        {
            key:`${METRIC_LIST_NAME}-option2`,
            label:'Recycling Collected (lbs)',
            inputId:`${METRIC_LIST_NAME}-option2`,
            value:'recyclingLbs'
        }
    ],
    countyCleanup: [
        {
            key:`${METRIC_LIST_NAME}-option1`,
            label:'Tire Count',
            inputId:`${METRIC_LIST_NAME}-option1`,
            value:'tireCount'
        },
        {
            key:`${METRIC_LIST_NAME}-option2`,
            label:'Paint Can/Household Chemical Count',
            inputId:`${METRIC_LIST_NAME}-option2`,
            value:'paintChemicalCount'
        },
        {
            key:`${METRIC_LIST_NAME}-option3`,
            label:'Bulky Items (lbs)',
            inputId:`${METRIC_LIST_NAME}-option3`,
            value:'bulkyLbs'
        },
        {
            key:`${METRIC_LIST_NAME}-option4`,
            label:'Most Collected Bulky Items',
            inputId:`${METRIC_LIST_NAME}-option4`,
            value:'topBulkyItems'
        }
    ],
    roadside: [
        {
            key:`${METRIC_LIST_NAME}-option1`,
            label:'Litter Collected (lbs)',
            inputId:`${METRIC_LIST_NAME}-option1`,
            value:'litterLbs'
        },
        {
            key:`${METRIC_LIST_NAME}-option2`,
            label:'Recycling Collected (lbs)',
            inputId:`${METRIC_LIST_NAME}-option2`,
            value:'recyclingLbs'
        },
        {
            key:`${METRIC_LIST_NAME}-option3`,
            label:'Number of Bulky Items',
            inputId:`${METRIC_LIST_NAME}-option3`,
            value:'bulkyCount'
        },
        {
            key:`${METRIC_LIST_NAME}-option4`,
            label:'Most Collected Bulky Items',
            inputId:`${METRIC_LIST_NAME}-option4`,
            value:'topBulkyItems'
        },
        {
            key:`${METRIC_LIST_NAME}-option5`,
            label:'Most Cleaned Districts',
            inputId:`${METRIC_LIST_NAME}-option5`,
            value:'topDistricts'
        }
    ],
    routes: [
        {
            key:`${METRIC_LIST_NAME}-option1`,
            label:'Trash Collected (lbs)',
            inputId:`${METRIC_LIST_NAME}-option1`,
            value:'trashLbs'
        },
        {
            key:`${METRIC_LIST_NAME}-option2`,
            label:'Recycling Collected (lbs)',
            inputId:`${METRIC_LIST_NAME}-option2`,
            value:'recyclingLbs'
        }
    ],
    adoptASpot: [
        {
            key:`${METRIC_LIST_NAME}-option1`,
            label:'Number of Volunteers',
            inputId:`${METRIC_LIST_NAME}-option1`,
            value:'volunteerCount'
        },
        {
            key:`${METRIC_LIST_NAME}-option2`,
            label:'Volunteer Hours',
            inputId:`${METRIC_LIST_NAME}-option2`,
            value:'volunteerHours'
        },
        {
            key:`${METRIC_LIST_NAME}-option3`,
            label:'Litter Collected (lbs)',
            inputId:`${METRIC_LIST_NAME}-option3`,
            value:'litterLbs'
        },
        {
            key:`${METRIC_LIST_NAME}-option4`,
            label:'Recycling Collected (lbs)',
            inputId:`${METRIC_LIST_NAME}-option4`,
            value:'recyclingLbs'
        },
        {
            key:`${METRIC_LIST_NAME}-option5`,
            label:'Number of Cleanups',
            inputId:`${METRIC_LIST_NAME}-option5`,
            value:'cleanupCount'
        },
        {
            key:`${METRIC_LIST_NAME}-option6`,
            label:'Most Active Groups',
            inputId:`${METRIC_LIST_NAME}-option6`,
            value:'topGroups'
        }
    ],
    groupCleanup: [
        {
            key:`${METRIC_LIST_NAME}-option1`,
            label:'Number of Volunteers',
            inputId:`${METRIC_LIST_NAME}-option1`,
            value:'volunteerCount'
        },
        {
            key:`${METRIC_LIST_NAME}-option2`,
            label:'Volunteer Hours',
            inputId:`${METRIC_LIST_NAME}-option2`,
            value:'volunteerHours'
        },
        {
            key:`${METRIC_LIST_NAME}-option3`,
            label:'Litter Collected (lbs)',
            inputId:`${METRIC_LIST_NAME}-option3`,
            value:'litterLbs'
        },
        {
            key:`${METRIC_LIST_NAME}-option4`,
            label:'Recycling Collected (lbs)',
            inputId:`${METRIC_LIST_NAME}-option4`,
            value:'recyclingLbs'
        },
        {
            key:`${METRIC_LIST_NAME}-option5`,
            label:'Number of Cleanups',
            inputId:`${METRIC_LIST_NAME}-option5`,
            value:'cleanupCount'
        },
        {
            key:`${METRIC_LIST_NAME}-option6`,
            label:'Most Popular Locations',
            inputId:`${METRIC_LIST_NAME}-option6`,
            value:'topLocations'
        },
        {
            key:`${METRIC_LIST_NAME}-option7`,
            label:'Most Active Organizations',
            inputId:`${METRIC_LIST_NAME}-option7`,
            value:'topOrganizations'
        }
    ],
    bagSwap: [
        {
            key:`${METRIC_LIST_NAME}-option1`,
            label:'Bags Collected',
            inputId:`${METRIC_LIST_NAME}-option1`,
            value:'bagCount'
        },
        {
            key:`${METRIC_LIST_NAME}-option2`,
            label:'Number of Volunteers',
            inputId:`${METRIC_LIST_NAME}-option2`,
            value:'volunteerCount'
        },
        {
            key:`${METRIC_LIST_NAME}-option3`,
            label:'Volunteer Hours',
            inputId:`${METRIC_LIST_NAME}-option3`,
            value:'volunteerHours'
        }
    ],
    education: [
        {
            key:`${METRIC_LIST_NAME}-option1`,
            label:'Students Educated',
            inputId:`${METRIC_LIST_NAME}-option1`,
            value:'studentCount'
        },
        {
            key:`${METRIC_LIST_NAME}-option2`,
            label:'Number of Volunteers',
            inputId:`${METRIC_LIST_NAME}-option2`,
            value:'volunteerCount'
        },
        {
            key:`${METRIC_LIST_NAME}-option3`,
            label:'Volunteer Hours',
            inputId:`${METRIC_LIST_NAME}-option3`,
            value:'volunteerHours'
        },
        {
            key:`${METRIC_LIST_NAME}-option4`,
            label:'Top Recipients',
            inputId:`${METRIC_LIST_NAME}-option4`,
            value:'topRecipients'
        },
        {
            key:`${METRIC_LIST_NAME}-option5`,
            label:'Most Popular Topics',
            inputId:`${METRIC_LIST_NAME}-option5`,
            value:'topTopics'
        }
    ],
    treePlanting: [
        {
            key:`${METRIC_LIST_NAME}-option1`,
            label:'Trees Planted',
            inputId:`${METRIC_LIST_NAME}-option1`,
            value:'treeCount'
        },
        {
            key:`${METRIC_LIST_NAME}-option2`,
            label:'Number of Volunteers',
            inputId:`${METRIC_LIST_NAME}-option2`,
            value:'volunteerCount'
        },
        {
            key:`${METRIC_LIST_NAME}-option3`,
            label:'Volunteer Hours',
            inputId:`${METRIC_LIST_NAME}-option3`,
            value:'volunteerHours'
        }
    ]
};

export const INTERVAL_VALUES: {
    month: { code: IntervalCode, label: string },
    quarter: { code: IntervalCode, label: string },
    year: { code: IntervalCode, label: string }
} = {
    month: { code: 'month', label: 'Month' },
    quarter: { code: 'quarter', label: 'Quarter' },
    year: { code: 'year', label: 'Year' }
};
export const INTERVAL_LIST_NAME: string = 'intervals';
export const INTERVAL_OPTIONS: RadioListOptionModel[] = [
    {key:`${INTERVAL_LIST_NAME}-option1`,label:INTERVAL_VALUES.month.label,inputId:INTERVAL_VALUES.month.code,value:INTERVAL_VALUES.month.code},
    {key:`${INTERVAL_LIST_NAME}-option2`,label:INTERVAL_VALUES.quarter.label,inputId:INTERVAL_VALUES.quarter.code,value:INTERVAL_VALUES.quarter.code},
    {key:`${INTERVAL_LIST_NAME}-option3`,label:INTERVAL_VALUES.year.label,inputId:INTERVAL_VALUES.year.code,value:INTERVAL_VALUES.year.code},
];