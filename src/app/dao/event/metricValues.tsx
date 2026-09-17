interface MetricValuesModel {
    tables: string[];
    valueCol: string;
    metricTitle: string;
    dataLabel: string;
    chartType: 'bar' | 'pie';
    extraCols?: string[];
    procedures?: string[];
}

const ADOPT_A_SPOT_CLEANUPS_TABLE: string = 'adopt_a_spot_cleanups';
const ADOPT_A_SPOT_ASSIGNMENTS_TABLE: string = 'adopt_a_spot_assignments';
export const ADOPT_A_SPOT_METRIC_VALUES: {
    volunteerCount: MetricValuesModel, volunteerHours: MetricValuesModel, litterLbs: MetricValuesModel,
    recyclingLbs: MetricValuesModel, cleanupCount: MetricValuesModel, topGroups: MetricValuesModel
} = {
    volunteerCount: {
        tables: [ADOPT_A_SPOT_CLEANUPS_TABLE],
        valueCol: 'volunteer_count',
        metricTitle: 'Adopt-a-Spot Number of Volunteers',
        dataLabel: 'number of volunteers',
        chartType: 'bar'
    },
    volunteerHours: {
        tables: [ADOPT_A_SPOT_CLEANUPS_TABLE],
        valueCol: 'volunteer_hours',
        metricTitle: 'Adopt-a-Spot Number of Volunteer Hours',
        dataLabel: 'number of volunteer hours',
        chartType: 'bar'
    },
    litterLbs: {
        tables: [ADOPT_A_SPOT_CLEANUPS_TABLE],
        valueCol: 'litter_lbs',
        metricTitle: 'Adopt-a-Spot Pounds of Litter Collected',
        dataLabel: 'pounds of litter',
        chartType: 'bar'
    },
    recyclingLbs: {
        tables: [ADOPT_A_SPOT_CLEANUPS_TABLE],
        valueCol: 'recycling_lbs',
        metricTitle: 'Adopt-a-Spot Pounds of Recycling Collected',
        dataLabel: 'pounds of recycling',
        chartType: 'bar'
    },
    cleanupCount: {
        tables: [ADOPT_A_SPOT_CLEANUPS_TABLE],
        valueCol: 'id',
        metricTitle: 'Adopt-a-Spot Number of Cleanups',
        dataLabel: 'number of cleanups',
        chartType: 'bar'
    },
    topGroups: {
        tables: [ADOPT_A_SPOT_CLEANUPS_TABLE, ADOPT_A_SPOT_ASSIGNMENTS_TABLE],
        valueCol: '',
        metricTitle: 'Adopt-a-Spot Most Active Groups',
        dataLabel: 'most active groups',
        chartType: 'pie',
        extraCols: ['assignment_id','group_name']
    }
};

const BAG_SWAP_EVENTS_TABLE: string = 'bag_swap_events';
export const BAG_SWAP_METRIC_VALUES: {
    bagCount: MetricValuesModel, volunteerCount: MetricValuesModel, volunteerHours: MetricValuesModel
} = {
    bagCount: {
        tables: [BAG_SWAP_EVENTS_TABLE],
        valueCol: 'bag_count',
        metricTitle: 'Bag Swap Event Number of Bags Collected',
        dataLabel: 'number of bags collected',
        chartType: 'bar'
    },
    volunteerCount: {
        tables: [BAG_SWAP_EVENTS_TABLE],
        valueCol: 'volunteer_count',
        metricTitle: 'Bag Swap Event Number of Volunteers',
        dataLabel: 'number of volunteers',
        chartType: 'bar'
    },
    volunteerHours: {
        tables: [BAG_SWAP_EVENTS_TABLE],
        valueCol: 'volunteer_hours',
        metricTitle: 'Bag Swap Event Number of Volunteer Hours',
        dataLabel: 'number of volunteer hours',
        chartType: 'bar'
    }
};

const CLEAN_TEAM_EVENTS_TABLE: string = 'clean_team_events';
export const CLEAN_TEAM_METRIC_VALUES: {
    trashLbs: MetricValuesModel, recyclingLbs: MetricValuesModel
} = {
    trashLbs: {
        tables: [CLEAN_TEAM_EVENTS_TABLE],
        valueCol: 'trash_lbs',
        metricTitle: 'Clean Team Pounds of Trash Collected',
        dataLabel: 'pounds of trash collected',
        chartType: 'bar'
    },
    recyclingLbs: {
        tables: [CLEAN_TEAM_EVENTS_TABLE],
        valueCol: 'recycling_lbs',
        metricTitle: 'Clean Team Pounds of Recycling Collected',
        dataLabel: 'pounds of recycling collected',
        chartType: 'bar'
    }
};

const COUNTY_CLEANUPS_TABLE: string = 'county_cleanups';
const COUNTY_CLEANUPS_BULKY_ITEMS_TABLE: string = 'county_cleanups_bulky_items';
const CC_BULKY_ITEMS_REFERENCE_TABLE: string = 'bulky_items_reference';
export const COUNTY_CLEANUP_METRIC_VALUES: {
    tireCount: MetricValuesModel, paintChemicalCount: MetricValuesModel,
    bulkyLbs: MetricValuesModel, topBulkyItems: MetricValuesModel
} = {
    tireCount: {
        tables: [COUNTY_CLEANUPS_TABLE],
        valueCol: 'tire_count',
        metricTitle: 'County Neighborhood Cleanup Tires Collected',
        dataLabel: 'number of tires collected',
        chartType: 'bar'
    },
    paintChemicalCount: {
        tables: [COUNTY_CLEANUPS_TABLE],
        valueCol: 'paint_can_and_household_chemical_count',
        metricTitle: 'County Neighborhood Cleanup Paint Cans & Household Chemicals Collected',
        dataLabel: 'number of paint cans and household chemicals collected',
        chartType: 'bar'
    },
    bulkyLbs: {
        tables: [COUNTY_CLEANUPS_TABLE],
        valueCol: 'bulky_items_lbs',
        metricTitle: 'County Neighborhood Cleanup Pounds of Bulky Items Collected',
        dataLabel: 'pounds of bulky items collected',
        chartType: 'bar'
    },
    topBulkyItems: {
        tables: [COUNTY_CLEANUPS_TABLE, COUNTY_CLEANUPS_BULKY_ITEMS_TABLE, CC_BULKY_ITEMS_REFERENCE_TABLE],
        valueCol: '',
        metricTitle: 'County Neighborhood Cleanup Most Collected Bulky Items',
        dataLabel: 'most collected bulky items',
        chartType: 'pie',
        extraCols: ['county_cleanup_id','bulky_item_ref_id','id']
    }
};

const EDUCATION_EVENTS_TABLE: string = 'education_events';
const EDUCATION_RECIPIENTS_TABLE: string = 'education_recipients';
const EDUCATION_TOPICS: string = 'education_topics';
export const EDUCATION_METRIC_VALUES: {
    studentCount: MetricValuesModel, volunteerCount: MetricValuesModel, volunteerHours: MetricValuesModel,
    topRecipients: MetricValuesModel, topTopics: MetricValuesModel
} = {
    studentCount: {
        tables: [EDUCATION_EVENTS_TABLE],
        valueCol: 'student_count',
        metricTitle: 'Education Event Number of Students Educated',
        dataLabel: 'number of students educated',
        chartType: 'bar'
    },
    volunteerCount: {
        tables: [EDUCATION_EVENTS_TABLE],
        valueCol: 'volunteer_count',
        metricTitle: 'Education Event Number of Volunteers',
        dataLabel: 'number of volunteers',
        chartType: 'bar'
    },
    volunteerHours: {
        tables: [EDUCATION_EVENTS_TABLE],
        valueCol: 'volunteer_hours',
        metricTitle: 'Education Event Number of Volunteer Hours',
        dataLabel: 'number of volunteer hours',
        chartType: 'bar'
    },
    topRecipients: {
        tables: [EDUCATION_EVENTS_TABLE, EDUCATION_RECIPIENTS_TABLE],
        valueCol: '',
        metricTitle: 'Education Event Most Frequent Recipients',
        dataLabel: 'most frequent recipients',
        chartType: 'pie',
        extraCols: ['recipient_id','name']
    },
    topTopics: {
        tables: [EDUCATION_EVENTS_TABLE, EDUCATION_TOPICS],
        valueCol: '',
        metricTitle: 'Education Event Most Popular Topics',
        dataLabel: 'most popular topics',
        chartType: 'pie',
        extraCols: ['topic_id','topic']
    }
};

const GROUP_CLEANUPS_TABLE: string = 'group_cleanups';
const ORGANIZATIONS_TABLE: string = 'organizations';
const CLEANUP_LOCATIONS_TABLE: string = 'cleanup_locations';
export const GROUP_CLEANUP_METRIC_VALUES: {
    volunteerCount: MetricValuesModel, volunteerHours: MetricValuesModel, litterLbs: MetricValuesModel,
    recyclingLbs: MetricValuesModel, cleanupCount: MetricValuesModel, topOrganizations: MetricValuesModel,
    topLocations: MetricValuesModel
} = {
    volunteerCount: {
        tables: [GROUP_CLEANUPS_TABLE],
        valueCol: 'volunteer_count',
        metricTitle: 'Group Cleanup Number of Volunteers',
        dataLabel: 'number of volunteers',
        chartType: 'bar'
    },
    volunteerHours: {
        tables: [GROUP_CLEANUPS_TABLE],
        valueCol: 'volunteer_hours',
        metricTitle: 'Group Cleanup Number of Volunteer Hours',
        dataLabel: 'number of volunteer hours',
        chartType: 'bar'
    },
    litterLbs: {
        tables: [GROUP_CLEANUPS_TABLE],
        valueCol: 'litter_lbs',
        metricTitle: 'Group Cleanup Pounds of Litter Collected',
        dataLabel: 'pounds of litter',
        chartType: 'bar'
    },
    recyclingLbs: {
        tables: [GROUP_CLEANUPS_TABLE],
        valueCol: 'recycling_lbs',
        metricTitle: 'Group Cleanup Pounds of Recycling Collected',
        dataLabel: 'pounds of recycling',
        chartType: 'bar'
    },
    cleanupCount: {
        tables: [GROUP_CLEANUPS_TABLE],
        valueCol: 'id',
        metricTitle: 'Group Cleanup Number of Cleanups',
        dataLabel: 'number of cleanups',
        chartType: 'bar'
    },
    topOrganizations: {
        tables: [GROUP_CLEANUPS_TABLE, ORGANIZATIONS_TABLE],
        valueCol: '',
        metricTitle: 'Group Cleanup Most Active Organizations',
        dataLabel: 'most active organizations',
        chartType: 'pie',
        extraCols: ['organization_id','name']
    },
    topLocations: {
        tables: [GROUP_CLEANUPS_TABLE, CLEANUP_LOCATIONS_TABLE],
        valueCol: '',
        metricTitle: 'Group Cleanup Most Cleaned Locations',
        dataLabel: 'most cleaned locations',
        chartType: 'pie',
        extraCols: ['location_id','location']
    }
};

const ROADSIDE_LITTER_CLEANUPS_TABLE: string = 'roadside_litter_cleanups';
const ROADSIDE_LITTER_BULKY_ITEMS_TABLE: string = 'roadside_litter_bulky_items';
const RL_BULKY_ITEMS_REFERENCE_TABLE: string = 'bulky_items_reference';
const ROADSIDE_LITTER_DISTRICTS_TABLE: string = 'roadside_litter_districts';
const DISTRICT_REFERENCE_TABLE: string = 'district_reference'
export const ROADSIDE_LITTER_METRIC_VALUES: {
    litterLbs: MetricValuesModel,
    recyclingLbs: MetricValuesModel,
    bulkyCount: MetricValuesModel,
    topBulkyItems: MetricValuesModel,
    topDistricts: MetricValuesModel
} = {
    litterLbs: {
        tables: [ROADSIDE_LITTER_CLEANUPS_TABLE],
        valueCol: 'litter_lbs',
        metricTitle: 'Roadside Litter Pounds of Litter Collected',
        dataLabel: 'pounds of litter collected',
        chartType: 'bar'
    },
    recyclingLbs: {
        tables: [ROADSIDE_LITTER_CLEANUPS_TABLE],
        valueCol: 'recycling_lbs',
        metricTitle: 'Roadside Litter Pounds of Recycling Collected',
        dataLabel: 'pounds of recycling collected',
        chartType: 'bar'
    },
    bulkyCount: {
        tables: [ROADSIDE_LITTER_BULKY_ITEMS_TABLE, ROADSIDE_LITTER_CLEANUPS_TABLE],
        valueCol: '',
        metricTitle: 'Roadside Litter Number of Bulky Items Collected',
        dataLabel: 'number of bulky items collected',
        chartType: 'bar',
        extraCols: ['roadside_litter_cleanup_id']
    },
    topBulkyItems: {
        tables: [ROADSIDE_LITTER_CLEANUPS_TABLE, ROADSIDE_LITTER_BULKY_ITEMS_TABLE, RL_BULKY_ITEMS_REFERENCE_TABLE],
        valueCol: '',
        metricTitle: 'Roadside Litter Most Collected Bulky Items',
        dataLabel: 'most collected bulky items',
        chartType: 'pie',
        extraCols: ['roadside_litter_cleanup_id','bulky_item_ref_id','id']
    },
    topDistricts: {
        tables: [ROADSIDE_LITTER_CLEANUPS_TABLE, ROADSIDE_LITTER_DISTRICTS_TABLE, DISTRICT_REFERENCE_TABLE],
        valueCol: '',
        metricTitle: 'Roadside Litter Most Cleaned Districts',
        dataLabel: 'most collected bulky items',
        chartType: 'pie',
        extraCols: ['roadside_litter_cleanup_id','district_code','code']
    }
};

export const TOTAL_METRIC_VALUES: {
    trashLbs: MetricValuesModel,
    recyclingLbs: MetricValuesModel,
    volunteerHours: MetricValuesModel,
    volunteerCount: MetricValuesModel,
} = {
    trashLbs: {
        tables: [],
        valueCol: '',
        metricTitle: 'Total Pounds of Trash Collected Across KPB Programs',
        dataLabel: 'pounds of trash collected',
        chartType: 'bar',
        procedures: [
            'ward_production.get_total_trash_litter_by_month(?,?,?,?)',
            'ward_production.get_total_trash_litter_by_quarter(?,?,?,?)',
            'ward_production.get_total_trash_litter_by_fiscal_year(?,?,?,?)'
        ]
    },
    recyclingLbs: {
        tables: [],
        valueCol: '',
        metricTitle: 'Total Pounds of Recycling Collected Across KPB Programs',
        dataLabel: 'pounds of recycling collected',
        chartType: 'bar',
        procedures: [
            'ward_production.get_total_recycling_by_month(?,?,?,?)',
            'ward_production.get_total_recycling_by_quarter(?,?,?,?)',
            'ward_production.get_total_recycling_by_fiscal_year(?,?,?,?)'
        ]
    },
    volunteerHours: {
        tables: [],
        valueCol: '',
        metricTitle: 'Total Number of Volunteer Hours Across KPB Programs',
        dataLabel: 'number of volunteer hours',
        chartType: 'bar',
        procedures: [
            'ward_production.get_total_volunteer_hours_by_month(?,?,?,?)',
            'ward_production.get_total_volunteer_hours_by_quarter(?,?,?,?)',
            'ward_production.get_total_volunteer_hours_by_fiscal_year(?,?,?,?)'
        ]
    },
    volunteerCount: {
        tables: [],
        valueCol: '',
        metricTitle: 'Total Number of Volunteers Across KPB Programs',
        dataLabel: 'number of volunteers',
        chartType: 'bar',
        procedures: [
            'ward_production.get_total_volunteer_count_by_month(?,?,?,?)',
            'ward_production.get_total_volunteer_count_by_quarter(?,?,?,?)',
            'ward_production.get_total_volunteer_count_by_fiscal_year(?,?,?,?)'
        ]
    }
};

const TRASH_CAN_ROUTES_TABLE: string = 'trash_can_routes';
export const TRASH_ROUTES_METRIC_VALUES: {
    trashLbs: MetricValuesModel, recyclingLbs: MetricValuesModel
} = {
    trashLbs: {
        tables: [TRASH_CAN_ROUTES_TABLE],
        valueCol: 'trash_lbs',
        metricTitle: 'Trash Can Routes Pounds of Trash Collected',
        dataLabel: 'pounds of trash collected',
        chartType: 'bar'
    },
    recyclingLbs: {
        tables: [TRASH_CAN_ROUTES_TABLE],
        valueCol: 'recycling_lbs',
        metricTitle: 'Trash Can Routes Pounds of Recycling Collected',
        dataLabel: 'pounds of recycling collected',
        chartType: 'bar'
    }
};

const TREE_PLANTING_EVENTS_TABLE: string = 'tree_planting_events';
export const TREE_PLANTING_METRIC_VALUES: {
    treeCount: MetricValuesModel, volunteerCount: MetricValuesModel, volunteerHours: MetricValuesModel
} = {
    treeCount: {
        tables: [TREE_PLANTING_EVENTS_TABLE],
        valueCol: 'tree_count',
        metricTitle: 'Tree Planting Event Number of Trees Planted',
        dataLabel: 'number of trees planted',
        chartType: 'bar'
    },
    volunteerCount: {
        tables: [TREE_PLANTING_EVENTS_TABLE],
        valueCol: 'volunteer_count',
        metricTitle: 'Tree Planting Event Number of Volunteers',
        dataLabel: 'number of volunteers',
        chartType: 'bar'
    },
    volunteerHours: {
        tables: [TREE_PLANTING_EVENTS_TABLE],
        valueCol: 'volunteer_hours',
        metricTitle: 'Tree Planting Event Number of Volunteer Hours',
        dataLabel: 'number of volunteer hours',
        chartType: 'bar'
    }
};