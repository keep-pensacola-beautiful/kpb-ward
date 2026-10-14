import { getConnection, closeConnection } from '../lib/database-connector';
import { QueryResult } from 'mysql2/promise';
import { StatementsValuesModel } from '../models';
import { isBlank } from '../utils/isBlank';
import {
    prepareAdoptASpotWhereConditions,
    prepareBagSwapWhereConditions,
    prepareCleanTeamWhereConditions,
    prepareCountyCleanupWhereAndHavingConditions,
    prepareEducationWhereConditions,
    prepareGroupCleanupWhereConditions,
    prepareRoadsideLitterWhereAndHavingConditions,
    prepareTrashRoutesWhereConditions,
    prepareTreePlantingWhereConditions
} from './prepareSearchCriteriaForQuery';

export async function searchAdoptASpotEvents(
    startDate: string, endDate: string,
    litterLbsMin: string | undefined, litterLbsMax: string | undefined,
    recyclingLbsMin: string | undefined, recyclingLbsMax: string | undefined,
    assignmentId: string | undefined,
    volCountMin: string | undefined, volCountMax: string | undefined,
    limit: number, offset: number
) {
    let conn = null;
    try {
        conn = await getConnection();
        let whereConditions: StatementsValuesModel = prepareAdoptASpotWhereConditions(
            litterLbsMin, litterLbsMax,
            recyclingLbsMin, recyclingLbsMax,
            assignmentId,
            volCountMin, volCountMax
        );
        const [result] = await conn.execute(
            'SELECT cleanup.id, ' +
                `CONCAT(DATE(cleanup.date), '') AS date, ` +
                'cleanup.litter_lbs AS litterLbs, ' +
                'cleanup.recycling_lbs AS recyclingLbs, ' +
                'cleanup.volunteer_count AS volunteerCount, ' +
                'cleanup.volunteer_hours AS volunteerHours, ' +
                'assignment.group_name AS groupName, ' +
                'assignment.location ' +
            'FROM adopt_a_spot_cleanups cleanup ' +
            'INNER JOIN ( ' +
                'SELECT id FROM adopt_a_spot_cleanups ' +
                'WHERE date >= ? AND date <= ? ' +
                'AND deleted_at IS NULL ' +
                whereConditions.statements +
                ' ORDER BY date ASC, id ASC ' +
                `LIMIT ${limit} OFFSET ${offset} ` +
            ') AS page ON cleanup.id = page.id ' +
            'INNER JOIN adopt_a_spot_assignments assignment ON cleanup.assignment_id = assignment.id ' +
            'ORDER BY cleanup.date ASC, cleanup.id ASC',
            [startDate, endDate, ...whereConditions.values]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to search Adopt-a-Spot Cleanup Events: ${err}`);
        if (conn) {
            conn.release();
        }
        return null;
    }
}

export async function getCountOfAdoptASpotEventsMatchingCriteria(
    startDate: string, endDate: string,
    litterLbsMin: string | undefined, litterLbsMax: string | undefined,
    recyclingLbsMin: string | undefined, recyclingLbsMax: string | undefined,
    assignmentId: string | undefined,
    volCountMin: string | undefined, volCountMax: string | undefined
) {
    let conn = null;
    try {
        conn = await getConnection();
        let whereConditions: StatementsValuesModel = prepareAdoptASpotWhereConditions(
            litterLbsMin, litterLbsMax,
            recyclingLbsMin, recyclingLbsMax,
            assignmentId,
            volCountMin, volCountMax
        );
        const [result] = await conn.execute(
            'SELECT COUNT(id) AS rowCount FROM adopt_a_spot_cleanups ' +
            'WHERE date >= ? AND date <= ? ' +
            'AND cleanup.deleted_at IS NULL ' +
            whereConditions.statements,
            [startDate, endDate, ...whereConditions.values]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to get count of Adopt-a-Spot Cleanup Events matching criteria: ${err}`);
        if (conn) {
            conn.release();
        }
        return null;
    }
}

export async function searchBagSwapEvents(
    startDate: string, endDate: string,
    bagMin: string | undefined, bagMax: string | undefined,
    volCountMin: string | undefined, volCountMax: string | undefined,
    eventDesc: string | undefined,
    limit: number, offset: number
): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
        let whereConditions: StatementsValuesModel = prepareBagSwapWhereConditions(
            bagMin, bagMax,
            volCountMin, volCountMax,
            eventDesc
        );
        const [result] = await conn.execute(
            'SELECT event.id, ' +
                `CONCAT(DATE(event.date), '') AS date, ` +
                'event.bag_count AS bagCount, ' +
                'event.volunteer_count AS volunteerCount, ' +
                'event.volunteer_hours AS volunteerHours, ' +
                'event.event_desc AS eventDesc ' +
            'FROM bag_swap_events event ' +
            'INNER JOIN ( ' +
                'SELECT id FROM bag_swap_events ' +
                'WHERE date >= ? AND date <= ? ' +
                'AND deleted_at IS NULL ' +
                whereConditions.statements +
                ' ORDER BY date ASC, id ASC ' +
                `LIMIT ${limit} OFFSET ${offset} ` +
            ') AS page ON event.id = page.id ' +
            'ORDER BY event.date ASC, event.id ASC ',
            [startDate, endDate, ...whereConditions.values]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to search Bag Swap Events: ${err}`);
        if (conn) {
            conn.release();
        }
        return null;
    }
}

export async function getCountOfBagSwapEventsMatchingCriteria(
    startDate: string, endDate: string,
    bagMin: string | undefined, bagMax: string | undefined,
    volCountMin: string | undefined, volCountMax: string | undefined,
    eventDesc: string | undefined
): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
        let whereConditions: StatementsValuesModel = prepareBagSwapWhereConditions(
            bagMin, bagMax,
            volCountMin, volCountMax,
            eventDesc
        );
        const [result] = await conn.execute(
            'SELECT COUNT(id) AS rowCount FROM bag_swap_events ' +
            'WHERE date >= ? AND date <= ? ' +
            'AND deleted_at IS NULL ' +
            whereConditions.statements,
            [startDate, endDate, ...whereConditions.values]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to get count of Bag Swap Events matching criteria: ${err}`);
        if (conn) {
            conn.release();
        }
        return null;
    }
}

export async function searchCleanTeamEvents(
    startDate: string, endDate: string,
    trashLbsMin: string | undefined, trashLbsMax: string | undefined,
    recyclingLbsMin: string | undefined, recyclingLbsMax: string | undefined,
    eventDesc: string | undefined,
    limit: number, offset: number
): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
        let whereConditions: StatementsValuesModel = prepareCleanTeamWhereConditions(
            trashLbsMin, trashLbsMax,
            recyclingLbsMin, recyclingLbsMax,
            eventDesc
        );
        const [result] = await conn.execute(
            'SELECT ' +
                `event.id, CONCAT(DATE(event.date), '') AS date, ` +
                'event.trash_lbs AS trashLbs, event.recycling_lbs AS recyclingLbs, ' +
                'event.event_desc AS eventDesc ' +
            'FROM clean_team_events event ' +
            'INNER JOIN ( ' +
                'SELECT id FROM clean_team_events ' +
                'WHERE date >= ? AND date <= ? ' +
                'AND deleted_at IS NULL ' +
                whereConditions.statements +
                ' ORDER BY date ASC, id ASC ' +
                `LIMIT ${limit} OFFSET ${offset} ` +
            ') AS page ON event.id = page.id ' +
            'ORDER BY event.date ASC, event.id ASC',
            [startDate, endDate, ...whereConditions.values]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to search Clean Team Events: ${err}`);
        if (conn) {
            conn.release();
        }
        return null;
    }
}

export async function getCountOfCleanTeamEventsMatchingCriteria(
    startDate: string, endDate: string,
    trashLbsMin: string | undefined, trashLbsMax: string | undefined,
    recyclingLbsMin: string | undefined, recyclingLbsMax: string | undefined,
    eventDesc: string | undefined
): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
        let whereConditions: StatementsValuesModel = prepareCleanTeamWhereConditions(
            trashLbsMin, trashLbsMax,
            recyclingLbsMin, recyclingLbsMax,
            eventDesc
        );
        const [result] = await conn.execute(
            'SELECT COUNT(id) AS rowCount FROM clean_team_events ' +
            'WHERE date >= ? AND date <= ? ' +
            'AND deleted_at IS NULL ' +
            whereConditions.statements,
            [startDate, endDate, ...whereConditions.values]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to get count of Clean Team Events matching criteria: ${err}`);
        if (conn) {
            conn.release();
        }
        return null;
    }
}

export async function searchCountyCleanupEvents(
    startDate: string, endDate: string,
    tireCountMin: string | undefined, tireCountMax: string | undefined,
    paintChemCountMin: string | undefined, paintChemCountMax: string | undefined,
    bulkyItemsLbsMin: string | undefined, bulkyItemsLbsMax: string | undefined,
    bulkyItemCountMin: string | undefined, bulkyItemCountMax: string | undefined,
    limit: number, offset: number
): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
        const whereAndHavingConditions: { where: StatementsValuesModel, having: StatementsValuesModel } =
            prepareCountyCleanupWhereAndHavingConditions(
                tireCountMin, tireCountMax,
                paintChemCountMin, paintChemCountMax,
                bulkyItemsLbsMin, bulkyItemsLbsMax,
                bulkyItemCountMin, bulkyItemCountMax
            );
        const [result] = await conn.execute(
            'SELECT cleanup.id, ' +
                `CONCAT(DATE(cleanup.date), '') AS date, ` +
                'cleanup.tire_count AS tireCount, ' +
                'cleanup.tire_lbs AS tireLbs, ' +
                'cleanup.paint_can_and_household_chemical_count AS paintCanAndHouseholdChemicalCount, ' +
                'cleanup.paint_can_and_household_chemical_lbs AS paintCanAndHouseholdChemicalLbs, ' +
                'cleanup.bulky_items_lbs AS bulkyItemsLbs, ' +
                'page.bulkyItemCount ' +
            'FROM county_cleanups cleanup ' +
            'INNER JOIN ( ' +
                'SELECT cleanup.id, COALESCE(SUM(items.quantity), 0) AS bulkyItemCount ' +
                'FROM county_cleanups cleanup ' +
                'LEFT JOIN county_cleanups_bulky_items items ON cleanup.id = items.county_cleanup_id ' +
                'WHERE date >= ? AND date <= ? ' +
                'AND cleanup.deleted_at IS NULL ' +
                whereAndHavingConditions.where.statements +
                ' GROUP BY cleanup.id ' +
                whereAndHavingConditions.having.statements +
                ' ORDER BY cleanup.date ASC, cleanup.id ASC ' +
                ` LIMIT ${limit} OFFSET ${offset} ` +
            ') AS page ON cleanup.id = page.id ' +
            'ORDER BY cleanup.date ASC, cleanup.id ASC',
            [startDate, endDate, ...whereAndHavingConditions.where.values, ...whereAndHavingConditions.having.values]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to search County Neighborhood Cleanup Events: ${err}`);
        if (conn) {
            conn.release();
        }
        return null;
    }
}

export async function getCountOfCountyCleanupEventsMatchingCriteria(
    startDate: string, endDate: string,
    tireCountMin: string | undefined, tireCountMax: string | undefined,
    paintChemCountMin: string | undefined, paintChemCountMax: string | undefined,
    bulkyItemsLbsMin: string | undefined, bulkyItemsLbsMax: string | undefined,
    bulkyItemCountMin: string | undefined, bulkyItemCountMax: string | undefined
): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
        const whereAndHavingConditions: { where: StatementsValuesModel, having: StatementsValuesModel } =
            prepareCountyCleanupWhereAndHavingConditions(
                tireCountMin, tireCountMax,
                paintChemCountMin, paintChemCountMax,
                bulkyItemsLbsMin, bulkyItemsLbsMax,
                bulkyItemCountMin, bulkyItemCountMax
            );
        const [result] = await conn.execute(
            'SELECT COUNT(cleanup.id) AS rowCount ' +
            'FROM county_cleanups cleanup ' +
            'LEFT JOIN county_cleanups_bulky_items items ON cleanup.id = items.county_cleanup_id ' +
            'WHERE date >= ? AND date <= ? ' +
            'AND cleanup.deleted_at IS NULL ' +
            whereAndHavingConditions.where.statements +
            ' GROUP BY cleanup.id ' +
            whereAndHavingConditions.having.statements,
            [startDate, endDate, ...whereAndHavingConditions.where.values, ...whereAndHavingConditions.having.values]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to get count of County Neighborhood Cleanup Events matching criteria: ${err}`);
        if (conn) {
            conn.release();
        }
        return null;
    }
}

export async function searchEducationEvents(
    startDate: string, endDate: string,
    studentMin: string | undefined, studentMax: string | undefined,
    topicId: string | undefined,
    recipientId: string | undefined,
    volCountMin: string | undefined, volCountMax: string | undefined,
    limit: number, offset: number
): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
        const whereConditions: StatementsValuesModel = prepareEducationWhereConditions(
            studentMin, studentMax,
            topicId,
            recipientId,
            volCountMin, volCountMax
        );
        const [result] = await conn.execute(
            'SELECT event.id, ' +
                `CONCAT(DATE(event.date), '') AS date, ` +
                'event.student_count AS studentCount, ' +
                'event.event_length AS eventLength, ' +
                'event.volunteer_count AS volunteerCount, ' +
                'event.volunteer_hours AS volunteerHours, ' +
                'topic.topic, ' +
                'recipient.name ' +
            'FROM education_events event ' +
            'INNER JOIN ( ' +
                'SELECT id FROM education_events ' +
                'WHERE date >= ? AND date <= ? ' +
                'AND deleted_at IS NULL ' +
                whereConditions.statements +
                ' ORDER BY date ASC, id ASC ' +
                `LIMIT ${limit} OFFSET ${offset} ` +
            ') AS page ON event.id = page.id ' +
            'INNER JOIN education_topics topic ON event.topic_id = topic.id ' +
            'INNER JOIN education_recipients recipient ON event.recipient_id = recipient.id ',
            [startDate, endDate, ...whereConditions.values]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to search Education Events: ${err}`);
        if (conn) {
            conn.release();
        }
        return null;
    }
}

export async function getCountOfEducationEventsMatchingCriteria(
    startDate: string, endDate: string,
    studentMin: string | undefined, studentMax: string | undefined,
    topicId: string | undefined,
    recipientId: string | undefined,
    volCountMin: string | undefined, volCountMax: string | undefined
): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
        const whereConditions: StatementsValuesModel = prepareEducationWhereConditions(
            studentMin, studentMax,
            topicId,
            recipientId,
            volCountMin, volCountMax
        );
        const [result] = await conn.execute(
            'SELECT COUNT(id) AS rowCount FROM education_events ' +
            'WHERE date >= ? AND date <= ? ' +
            'AND deleted_at IS NULL ' +
            whereConditions.statements,
            [startDate, endDate, ...whereConditions.values]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to get count of Education Events matching criteria: ${err}`);
        if (conn) {
            conn.release();
        }
        return null;
    }
}

export async function searchGroupCleanupEvents(
    startDate: string, endDate: string,
    litterLbsMin: string | undefined, litterLbsMax: string | undefined,
    recyclingLbsMin: string | undefined, recyclingLbsMax: string | undefined,
    organizationId: string | undefined,
    cleanupLocationId: string | undefined,
    volCountMin: string | undefined, volCountMax: string | undefined,
    limit: number, offset: number
) {
    let conn = null;
    try {
        conn = await getConnection();
        const whereConditions: StatementsValuesModel = prepareGroupCleanupWhereConditions(
            litterLbsMin, litterLbsMax,
            recyclingLbsMin, recyclingLbsMax,
            organizationId,
            cleanupLocationId,
            volCountMin, volCountMax
        );
        const [result] = await conn.execute(
            'SELECT cleanup.id, ' +
                `CONCAT(DATE(cleanup.date), '') AS date, ` +
                'cleanup.litter_lbs AS litterLbs, ' +
                'cleanup.recycling_lbs AS recyclingLbs, ' +
                'cleanup.volunteer_count AS volunteerCount, ' +
                'cleanup.volunteer_hours AS volunteerHours, ' +
                'location.location, ' +
                'org.name ' +
            'FROM group_cleanups cleanup ' +
            'INNER JOIN ( ' +
                'SELECT id FROM group_cleanups ' +
                'WHERE date >= ? AND date <= ? ' +
                'AND deleted_at IS NULL ' +
                whereConditions.statements +
                ' ORDER BY date ASC, id ASC ' +
                `LIMIT ${limit} OFFSET ${offset} ` +
            ') AS page ON cleanup.id = page.id ' +
            'INNER JOIN cleanup_locations location ON cleanup.location_id = location.id ' +
            'INNER JOIN organizations org ON cleanup.organization_id = org.id ' +
            'ORDER BY cleanup.date ASC, cleanup.id ASC ',
            [startDate, endDate, ...whereConditions.values]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to search Group Cleanup Events: ${err}`);
        if (conn) {
            conn.release();
        }
        return null;
    }
}

export async function getCountOfGroupCleanupEventsMatchingCriteria(
    startDate: string, endDate: string,
    litterLbsMin: string | undefined, litterLbsMax: string | undefined,
    recyclingLbsMin: string | undefined, recyclingLbsMax: string | undefined,
    organizationId: string | undefined,
    cleanupLocationId: string | undefined,
    volCountMin: string | undefined, volCountMax: string | undefined
) {
    let conn = null;
    try {
        conn = await getConnection();
        const whereConditions: StatementsValuesModel = prepareGroupCleanupWhereConditions(
            litterLbsMin, litterLbsMax,
            recyclingLbsMin, recyclingLbsMax,
            organizationId,
            cleanupLocationId,
            volCountMin, volCountMax
        );
        const [result] = await conn.execute(
            'SELECT COUNT(id) AS rowCount FROM group_cleanups ' +
            'WHERE date >= ? AND date <= ? ' +
            'AND deleted_at IS NULL ' +
            whereConditions.statements,
            [startDate, endDate, ...whereConditions.values]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to get count of Group Cleanup Events matching criteria: ${err}`);
        if (conn) {
            conn.release();
        }
        return null;
    }
}

export async function searchRoadsideLitterEvents(
    startDate: string, endDate: string,
    litterLbsMin: string | undefined, litterLbsMax: string | undefined,
    recyclingLbsMin: string | undefined, recyclingLbsMax: string | undefined,
    districtCode: string | undefined,
    location: string | undefined,
    bulkyItemCountMin: string | undefined, bulkyItemCountMax: string | undefined,
    limit: number, offset: number
): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
        let districtsInnerJoin: string = '';
        if (districtCode !== undefined && !isBlank(districtCode)) {
            districtsInnerJoin = 'INNER JOIN roadside_litter_districts district ON cleanup.id = district.roadside_litter_cleanup_id ';
        }
        const whereAndHavingConditions: { where: StatementsValuesModel, having: StatementsValuesModel } =
            prepareRoadsideLitterWhereAndHavingConditions(
                litterLbsMin, litterLbsMax,
                recyclingLbsMin, recyclingLbsMax,
                districtCode,
                location,
                bulkyItemCountMin, bulkyItemCountMax
            );
        const [result] = await conn.execute(
            'WITH districts_by_cleanup AS ( ' +
                `SELECT district.roadside_litter_cleanup_id, GROUP_CONCAT(ref.description SEPARATOR ', ') AS districts ` +
                'FROM roadside_litter_districts district ' +
                'INNER JOIN district_reference ref ON district.district_code = ref.code ' +
                'WHERE roadside_litter_cleanup_id IN ( ' +
                    'SELECT id FROM roadside_litter_cleanups ' +
                    'WHERE date >= ? AND date <= ? AND deleted_at IS NULL ' +
                ') ' +
                'GROUP BY roadside_litter_cleanup_id ' +
            ') ' +
            'SELECT cleanup.id, ' +
                `CONCAT(DATE(cleanup.date), '') AS date, ` +
                'cleanup.litter_lbs AS litterLbs, ' +
                'cleanup.recycling_lbs AS recyclingLbs, ' +
                'cleanup.locations, ' +
                'page.bulkyItemCount, ' +
                'districts_by_cleanup.districts ' +
            'FROM roadside_litter_cleanups cleanup ' +
            'INNER JOIN ( ' +
                'SELECT cleanup.id, COALESCE(SUM(items.quantity), 0) AS bulkyItemCount ' +
                'FROM roadside_litter_cleanups cleanup ' +
                districtsInnerJoin +
                'LEFT JOIN roadside_litter_bulky_items items ON cleanup.id = items.roadside_litter_cleanup_id ' +
                'WHERE cleanup.date >= ? AND cleanup.date <= ? ' +
                'AND cleanup.deleted_at IS NULL ' +
                whereAndHavingConditions.where.statements +
                ' GROUP BY cleanup.id ' +
                whereAndHavingConditions.having.statements +
                ' ORDER BY cleanup.date ASC, cleanup.id ASC ' +
                `LIMIT ${limit} OFFSET ${offset} ` +
            ') AS page ON cleanup.id = page.id ' +
            'INNER JOIN districts_by_cleanup ON cleanup.id = districts_by_cleanup.roadside_litter_cleanup_id ' +
            'ORDER BY cleanup.date ASC, cleanup.id ASC ',
            [ startDate, endDate, startDate, endDate, ...whereAndHavingConditions.where.values, ...whereAndHavingConditions.having.values]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to search Roadside Litter Events: ${err}`);
        console.error(err);
        if (conn) {
            conn.release();
        }
        return null;
    }
}

export async function getCountOfRoadsideLitterEventsMatchingCriteria(
    startDate: string, endDate: string,
    litterLbsMin: string | undefined, litterLbsMax: string | undefined,
    recyclingLbsMin: string | undefined, recyclingLbsMax: string | undefined,
    districtCode: string | undefined,
    location: string | undefined,
    bulkyItemCountMin: string | undefined, bulkyItemCountMax: string | undefined
): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
        let districtsInnerJoin: string = '';
        if (districtCode !== undefined && !isBlank(districtCode)) {
            districtsInnerJoin = 'INNER JOIN roadside_litter_districts district ON cleanup.id = district.roadside_litter_cleanup_id ';
        }
        const whereAndHavingConditions: { where: StatementsValuesModel, having: StatementsValuesModel } =
            prepareRoadsideLitterWhereAndHavingConditions(
                litterLbsMin, litterLbsMax,
                recyclingLbsMin, recyclingLbsMax,
                districtCode,
                location,
                bulkyItemCountMin, bulkyItemCountMax
            );
        const [result] = await conn.execute(
            'SELECT COUNT(cleanup.id) as rowCount ' +
            'FROM roadside_litter_cleanups cleanup ' +
            'INNER JOIN ( ' +
                'SELECT cleanup.id FROM roadside_litter_cleanups cleanup ' +
                districtsInnerJoin +
                'LEFT JOIN roadside_litter_bulky_items items ON cleanup.id = items.roadside_litter_cleanup_id ' +
                'WHERE cleanup.date >= ? AND cleanup.date <= ? ' +
                'AND cleanup.deleted_at IS NULL ' +
                whereAndHavingConditions.where.statements +
                ' GROUP BY cleanup.id ' +
                whereAndHavingConditions.having.statements +
            ' ) AS included_ids ON cleanup.id = included_ids.id',
            [ startDate, endDate, ...whereAndHavingConditions.where.values, ...whereAndHavingConditions.having.values]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to get count of Roadside Litter Events matching criteria: ${err}`);
        console.error(err);
        if (conn) {
            conn.release();
        }
        return null;
    }
}

export async function searchTrashRoutesEvents(
    startDate: string, endDate: string,
    trashLbsMin: string | undefined, trashLbsMax: string | undefined,
    recyclingLbsMin: string | undefined, recyclingLbsMax: string | undefined,
    limit: number, offset: number
): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
        const whereConditions: StatementsValuesModel = prepareTrashRoutesWhereConditions(
            trashLbsMin, trashLbsMax,
            recyclingLbsMin, recyclingLbsMax
        );
        const [result] = await conn.execute(
            'SELECT event.id, ' +
                `CONCAT(DATE(event.date), '') AS date, ` +
                'event.trash_lbs AS trashLbs, ' +
                'event.recycling_lbs AS recyclingLbs ' +
            'FROM trash_can_routes event ' +
            'INNER JOIN ( ' +
                'SELECT id FROM trash_can_routes ' +
                'WHERE date >= ? AND date <= ? ' +
                'AND deleted_at IS NULL ' +
                whereConditions.statements +
                'ORDER BY date ASC, id ASC ' +
                `LIMIT ${limit} OFFSET ${offset} ` +
            ') AS page ON event.id = page.id ' +
            'ORDER BY event.date ASC, event.id ASC ',
            [startDate, endDate, ...whereConditions.values]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to search Trash Can Routes Events: ${err}`);
        if (conn) {
            conn.release();
        }
        return null;
    }
}

export async function getCountOfTrashRoutesEventsMatchingCriteria(
    startDate: string, endDate: string,
    trashLbsMin: string | undefined, trashLbsMax: string | undefined,
    recyclingLbsMin: string | undefined, recyclingLbsMax: string | undefined
): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
        const whereConditions: StatementsValuesModel = prepareTrashRoutesWhereConditions(
            trashLbsMin, trashLbsMax,
            recyclingLbsMin, recyclingLbsMax
        );
        const [result] = await conn.execute(
            'SELECT COUNT(id) AS rowCount FROM trash_can_routes ' +
            'WHERE date >= ? AND date <= ? ' +
            'AND deleted_at IS NULL ' +
            whereConditions.statements,
            [startDate, endDate, ...whereConditions.values]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to get count of Trash Can Routes Events matching criteria: ${err}`);
        if (conn) {
            conn.release();
        }
        return null;
    }
}

export async function searchTreePlantingEvents(
    startDate: string, endDate: string,
    treeMin: string | undefined, treeMax: string | undefined,
    volCountMin: string | undefined, volCountMax: string | undefined,
    eventDesc: string | undefined,
    limit: number, offset: number
): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
        const whereConditions: StatementsValuesModel = prepareTreePlantingWhereConditions(
            treeMin, treeMax,
            volCountMin, volCountMax,
            eventDesc
        );
        const [result] = await conn.execute(
            'SELECT event.id, ' +
                `CONCAT(DATE(event.date), '') AS date, ` +
                'event.tree_count AS treeCount, ' +
                'event.volunteer_count AS volunteerCount, ' +
                'event.volunteer_hours AS volunteerHours, ' +
                'event.event_desc AS eventDesc ' +
            'FROM tree_planting_events event ' +
            'INNER JOIN ( ' +
                'SELECT id FROM tree_planting_events ' +
                'WHERE date >= ? AND date <= ? ' +
                'AND deleted_at IS NULL ' +
                whereConditions.statements +
                'ORDER BY date ASC, id ASC ' +
                `LIMIT ${limit} OFFSET ${offset} ` +
            ') AS page ON event.id = page.id ' +
            'ORDER BY event.date ASC, event.id ASC',
            [startDate, endDate, ...whereConditions.values]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to search Tree Planting Events: ${err}`);
        if (conn) {
            conn.release();
        }
        return null;
    }
}

export async function getCountOfTreePlantingEventsMatchingCriteria(
    startDate: string, endDate: string,
    treeMin: string | undefined, treeMax: string | undefined,
    volCountMin: string | undefined, volCountMax: string | undefined,
    eventDesc: string | undefined
): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
        const whereConditions: StatementsValuesModel = prepareTreePlantingWhereConditions(
            treeMin, treeMax,
            volCountMin, volCountMax,
            eventDesc
        );
        const [result] = await conn.execute(
            'SELECT COUNT(id) AS rowCount FROM tree_planting_events ' +
            'WHERE date >= ? AND date <= ? ' +
            'AND deleted_at IS NULL ' +
            whereConditions.statements,
            [startDate, endDate, ...whereConditions.values]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to get count of Tree Planting Events matching criteria: ${err}`);
        if (conn) {
            conn.release();
        }
        return null;
    }
}