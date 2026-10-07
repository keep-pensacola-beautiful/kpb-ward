import { getConnection, closeConnection } from '../lib/database-connector';
import { QueryResult } from 'mysql2/promise';
import { isBlank } from '../utils/isBlank';

export async function searchAdoptASpotEvents(
    startDate: string, endDate: string,
    litterLbsMin: string | undefined, litterLbsMax: string | undefined,
    recyclingLbsMin: string | undefined, recyclingLbsMax: string | undefined,
    assignmentId: string | undefined,
    volCountMin: string | undefined, volCountMax: string | undefined
) {
    let conn = null;
    try {
        conn = await getConnection();
        let whereStatements: string = '';
        let whereValues: string[] = [];
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
        if (assignmentId !== undefined && !isBlank(assignmentId)) {
            whereStatements += ' AND cleanup.assignment_id = ? ';
            whereValues.push(assignmentId);
        }
        if (volCountMin !== undefined && !isBlank(volCountMin)) {
            whereStatements += ' AND cleanup.volunteer_count >= ? ';
            whereValues.push(volCountMin);
        }
        if (volCountMax !== undefined && !isBlank(volCountMax)) {
            whereStatements += ' AND cleanup.volunteer_count <= ? ';
            whereValues.push(volCountMax);
        }
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
            'INNER JOIN adopt_a_spot_assignments assignment ON cleanup.assignment_id = assignment.id ' +
            'WHERE date >= ? AND date <= ? ' +
            'AND cleanup.deleted_at IS NULL ' +
            whereStatements,
            [startDate, endDate, ...whereValues]
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

// bagSwap: ['bag-min', 'bag-max', 'vol-count-min', 'vol-count-max', 'event-desc'],
export async function searchBagSwapEvents(
    startDate: string, endDate: string,
    bagMin: string | undefined, bagMax: string | undefined,
    volCountMin: string | undefined, volCountMax: string | undefined,
    eventDesc: string | undefined
): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
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
        const [result] = await conn.execute(
            'SELECT id, ' +
                `CONCAT(DATE(date), '') AS date, ` +
                'bag_count AS bagCount, ' +
                'volunteer_count AS volunteerCount, ' +
                'volunteer_hours AS volunteerHours, ' +
                'event_desc AS eventDesc ' +
            'FROM bag_swap_events ' +
            'WHERE date >= ? AND date <= ? ' +
            'AND deleted_at IS NULL ' +
            whereStatements,
            [startDate, endDate, ...whereValues]
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

export async function searchCleanTeamEvents(
    startDate: string, endDate: string,
    trashLbsMin: string | undefined, trashLbsMax: string | undefined,
    recyclingLbsMin: string | undefined, recyclingLbsMax: string | undefined,
    eventDesc: string | undefined
): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
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
        const [result] = await conn.execute(
            'SELECT id, ' +
                `CONCAT(DATE(date), '') AS date, ` +
                'trash_lbs AS trashLbs, ' +
                'recycling_lbs AS recyclingLbs, ' +
                'event_desc AS eventDesc ' +
            'FROM clean_team_events ' +
            'WHERE date >= ? AND date <= ? ' +
            'AND deleted_at IS NULL ' +
            whereStatements,
            [startDate, endDate, ...whereValues]
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

export async function searchCountyCleanupEvents(
    startDate: string, endDate: string,
    tireCountMin: string | undefined, tireCountMax: string | undefined,
    paintChemCountMin: string | undefined, paintChemCountMax: string | undefined,
    bulkyItemsLbsMin: string | undefined, bulkyItemsLbsMax: string | undefined,
    bulkyItemCountMin: string | undefined, bulkyItemCountMax: string | undefined
): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
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
            havingStatements += ' COUNT(items.id) >= ? AND ';
            havingValues.push(bulkyItemCountMin);
        }
        if (bulkyItemCountMax !== undefined && !isBlank(bulkyItemCountMax)) {
            whereStatements += ' COUNT(items.id) <= ? ';
            havingValues.push(bulkyItemCountMax);
        } else if (havingValues.length > 0) {
            havingStatements = havingStatements.slice(0, -4); // Remove 'AND '
        }
        if (havingStatements !== '') {
            havingStatements = ` HAVING ${havingStatements}`;
        }
        const [result] = await conn.execute(
            'SELECT cleanup.id, ' +
                `CONCAT(DATE(cleanup.date), '') AS date, ` +
                'cleanup.tire_count AS tireCount, ' +
                'cleanup.tire_lbs AS tireLbs, ' +
                'cleanup.paint_can_and_household_chemical_count AS paintCanAndHouseholdChemicalCount, ' +
                'cleanup.paint_can_and_household_chemical_lbs AS paintCanAndHouseholdChemicalLbs, ' +
                'cleanup.bulky_items_lbs AS bulkyItemsLbs, ' +
                'COALESCE(SUM(items.quantity), 0) AS bulkyItemCount ' +
            'FROM county_cleanups cleanup ' +
            'LEFT JOIN county_cleanups_bulky_items items ON cleanup.id = items.county_cleanup_id ' +
            'WHERE date >= ? AND date <= ? ' +
            'AND cleanup.deleted_at IS NULL ' +
            whereStatements +
            ' GROUP BY cleanup.id ' +
            havingStatements,
            [startDate, endDate, ...whereValues, ...havingValues]
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

export async function searchEducationEvents(
    startDate: string, endDate: string,
    studentMin: string | undefined, studentMax: string | undefined,
    topicId: string | undefined,
    recipientId: string | undefined,
    volCountMin: string | undefined, volCountMax: string | undefined
): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
        let whereStatements: string = '';
        let whereValues: string[] = [];
        if (studentMin !== undefined && !isBlank(studentMin)) {
            whereStatements += ' AND event.student_count >= ? ';
            whereValues.push(studentMin);
        }
        if (studentMax !== undefined && !isBlank(studentMax)) {
            whereStatements += ' AND event.student_count <= ? ';
            whereValues.push(studentMax);
        }
        if (topicId !== undefined && !isBlank(topicId)) {
            whereStatements += ' AND event.topic_id = ? ';
            whereValues.push(topicId);
        }
        if (recipientId !== undefined && !isBlank(recipientId)) {
            whereStatements += ' AND event.recipient_id = ? ';
            whereValues.push(recipientId);
        }
        if (volCountMin !== undefined && !isBlank(volCountMin)) {
            whereStatements += ' AND event.volunteer_count >= ? ';
            whereValues.push(volCountMin);
        }
        if (volCountMax !== undefined && !isBlank(volCountMax)) {
            whereStatements += ' AND event.volunteer_count <= ? ';
            whereValues.push(volCountMax);
        }
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
            'INNER JOIN education_topics topic ON event.topic_id = topic.id ' +
            'INNER JOIN education_recipients recipient ON event.recipient_id = recipient.id ' +
            'WHERE event.date >= ? AND event.date <= ? ' +
            'AND event.deleted_at IS NULL ' +
            whereStatements,
            [startDate, endDate, ...whereValues]
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

export async function searchGroupCleanupEvents(
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
        let whereStatements: string = '';
        let whereValues: string[] = [];
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
        if (organizationId !== undefined && !isBlank(organizationId)) {
            whereStatements += ' AND cleanup.organization_id = ? ';
            whereValues.push(organizationId);
        }
        if (cleanupLocationId !== undefined && !isBlank(cleanupLocationId)) {
            whereStatements += ' AND cleanup.location_id = ? ';
            whereValues.push(cleanupLocationId);
        }
        if (volCountMin !== undefined && !isBlank(volCountMin)) {
            whereStatements += ' AND cleanup.volunteer_count >= ? ';
            whereValues.push(volCountMin);
        }
        if (volCountMax !== undefined && !isBlank(volCountMax)) {
            whereStatements += ' AND cleanup.volunteer_count <= ? ';
            whereValues.push(volCountMax);
        }
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
            'INNER JOIN cleanup_locations location ON cleanup.location_id = location.id ' +
            'INNER JOIN organizations org ON cleanup.organization_id = org.id ' +
            'WHERE date >= ? AND date <= ? ' +
            'AND cleanup.deleted_at IS NULL ' +
            whereStatements,
            [startDate, endDate, ...whereValues]
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

export async function searchRoadsideLitterEvents(
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
        let whereStatements: string = '';
        let whereValues: string[] = [];
        let havingStatements: string = '';
        let havingValues: string[] = [];
        let districtsInnerJoin: string = '';
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
            districtsInnerJoin = 'INNER JOIN roadside_litter_districts district ON cleanup.id = district.roadside_litter_cleanup_id '
        }
        if (location !== undefined && !isBlank(location)) {
            whereStatements += ` AND MATCH(cleanup.locations) AGAINST (? IN NATURAL LANGUAGE MODE) `;
            whereValues.push(location);
        }
        if (bulkyItemCountMin !== undefined && !isBlank(bulkyItemCountMin)) {
            havingStatements += ' COUNT(items.id) >= ? AND ';
            havingValues.push(bulkyItemCountMin);
        }
        if (bulkyItemCountMax !== undefined && !isBlank(bulkyItemCountMax)) {
            havingStatements += ' COUNT(items.id) <= ? ';
            havingValues.push(bulkyItemCountMax);
        } else if (havingValues.length > 0) {
            havingStatements = havingStatements.slice(0, -4); // Remove 'AND '
        }
        if (havingStatements !== '') {
            havingStatements = ` HAVING ${havingStatements}`;
        }
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
                'COALESCE(SUM(items.quantity), 0) AS bulkyItemCount, ' +
                'districts_by_cleanup.districts ' +
            'FROM roadside_litter_cleanups cleanup ' +
            districtsInnerJoin +
            ' INNER JOIN districts_by_cleanup ON cleanup.id = districts_by_cleanup.roadside_litter_cleanup_id ' +
            'LEFT JOIN roadside_litter_bulky_items items ON cleanup.id = items.roadside_litter_cleanup_id ' +
            'WHERE cleanup.date >= ? AND cleanup.date <= ? ' +
            'AND cleanup.deleted_at IS NULL ' +
            whereStatements +
            ' GROUP BY cleanup.id ' +
            havingStatements,
            [ startDate, endDate, startDate, endDate, ...whereValues, ...havingValues]
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

export async function searchTrashRoutesEvents(
    startDate: string, endDate: string,
    trashLbsMin: string | undefined, trashLbsMax: string | undefined,
    recyclingLbsMin: string | undefined, recyclingLbsMax: string | undefined
): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
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
        const [result] = await conn.execute(
            'SELECT id, ' +
                `CONCAT(DATE(date), '') AS date, ` +
                'trash_lbs AS trashLbs, ' +
                'recycling_lbs AS recyclingLbs ' +
            'FROM trash_can_routes ' +
            'WHERE date >= ? AND date <= ? ' +
            'AND deleted_at IS NULL ' +
            whereStatements,
            [startDate, endDate, ...whereValues]
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

export async function searchTreePlantingEvents(
    startDate: string, endDate: string,
    treeMin: string | undefined, treeMax: string | undefined,
    volCountMin: string | undefined, volCountMax: string | undefined,
    eventDesc: string | undefined
): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
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
        const [result] = await conn.execute(
            'SELECT id, ' +
                `CONCAT(DATE(date), '') AS date, ` +
                'tree_count AS treeCount, ' +
                'volunteer_count AS volunteerCount, ' +
                'volunteer_hours AS volunteerHours, ' +
                'event_desc AS eventDesc ' +
            'FROM tree_planting_events ' +
            'WHERE date >= ? AND date <= ? ' +
            'AND deleted_at IS NULL ' +
            whereStatements,
            [startDate, endDate, ...whereValues]
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