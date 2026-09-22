import { RadioListOptionModel } from '../components/radioList/radioListOption.model';
import { CategoryCode, ProgramCode } from '../models/search';

export const CATEGORY_CODES: CategoryCode[] = ['services', 'cleanup', 'other'];
export const DATA_CATEGORY_LIST_NAME: string = 'data-categories';
export const DATA_CATEGORY_OPTIONS: RadioListOptionModel[] = [
    {
        key:`${DATA_CATEGORY_LIST_NAME}-option1`,
        label:'Services Data',
        inputId:CATEGORY_CODES[0],
        value:CATEGORY_CODES[0]
    },
    {
        key:`${DATA_CATEGORY_LIST_NAME}-option2`,
        label:'Volunteer Cleanup Data',
        inputId:CATEGORY_CODES[1],
        value:CATEGORY_CODES[1]
    },
    {
        key:`${DATA_CATEGORY_LIST_NAME}-option3`,
        label:'Other Data',
        inputId:CATEGORY_CODES[2],
        value:CATEGORY_CODES[2]
    }
];

export const PROGRAM_CODES: ProgramCode[] = [
    'cleanTeam', 'countyCleanup', 'roadside', 'routes', 'adoptASpot',
    'groupCleanup', 'bagSwap', 'education', 'treePlanting'
];
export const PROGRAM_LIST_NAME: string = 'programs';
export const PROGRAM_OPTIONS: {
    services: RadioListOptionModel[],
    cleanup: RadioListOptionModel[],
    other: RadioListOptionModel[]
} = {
    services: [
        {
            key:`${PROGRAM_LIST_NAME}-option1`,
            label:'Clean Team',
            inputId:`${PROGRAM_LIST_NAME}-option1`,
            value:PROGRAM_CODES[0]
        },
        {
            key:`${PROGRAM_LIST_NAME}-option2`,
            label:'County Neighborhood Cleanup',
            inputId:`${PROGRAM_LIST_NAME}-option2`,
            value:PROGRAM_CODES[1]
        },
        {
            key:`${PROGRAM_LIST_NAME}-option3`,
            label:'Roadside Litter',
            inputId:`${PROGRAM_LIST_NAME}-option3`,
            value:PROGRAM_CODES[2]
        },
        {
            key:`${PROGRAM_LIST_NAME}-option4`,
            label:'Trash Can Routes',
            inputId:`${PROGRAM_LIST_NAME}-option4`,
            value:PROGRAM_CODES[3]
        }
    ],
    cleanup: [
        {
            key:`${PROGRAM_LIST_NAME}-option1`,
            label:'Adopt-a-Spot',
            inputId:`${PROGRAM_LIST_NAME}-option1`,
            value:PROGRAM_CODES[4]
        },
        {
            key:`${PROGRAM_LIST_NAME}-option2`,
            label:'Group Cleanup',
            inputId:`${PROGRAM_LIST_NAME}-option2`,
            value:PROGRAM_CODES[5]
        }
    ],
    other: [
        {
            key:`${PROGRAM_LIST_NAME}-option1`,
            label:'Bag Swap',
            inputId:`${PROGRAM_LIST_NAME}-option1`,
            value:PROGRAM_CODES[6]
        },
        {
            key:`${PROGRAM_LIST_NAME}-option2`,
            label:'Education',
            inputId:`${PROGRAM_LIST_NAME}-option2`,
            value:PROGRAM_CODES[7]
        },
        {
            key:`${PROGRAM_LIST_NAME}-option3`,
            label:'Tree Planting',
            inputId:`${PROGRAM_LIST_NAME}-option3`,
            value:PROGRAM_CODES[8]
        }
    ]
};