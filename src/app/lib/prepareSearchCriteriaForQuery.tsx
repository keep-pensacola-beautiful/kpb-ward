import { StatementsValuesModel } from '../models';
import { isBlank } from '../utils/isBlank';

export function prepareAdoptASpotWhereConditions(
    litterLbsMin: string | undefined, litterLbsMax: string | undefined,
    recyclingLbsMin: string | undefined, recyclingLbsMax: string | undefined,
    assignmentId: string | undefined,
    volCountMin: string | undefined, volCountMax: string | undefined
): StatementsValuesModel {
    let whereStatements: string = '';
    let whereValues: string[] = [];
    if (litterLbsMin !== undefined && !isBlank(litterLbsMin)) {
        whereStatements += ' AND litter_lbs >= ? ';
        whereValues.push(litterLbsMin);
    }
    if (litterLbsMax !== undefined && !isBlank(litterLbsMax)) {
        whereStatements += ' AND litter_lbs <= ? ';
        whereValues.push(litterLbsMax);
    }
    if (recyclingLbsMin !== undefined && !isBlank(recyclingLbsMin)) {
        whereStatements += ' AND recycling_lbs >= ? ';
        whereValues.push(recyclingLbsMin);
    }
    if (recyclingLbsMax !== undefined && !isBlank(recyclingLbsMax)) {
        whereStatements += ' AND recycling_lbs <= ? ';
        whereValues.push(recyclingLbsMax);
    }
    if (assignmentId !== undefined && !isBlank(assignmentId)) {
        whereStatements += ' AND assignment_id = ? ';
        whereValues.push(assignmentId);
    }
    if (volCountMin !== undefined && !isBlank(volCountMin)) {
        whereStatements += ' AND volunteer_count >= ? ';
        whereValues.push(volCountMin);
    }
    if (volCountMax !== undefined && !isBlank(volCountMax)) {
        whereStatements += ' AND volunteer_count <= ? ';
        whereValues.push(volCountMax);
    }
    return { statements: whereStatements, values: whereValues };
}

export function prepareBagSwapWhereConditions(
    bagMin: string | undefined, bagMax: string | undefined,
    volCountMin: string | undefined, volCountMax: string | undefined,
    eventDesc: string | undefined
): StatementsValuesModel {
    let whereStatements: string = '';
    let whereValues: string[] = [];
    if (bagMin !== undefined && !isBlank(bagMin)) {
        whereStatements += ' AND bag_count >= ? ';
        whereValues.push(bagMin);
    }
    if (bagMax !== undefined && !isBlank(bagMax)) {
        whereStatements += ' AND bag_count <= ? ';
        whereValues.push(bagMax);
    }
    if (volCountMin !== undefined && !isBlank(volCountMin)) {
        whereStatements += ' AND volunteer_count >= ? ';
        whereValues.push(volCountMin);
    }
    if (volCountMax !== undefined && !isBlank(volCountMax)) {
        whereStatements += ' AND volunteer_count <= ? ';
        whereValues.push(volCountMax);
    }
    if (eventDesc !== undefined && !isBlank(eventDesc)) {
        whereStatements += ` AND MATCH(event_desc) AGAINST (? IN NATURAL LANGUAGE MODE) `;
        whereValues.push(eventDesc);
    }
    return { statements: whereStatements, values: whereValues };
}

export function prepareCleanTeamWhereConditions(
    trashLbsMin: string | undefined, trashLbsMax: string | undefined,
    recyclingLbsMin: string | undefined, recyclingLbsMax: string | undefined,
    eventDesc: string | undefined
): StatementsValuesModel {
    let whereStatements: string = '';
    let whereValues: string[] = [];
    if (trashLbsMin !== undefined && !isBlank(trashLbsMin)) {
        whereStatements += ' AND trash_lbs >= ? ';
        whereValues.push(trashLbsMin);
    }
    if (trashLbsMax !== undefined && !isBlank(trashLbsMax)) {
        whereStatements += ' AND trash_lbs <= ? ';
        whereValues.push(trashLbsMax);
    }
    if (recyclingLbsMin !== undefined && !isBlank(recyclingLbsMin)) {
        whereStatements += ' AND recycling_lbs >= ? ';
        whereValues.push(recyclingLbsMin);
    }
    if (recyclingLbsMax !== undefined && !isBlank(recyclingLbsMax)) {
        whereStatements += ' AND recycling_lbs <= ? ';
        whereValues.push(recyclingLbsMax);
    }
    if (eventDesc !== undefined && !isBlank(eventDesc)) {
        whereStatements += ` AND MATCH(event_desc) AGAINST (? IN NATURAL LANGUAGE MODE) `;
        whereValues.push(eventDesc);
    }
    return { statements: whereStatements, values: whereValues };
}

export function prepareCountyCleanupWhereAndHavingConditions(
    tireCountMin: string | undefined, tireCountMax: string | undefined,
    paintChemCountMin: string | undefined, paintChemCountMax: string | undefined,
    bulkyItemsLbsMin: string | undefined, bulkyItemsLbsMax: string | undefined,
    bulkyItemCountMin: string | undefined, bulkyItemCountMax: string | undefined
): { where: StatementsValuesModel, having: StatementsValuesModel } {
    let whereStatements: string = '';
    let whereValues: string[] = [];
    let havingStatements: string = '';
    let havingValues: string[] = [];
    if (tireCountMin !== undefined && !isBlank(tireCountMin)) {
        whereStatements += ' AND cleanup.tire_count >= ? ';
        whereValues.push(tireCountMin);
    }
    if (tireCountMax !== undefined && !isBlank(tireCountMax)) {
        whereStatements += ' AND cleanup.tire_count <= ? ';
        whereValues.push(tireCountMax);
    }
    if (paintChemCountMin !== undefined && !isBlank(paintChemCountMin)) {
        whereStatements += ' AND cleanup.paint_can_and_household_chemical_count >= ? ';
        whereValues.push(paintChemCountMin);
    }
    if (paintChemCountMax !== undefined && !isBlank(paintChemCountMax)) {
        whereStatements += ' AND cleanup.paint_can_and_household_chemical_count <= ? ';
        whereValues.push(paintChemCountMax);
    }
    if (bulkyItemsLbsMin !== undefined && !isBlank(bulkyItemsLbsMin)) {
        whereStatements += ' AND cleanup.bulky_items_lbs >= ? ';
        whereValues.push(bulkyItemsLbsMin);
    }
    if (bulkyItemsLbsMax !== undefined && !isBlank(bulkyItemsLbsMax)) {
        whereStatements += ' AND cleanup.bulky_items_lbs <= ? ';
        whereValues.push(bulkyItemsLbsMax);
    }
    if (bulkyItemCountMin !== undefined && !isBlank(bulkyItemCountMin)) {
        havingStatements += ' COALESCE(SUM(items.quantity), 0) >= ? AND ';
        havingValues.push(bulkyItemCountMin);
    }
    if (bulkyItemCountMax !== undefined && !isBlank(bulkyItemCountMax)) {
        whereStatements += ' COALESCE(SUM(items.quantity), 0) <= ? ';
        havingValues.push(bulkyItemCountMax);
    } else if (havingValues.length > 0) {
        havingStatements = havingStatements.slice(0, -4); // Remove 'AND '
    }
    if (havingStatements !== '') {
        havingStatements = ` HAVING ${havingStatements}`;
    }
    return {
        where: { statements: whereStatements, values: whereValues },
        having: { statements: havingStatements, values: havingValues }
    };
}

export function prepareEducationWhereConditions(
    studentMin: string | undefined, studentMax: string | undefined,
    topicId: string | undefined,
    recipientId: string | undefined,
    volCountMin: string | undefined, volCountMax: string | undefined
): StatementsValuesModel {
    let whereStatements: string = '';
    let whereValues: string[] = [];
    if (studentMin !== undefined && !isBlank(studentMin)) {
        whereStatements += ' AND student_count >= ? ';
        whereValues.push(studentMin);
    }
    if (studentMax !== undefined && !isBlank(studentMax)) {
        whereStatements += ' AND student_count <= ? ';
        whereValues.push(studentMax);
    }
    if (topicId !== undefined && !isBlank(topicId)) {
        whereStatements += ' AND topic_id = ? ';
        whereValues.push(topicId);
    }
    if (recipientId !== undefined && !isBlank(recipientId)) {
        whereStatements += ' AND recipient_id = ? ';
        whereValues.push(recipientId);
    }
    if (volCountMin !== undefined && !isBlank(volCountMin)) {
        whereStatements += ' AND volunteer_count >= ? ';
        whereValues.push(volCountMin);
    }
    if (volCountMax !== undefined && !isBlank(volCountMax)) {
        whereStatements += ' AND volunteer_count <= ? ';
        whereValues.push(volCountMax);
    }
    return { statements: whereStatements, values: whereValues };
}

export function prepareGroupCleanupWhereConditions(
    litterLbsMin: string | undefined, litterLbsMax: string | undefined,
    recyclingLbsMin: string | undefined, recyclingLbsMax: string | undefined,
    organizationId: string | undefined,
    cleanupLocationId: string | undefined,
    volCountMin: string | undefined, volCountMax: string | undefined
): StatementsValuesModel {
    let whereStatements: string = '';
    let whereValues: string[] = [];
    if (litterLbsMin !== undefined && !isBlank(litterLbsMin)) {
        whereStatements += ' AND litter_lbs >= ? ';
        whereValues.push(litterLbsMin);
    }
    if (litterLbsMax !== undefined && !isBlank(litterLbsMax)) {
        whereStatements += ' AND litter_lbs <= ? ';
        whereValues.push(litterLbsMax);
    }
    if (recyclingLbsMin !== undefined && !isBlank(recyclingLbsMin)) {
        whereStatements += ' AND recycling_lbs >= ? ';
        whereValues.push(recyclingLbsMin);
    }
    if (recyclingLbsMax !== undefined && !isBlank(recyclingLbsMax)) {
        whereStatements += ' AND recycling_lbs <= ? ';
        whereValues.push(recyclingLbsMax);
    }
    if (organizationId !== undefined && !isBlank(organizationId)) {
        whereStatements += ' AND organization_id = ? ';
        whereValues.push(organizationId);
    }
    if (cleanupLocationId !== undefined && !isBlank(cleanupLocationId)) {
        whereStatements += ' AND location_id = ? ';
        whereValues.push(cleanupLocationId);
    }
    if (volCountMin !== undefined && !isBlank(volCountMin)) {
        whereStatements += ' AND volunteer_count >= ? ';
        whereValues.push(volCountMin);
    }
    if (volCountMax !== undefined && !isBlank(volCountMax)) {
        whereStatements += ' AND volunteer_count <= ? ';
        whereValues.push(volCountMax);
    }
    return { statements: whereStatements, values: whereValues };
}

export function prepareRoadsideLitterWhereAndHavingConditions(
    litterLbsMin: string | undefined, litterLbsMax: string | undefined,
    recyclingLbsMin: string | undefined, recyclingLbsMax: string | undefined,
    districtCode: string | undefined,
    location: string | undefined,
    bulkyItemCountMin: string | undefined, bulkyItemCountMax: string | undefined
): { where: StatementsValuesModel, having: StatementsValuesModel } {
    let whereStatements: string = '';
    let whereValues: string[] = [];
    let havingStatements: string = '';
    let havingValues: string[] = [];
    if (litterLbsMin !== undefined && !isBlank(litterLbsMin)) {
        whereStatements += ' AND cleanup.litter_lbs >= ? ';
        whereValues.push(litterLbsMin);
    }
    if (litterLbsMax !== undefined && !isBlank(litterLbsMax)) {
        whereStatements += ' AND cleanup.litter_lbs <= ? ';
        whereValues.push(litterLbsMax);
    }
    if (recyclingLbsMin !== undefined && !isBlank(recyclingLbsMin)) {
        whereStatements += ' AND cleanup.recycling_lbs >= ? ';
        whereValues.push(recyclingLbsMin);
    }
    if (recyclingLbsMax !== undefined && !isBlank(recyclingLbsMax)) {
        whereStatements += ' AND cleanup.recycling_lbs <= ? ';
        whereValues.push(recyclingLbsMax);
    }
    if (districtCode !== undefined && !isBlank(districtCode)) {
        whereStatements += ' AND district.district_code = ? ';
        whereValues.push(districtCode);
    }
    if (location !== undefined && !isBlank(location)) {
        whereStatements += ` AND MATCH(cleanup.locations) AGAINST (? IN NATURAL LANGUAGE MODE) `;
        whereValues.push(location);
    }
    if (bulkyItemCountMin !== undefined && !isBlank(bulkyItemCountMin)) {
        havingStatements += ' COALESCE(SUM(items.id), 0) >= ? AND ';
        havingValues.push(bulkyItemCountMin);
    }
    if (bulkyItemCountMax !== undefined && !isBlank(bulkyItemCountMax)) {
        havingStatements += ' COALESCE(SUM(items.id), 0) <= ? ';
        havingValues.push(bulkyItemCountMax);
    } else if (havingValues.length > 0) {
        havingStatements = havingStatements.slice(0, -4); // Remove 'AND '
    }
    if (havingStatements !== '') {
        havingStatements = ` HAVING ${havingStatements}`;
    }
    return {
        where: { statements: whereStatements, values: whereValues },
        having: { statements: havingStatements, values: havingValues }
    };
}

export function prepareTrashRoutesWhereConditions(
    trashLbsMin: string | undefined, trashLbsMax: string | undefined,
    recyclingLbsMin: string | undefined, recyclingLbsMax: string | undefined
): StatementsValuesModel {
    let whereStatements: string = '';
    let whereValues: string[] = [];
    if (trashLbsMin !== undefined && !isBlank(trashLbsMin)) {
        whereStatements += ' AND trash_lbs >= ? ';
        whereValues.push(trashLbsMin);
    }
    if (trashLbsMax !== undefined && !isBlank(trashLbsMax)) {
        whereStatements += ' AND trash_lbs <= ? ';
        whereValues.push(trashLbsMax);
    }
    if (recyclingLbsMin !== undefined && !isBlank(recyclingLbsMin)) {
        whereStatements += ' AND recycling_lbs >= ? ';
        whereValues.push(recyclingLbsMin);
    }
    if (recyclingLbsMax !== undefined && !isBlank(recyclingLbsMax)) {
        whereStatements += ' AND recycling_lbs <= ? ';
        whereValues.push(recyclingLbsMax);
    }
    return { statements: whereStatements, values: whereValues };
}

export function prepareTreePlantingWhereConditions(
    treeMin: string | undefined, treeMax: string | undefined,
    volCountMin: string | undefined, volCountMax: string | undefined,
    eventDesc: string | undefined
): StatementsValuesModel {
    let whereStatements: string = '';
    let whereValues: string[] = [];
    if (treeMin !== undefined && !isBlank(treeMin)) {
        whereStatements += ' AND tree_count >= ? ';
        whereValues.push(treeMin);
    }
    if (treeMax !== undefined && !isBlank(treeMax)) {
        whereStatements += ' AND tree_count <= ? ';
        whereValues.push(treeMax);
    }
    if (volCountMin !== undefined && !isBlank(volCountMin)) {
        whereStatements += ' AND volunteer_count >= ? ';
        whereValues.push(volCountMin);
    }
    if (volCountMax !== undefined && !isBlank(volCountMax)) {
        whereStatements += ' AND volunteer_count <= ? ';
        whereValues.push(volCountMax);
    }
    if (eventDesc !== undefined && !isBlank(eventDesc)) {
        whereStatements += ` AND MATCH(event_desc) AGAINST (? IN NATURAL LANGUAGE MODE) `;
        whereValues.push(eventDesc);
    }
    return { statements: whereStatements, values: whereValues };
}