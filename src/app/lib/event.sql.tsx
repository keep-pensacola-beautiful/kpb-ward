import { getConnection, closeConnection } from '@/src/app/lib/database-connector';
import { AdoptASpotEventEntity } from '../entities/event/adoptASpotEvent.entity';
import { BagSwapEventEntity } from '../entities/event/bagSwapEvent.entity';
import { BulkyItemEntity } from '../entities/bulkyItem.entity';
import { CleanTeamEventEntity } from '../entities/event/cleanTeamEvent.entity';
import { CountyCleanupEventEntity } from '../entities/event/countyCleanupEvent.entity';
import { DistrictEntity } from '../entities/district.entity';
import { EducationEventEntity } from '../entities/event/educationEvent.entity';
import { GroupCleanupEventEntity } from '../entities/event/groupCleanupEvent.entity';
import { RoadsideLitterEventEntity } from '../entities/event/roadsideLitterEvent.entity';
import { TrashRoutesEventEntity } from '../entities/event/trashRoutesEvent.entity';
import { TreePlantingEventEntity } from '../entities/event/treePlantingEvent.entity';
import { QueryResult } from 'mysql2';

export async function deleteAdoptASpotEventById(id: number): Promise<number> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            'UPDATE adopt_a_spot_cleanups ' +
            'SET deleted_at = NOW() ' +
            'WHERE id = ? ' +
            'AND deleted_at IS NULL',
            [ id ]
        );
        conn.release();
        return result.affectedRows;
    } catch (err) {
        console.error(`Error: Unable to delete Adopt-a-Spot Cleanup event (id=${id}): ${err}`);
        return -1;
    }
}

export async function deleteBagSwapEventById(id: number): Promise<number> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            'UPDATE bag_swap_events ' +
            'SET deleted_at = NOW() ' +
            'WHERE id = ? ' +
            'AND deleted_at IS NULL',
            [ id ]
        );
        conn.release();
        return result.affectedRows;
    } catch (err) {
        console.error(`Error: Unable to delete Bag Swap event (id=${id}): ${err}`);
        return -1;
    }
}

export async function deleteCleanTeamEventById(id: number): Promise<number> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            'UPDATE clean_team_events ' +
            'SET deleted_at = NOW() ' +
            'WHERE id = ? ' +
            'AND deleted_at IS NULL',
            [ id ]
        );
        conn.release();
        return result.affectedRows;
    } catch (err) {
        console.error(`Error: Unable to delete Clean Team event (id=${id}): ${err}`);
        return -1;
    }
}

export async function deleteCountyCleanupEventById(id: number): Promise<number> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            'UPDATE county_cleanups ' +
            'SET deleted_at = NOW() ' +
            'WHERE id = ? ' +
            'AND deleted_at IS NULL',
            [ id ]
        );
        if (result.affectedRows === 1) {
            await conn.execute(
                'UPDATE county_cleanups_bulky_items ' +
                'SET deleted_at = NOW() ' +
                'WHERE county_cleanup_id = ? ' +
                'AND deleted_at IS NULL',
                [ id ]
            );
        }
        conn.release();
        return result.affectedRows;
    } catch (err) {
        console.error(`Error: Unable to delete County Cleanup event (id=${id}) and associated bulky items: ${err}`);
        return -1;
    }
}

export async function deleteEducationEventById(id: number): Promise<number> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            'UPDATE education_events ' +
            'SET deleted_at = NOW() ' +
            'WHERE id = ? ' +
            'AND deleted_at IS NULL',
            [ id ]
        );
        conn.release();
        return result.affectedRows;
    } catch (err) {
        console.error(`Error: Unable to delete Education event (id=${id}): ${err}`);
        return -1;
    }
}

export async function deleteGroupCleanupEventById(id: number): Promise<number> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            'UPDATE group_cleanups ' +
            'SET deleted_at = NOW() ' +
            'WHERE id = ? ' +
            'AND deleted_at IS NULL',
            [ id ]
        );
        conn.release();
        return result.affectedRows;
    } catch (err) {
        console.error(`Error: Unable to delete Group Cleanup (id=${id}) event: ${err}`);
        return -1;
    }
}

export async function deleteRoadsiteLitterEventById(id: number): Promise<number> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            'UPDATE roadside_litter_cleanups ' +
            'SET deleted_at = NOW() ' +
            'WHERE id = ? ' +
            'AND deleted_at IS NULL',
            [ id ]
        );
        if (result.affectedRows === 1) {
            await conn.execute(
                'UPDATE roadside_litter_bulky_items ' +
                'SET deleted_at = NOW() ' +
                'WHERE roadside_litter_cleanup_id = ? ' +
                'AND deleted_at IS NULL',
                [ id ]
            );
            await conn.execute(
                'UPDATE roadside_litter_districts ' +
                'SET deleted_at = NOW() ' +
                'WHERE roadside_litter_cleanup_id = ? ' +
                'AND deleted_at IS NULL',
                [ id ]
            );
        }
        conn.release();
        return result.affectedRows;
    } catch (err) {
        console.error(`Error: Unable to delete Roadside Litter event (id=${id}) and associated bulky items: ${err}`);
        return -1;
    }
}

export async function deleteTrashRoutesEventById(id: number): Promise<number> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            'UPDATE trash_can_routes ' +
            'SET deleted_at = NOW() ' +
            'WHERE id = ? ' +
            'AND deleted_at IS NULL',
            [ id ]
        );
        conn.release();
        return result.affectedRows;
    } catch (err) {
        console.error(`Error: Unable to delete Trash Can Routes event (id=${id}): ${err}`);
        return -1;
    }
}

export async function deleteTreePlantingEventById(id: number): Promise<number> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            'UPDATE tree_planting_events ' +
            'SET deleted_at = NOW() ' +
            'WHERE id = ? ' +
            'AND deleted_at IS NULL',
            [ id ]
        );
        conn.release();
        return result.affectedRows;
    } catch (err) {
        console.error(`Error: Unable to delete Tree Planting event (id=${id}): ${err}`);
        return -1;
    }
}

export async function getAdoptASpotEventById(id: number): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            `SELECT cleanup.id, CONCAT(DATE(cleanup.date), '') AS date, ` +
                'cleanup.litter_lbs AS litterLbs, cleanup.recycling_lbs AS recyclingLbs, ' +
                'cleanup.volunteer_count AS volunteerCount, cleanup.volunteer_hours AS volunteerHours, ' + 
                'cleanup.assignment_id AS spotId, assignment.group_name AS spotGroupName, assignment.location AS spotLocation ' +
            'FROM adopt_a_spot_cleanups cleanup ' +
            'INNER JOIN adopt_a_spot_assignments assignment ON cleanup.assignment_id = assignment.id ' +
            'WHERE cleanup.id = ? ' +
            'AND cleanup.deleted_at IS NULL',
            [ id ]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to get Adopt-a-Spot event: ${err}`);
        return null;
    }
}

export async function getBagSwapEventById(id: number): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            `SELECT id, CONCAT(DATE(date), '') AS date, ` +
                'bag_count AS bagCount, event_desc AS eventDesc, ' +
                'volunteer_count AS volunteerCount, volunteer_hours AS volunteerHours ' + 
            'FROM bag_swap_events ' +
            'WHERE id = ? ' +
            'AND deleted_at IS NULL',
            [ id ]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to get Bag Swap event: ${err}`);
        return null;
    }
}

export async function getCleanTeamEventById(id: number): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            `SELECT id, CONCAT(DATE(date), '') AS date, trash_lbs, recycling_lbs, event_desc ` +
            'FROM clean_team_events ' +
            'WHERE id = ? ' +
            'AND deleted_at IS NULL',
            [ id ]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to get Clean Team event: ${err}`);
        return null;
    }
}

export async function getCountyCleanupEventById(id: number): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            `SELECT id, CONCAT(DATE(date), '') AS date, tire_count AS tireCount, tire_lbs AS tireLbs, ` +
                'paint_can_and_household_chemical_count AS paintCanAndHouseholdChemicalCount, ' +
                'paint_can_and_household_chemical_lbs AS paintCanAndHouseholdChemicalLbs, ' +
                'bulky_items_lbs AS bulkyItemsLbs ' +
            'FROM county_cleanups ' +
            'WHERE id = ? ' +
            'AND deleted_at IS NULL',
            [ id ]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to get County Cleanup event: ${err}`);
        return null;
    }
}

export async function getEducationEventById(id: number): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            `SELECT event.id, CONCAT(DATE(event.date), '') AS date, ` +
                'event.event_length AS eventLength, event.student_count AS studentCount, ' +
                'event.volunteer_count AS volunteerCount, event.volunteer_hours AS volunteerHours, ' + 
                'event.recipient_id AS recipientId, recipient.name AS recipient, ' +
                'event.topic_id AS topicId, topic.topic AS topic ' +
            'FROM education_events event ' +
            'INNER JOIN education_recipients recipient ON event.recipient_id = recipient.id ' +
            'INNER JOIN education_topics topic ON event.topic_id = topic.id ' +
            'WHERE event.id = ? ' +
            'AND event.deleted_at IS NULL',
            [ id ]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to get Education event: ${err}`);
        return null;
    }
}

export async function getGroupCleanupEventById(id: number): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            `SELECT cleanup.id, CONCAT(DATE(cleanup.date), '') AS date, ` +
                'cleanup.litter_lbs AS litterLbs, cleanup.recycling_lbs AS recyclingLbs, ' +
                'cleanup.volunteer_count AS volunteerCount, cleanup.volunteer_hours AS volunteerHours, ' + 
                'cleanup.organization_id AS organizationId, org.name AS organization, ' +
                'cleanup.location_id AS locationId, loc.location AS location ' +
            'FROM group_cleanups cleanup ' +
            'INNER JOIN organizations org ON cleanup.organization_id = org.id ' +
            'INNER JOIN cleanup_locations loc ON cleanup.location_id = loc.id ' +
            'WHERE cleanup.id = ? ' +
            'AND cleanup.deleted_at IS NULL',
            [ id ]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to get Group Cleanup event: ${err}`);
        return null;
    }
}

export async function getRoadsideLitterEventById(id: number): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            `SELECT id, CONCAT(DATE(date), '') AS date, litter_lbs AS litterLbs, recycling_lbs AS recyclingLbs, locations ` +
            'FROM roadside_litter_cleanups ' +
            'WHERE id = ? ' +
            'AND deleted_at IS NULL',
            [ id ]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to get Roadside Litter event: ${err}`);
        return null;
    }
}

export async function getTrashRoutesEventById(id: number): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            `SELECT id, CONCAT(DATE(date), '') AS date, trash_lbs AS trashLbs, recycling_lbs AS recyclingLbs ` +
            'FROM trash_can_routes ' +
            'WHERE id = ? ' +
            'AND deleted_at IS NULL',
            [ id ]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to get Trash Can Routes event: ${err}`);
        return null;
    }
}

export async function getTreePlantingEventById(id: number): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            `SELECT id, CONCAT(DATE(date), '') AS date, ` +
                'tree_count AS treeCount, event_desc AS eventDesc, ' +
                'volunteer_count AS volunteerCount, volunteer_hours AS volunteerHours ' + 
            'FROM tree_planting_events ' +
            'WHERE id = ? ' +
            'AND deleted_at IS NULL',
            [ id ]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to get Tree Planting event: ${err}`);
        return null;
    }
}

export async function insertAdoptASpotEvent(event: AdoptASpotEventEntity): Promise<number> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            'INSERT INTO adopt_a_spot_cleanups (assignment_id, date, volunteer_count, volunteer_hours, litter_lbs, recycling_lbs) ' +
            'VALUES (?, ?, ?, ?, ?, ?)',
            [ event.assignmentId, event.date, event.volunteerCount, event.volunteerHours, event.litterLbs, event.recyclingLbs ]
        );
        conn.release();
        return result.insertId;
    } catch (err) {
        console.error(`Error: Unable to insert Adopt-a-Spot event: ${err}`);
        return -1;
    }
}

export async function insertBagSwapEvent(event: BagSwapEventEntity): Promise<number> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            'INSERT INTO bag_swap_events (date, bag_count, event_desc, volunteer_count, volunteer_hours) ' +
            'VALUES (?, ?, ?, ?, ?)',
            [ event.date, event.bagCount, event.eventDesc, event.volunteerCount, event.volunteerHours ]
        );
        conn.release();
        return result.insertId;
    } catch (err) {
        console.error(`Error: Unable to insert Bag Swap event: ${err}`);
        return -1;
    }
}

export async function insertCleanTeamEvent(event: CleanTeamEventEntity): Promise<number> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            'INSERT INTO clean_team_events (date, event_desc, trash_lbs, recycling_lbs) ' +
            'VALUES (?, ?, ?, ?)',
            [ event.date, event.eventDesc, event.trashLbs, event.recyclingLbs ]
        );
        conn.release();
        return result.insertId;
    } catch (err) {
        console.error(`Error: Unable to insert Clean Team event: ${err}`);
        return -1;
    }
}

export async function insertCountyCleanupEvent(event: CountyCleanupEventEntity, bulkyItems: BulkyItemEntity[]): Promise<number> {
    let conn = null;
    try {
        conn = await getConnection();
        await conn.query('START TRANSACTION');
        const [result]: any = await conn.execute(
            'INSERT INTO county_cleanups (date, tire_count, tire_lbs, ' +
                'paint_can_and_household_chemical_count, paint_can_and_household_chemical_lbs, ' +
                'bulky_items_lbs) ' +
            'VALUES (?, ?, ?, ?, ?, ?)',
            [ 
                event.date, event.tireCount, event.tireLbs,
                event.paintCanAndHouseholdChemicalCount, event.paintCanAndHouseholdChemicalLbs,
                event.bulkyItemsLbs
            ]
        );
        if (result && result.insertId && bulkyItems.length > 0) {
            let bulkyItemValuePlaceholders: string = '';
            let bulkyItemValues: any[] = [];
            bulkyItems.map((item) => {
                bulkyItemValuePlaceholders += ' (?, ?, ?),';
                bulkyItemValues.push(item.bulkyItemRefId);
                bulkyItemValues.push(result.insertId);
                bulkyItemValues.push(item.quantity);
            });
            await conn.execute(
                'INSERT INTO county_cleanups_bulky_items (bulky_item_ref_id, county_cleanup_id, quantity) ' +
                `VALUES${bulkyItemValuePlaceholders.slice(0, -1)}`,
                bulkyItemValues
            );
        }
        await conn.query('COMMIT');
        conn.release();
        return result.insertId;
    } catch (err) {
        console.error(`Error: Unable to insert County Cleanup event: ${err}`);
        if (conn) {
            await conn.query('ROLLBACK');
            conn.release();
        }
        return -1;
    }
}

export async function insertEducationEvent(event: EducationEventEntity): Promise<number> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            'INSERT INTO education_events (topic_id, recipient_id, date, event_length, student_count, volunteer_count, volunteer_hours) ' +
            'VALUES (?, ?, ?, ?, ?, ?, ?)',
            [ event.topicId, event.recipientId, event.date, event.eventLength, event.studentCount, event.volunteerCount, event.volunteerHours ]
        );
        conn.release();
        return result.insertId;
    } catch (err) {
        console.error(`Error: Unable to insert Education event: ${err}`);
        return -1;
    }
}

export async function insertGroupCleanupEvent(event: GroupCleanupEventEntity): Promise<number> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            'INSERT INTO group_cleanups (organization_id, location_id, date, volunteer_count, volunteer_hours, litter_lbs, recycling_lbs) ' +
            'VALUES (?, ?, ?, ?, ?, ?, ?)',
            [ event.organizationId, event.locationId, event.date, event.volunteerCount, event.volunteerHours, event.litterLbs, event.recyclingLbs ]
        );
        conn.release();
        return result.insertId;
    } catch (err) {
        console.error(`Error: Unable to insert Group Cleanup event: ${err}`);
        return -1;
    }
}

export async function insertRoadsideLitterEvent(event: RoadsideLitterEventEntity, districts: DistrictEntity[], bulkyItems: BulkyItemEntity[]): Promise<number> {
    let conn = null;
    try {
        conn = await getConnection();
        await conn.query('START TRANSACTION');
        const [result]: any = await conn.execute(
            'INSERT INTO roadside_litter_cleanups (date, litter_lbs, recycling_lbs, locations) ' +
            'VALUES (?, ?, ?, ?)',
            [ event.date, event.litterLbs, event.recyclingLbs, event.locations ]
        );
        if (result && result.insertId  && (districts.length > 0 || bulkyItems.length > 0)) {
            if (districts.length > 0) {
                let districtValuePlaceholders: string = '';
                let districtValues: any[] = [];
                districts.map((district) => {
                    districtValuePlaceholders += ' (?, ?),';
                    districtValues.push(result.insertId);
                    districtValues.push(district.districtCode);
                });
                await conn.execute(
                    'INSERT INTO roadside_litter_districts (roadside_litter_cleanup_id, district_code) ' +
                    `VALUES${districtValuePlaceholders.slice(0, -1)}`,
                    districtValues
                );
            }
            if (bulkyItems.length > 0) {
                let bulkyItemValuePlaceholders: string = '';
                let bulkyItemValues: any[] = [];
                bulkyItems.map((item) => {
                    bulkyItemValuePlaceholders += ' (?, ?, ?),';
                    bulkyItemValues.push(item.bulkyItemRefId);
                    bulkyItemValues.push(result.insertId);
                    bulkyItemValues.push(item.quantity);
                });
                await conn.execute(
                    'INSERT INTO roadside_litter_bulky_items (bulky_item_ref_id, roadside_litter_cleanup_id, quantity) ' +
                    `VALUES${bulkyItemValuePlaceholders.slice(0, -1)}`,
                    bulkyItemValues
                );
            }
        }
        await conn.query('COMMIT');
        conn.release();
        return result.insertId;
    } catch (err) {
        console.error(`Error: Unable to insert Roadside Litter event: ${err}`);
        if (conn) {
            await conn.query('ROLLBACK');
            conn.release();
        }
        return -1;
    }
}

export async function insertTrashRoutesEvent(event: TrashRoutesEventEntity): Promise<number> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            'INSERT INTO trash_can_routes (date, trash_lbs, recycling_lbs) ' +
            'VALUES (?, ?, ?)',
            [ event.date, event.trashLbs, event.recyclingLbs ]
        );
        conn.release();
        return result.insertId;
    } catch (err) {
        console.error(`Error: Unable to insert Trash Routes event: ${err}`);
        return -1;
    }
}

export async function insertTreePlantingEvent(event: TreePlantingEventEntity): Promise<number> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            'INSERT INTO tree_planting_events (date, tree_count, event_desc, volunteer_count, volunteer_hours) ' +
            'VALUES (?, ?, ?, ?, ?)',
            [ event.date, event.treeCount, event.eventDesc, event.volunteerCount, event.volunteerHours ]
        );
        conn.release();
        return result.insertId;
    } catch (err) {
        console.error(`Error: Unable to insert Tree Planting event: ${err}`);
        return -1;
    }
}

export async function updateAdoptASpotEvent(event: AdoptASpotEventEntity): Promise<number> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            'UPDATE adopt_a_spot_cleanups ' +
            'SET date = ?, litter_lbs = ?, recycling_lbs = ?, ' +
                'volunteer_count = ?, volunteer_hours = ?, assignment_id = ? ' +
            'WHERE id = ? ' +
            'AND deleted_at IS NULL',
            [
                event.date, event.litterLbs, event.recyclingLbs,
                event.volunteerCount, event.volunteerHours, event.assignmentId,
                event.id
            ]
        );
        conn.release();
        return result.affectedRows;
    } catch (err) {
        console.error(`Error: Unable to update Adopt-a-Spot Cleanup event: ${err}`);
        return -1;
    }
}

export async function updateBagSwapEvent(event: BagSwapEventEntity): Promise<number> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            'UPDATE bag_swap_events ' +
            'SET date = ?, bag_count = ?, event_desc = ?, volunteer_count = ?, volunteer_hours = ? ' +
            'WHERE id = ? ' +
            'AND deleted_at IS NULL',
            [ event.date, event.bagCount, event.eventDesc, event.volunteerCount, event.volunteerHours, event.id ]
        );
        conn.release();
        return result.affectedRows;
    } catch (err) {
        console.error(`Error: Unable to update Bag Swap event: ${err}`);
        return -1;
    }
}

export async function updateCleanTeamEvent(event: CleanTeamEventEntity): Promise<number> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            'UPDATE clean_team_events ' +
            'SET date = ?, event_desc = ?, trash_lbs = ?, recycling_lbs = ? ' +
            'WHERE id = ? ' +
            'AND deleted_at IS NULL',
            [ event.date, event.eventDesc, event.trashLbs, event.recyclingLbs, event.id ]
        );
        conn.release();
        return result.affectedRows;
    } catch (err) {
        console.error(`Error: Unable to update Clean Team event: ${err}`);
        return -1;
    }
}

export async function updateCountyCleanupEvent(event: CountyCleanupEventEntity, bulkyItems: BulkyItemEntity[]): Promise<any> {
    let conn = null;
    try {
        conn = await getConnection();
        await conn.query('START TRANSACTION');
        const [result]: any = await conn.execute(
            'UPDATE county_cleanups ' +
            'SET date = ?, tire_count = ?, tire_lbs = ?, paint_can_and_household_chemical_count = ?, ' +
                'paint_can_and_household_chemical_lbs = ?, bulky_items_lbs = ? ' +
            'WHERE id = ? ' +
            'AND deleted_at IS NULL',
            [
                event.date, event.tireCount, event.tireLbs,
                event.paintCanAndHouseholdChemicalCount, event.paintCanAndHouseholdChemicalLbs,
                event.bulkyItemsLbs, event.id
            ]
        );
        let notInIds: number[] = [];
        let notInPlaceholder: string = '';
        let bulkyItemsToInsert: BulkyItemEntity[] = [];
        let bulkyItemsToUpdate: BulkyItemEntity[] = [];
        for (let i = 0; i < bulkyItems.length; i++) {
            if (bulkyItems[i].id === undefined || bulkyItems[i].id < 1) {
                bulkyItemsToInsert.push(bulkyItems[i])
            } else {
                bulkyItemsToUpdate.push(bulkyItems[i])
            }
        }
        // Update quantity of previously selected bulky items
        if (bulkyItemsToUpdate.length > 0) {
            notInPlaceholder = '(';
            for (let i = 0; i < bulkyItemsToUpdate.length; i++) {
                await conn.execute(
                    'UPDATE county_cleanups_bulky_items ' +
                    'SET quantity = ? ' +
                    'WHERE county_cleanup_id = ? AND id = ?',
                    [ bulkyItemsToUpdate[i].quantity, event.id, bulkyItemsToUpdate[i].id ]
                );
                notInIds.push(bulkyItemsToUpdate[i].id);
                notInPlaceholder += ' ?,'
            }
            notInPlaceholder = `${notInPlaceholder.slice(0, -1)})`; // Remove extra comma and add a right parenthesis
        }
        // Delete previously selected bulky items that were unselected
        if (notInPlaceholder !== '' && notInIds.length > 0) {
            await conn.execute(
                'DELETE FROM county_cleanups_bulky_items ' +
                'WHERE county_cleanup_id = ? ' +
                `AND id NOT IN ${notInPlaceholder}`,
                [ event.id, ...notInIds ]
            );
        }
        // Insert newly selected bulky items
        if (bulkyItemsToInsert.length > 0) {
            let bulkyItemValuePlaceholders: string = '';
            let bulkyItemValues: any[] = [];
            bulkyItemsToInsert.map((item) => {
                bulkyItemValuePlaceholders += ' (?, ?, ?),';
                bulkyItemValues.push(item.bulkyItemRefId);
                bulkyItemValues.push(event.id);
                bulkyItemValues.push(item.quantity);
            });
            const [result] = await conn.execute(
                'INSERT INTO county_cleanups_bulky_items (bulky_item_ref_id, county_cleanup_id, quantity) ' +
                `VALUES${bulkyItemValuePlaceholders.slice(0, -1)}`,
                bulkyItemValues
            );
        }
        await conn.query('COMMIT');
        conn.release();
        return result.affectedRows;
    } catch (err) {
        if (conn) {
            await conn.query('ROLLBACK');
            conn.release();
        }
        console.error(`Error: Unable to update County Cleanup event and associated bulky items: ${err}`);
        return -1;
    }
}

export async function updateEducationEvent(event: EducationEventEntity): Promise<number> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            'UPDATE education_events ' +
            'SET date = ?, student_count = ?, event_length = ?, volunteer_count = ?, volunteer_hours = ?, ' +
                'topic_id = ?, recipient_id = ? ' +
            'WHERE id = ? ' +
            'AND deleted_at IS NULL',
            [
                event.date, event.studentCount, event.eventLength, event.volunteerCount, event.volunteerHours,
                event.topicId, event.recipientId,
                event.id
            ]
        );
        conn.release();
        return result.affectedRows;
    } catch (err) {
        console.error(`Error: Unable to update Education event: ${err}`);
        return -1;
    }
}

export async function updateGroupCleanupEvent(event: GroupCleanupEventEntity): Promise<number> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            'UPDATE group_cleanups ' +
            'SET date = ?, litter_lbs = ?, recycling_lbs = ?, ' +
                'volunteer_count = ?, volunteer_hours = ?, organization_id = ?, location_id = ? ' +
            'WHERE id = ? ' +
            'AND deleted_at IS NULL',
            [
                event.date, event.litterLbs, event.recyclingLbs,
                event.volunteerCount, event.volunteerHours, event.organizationId, event.locationId,
                event.id
            ]
        );
        conn.release();
        return result.affectedRows;
    } catch (err) {
        console.error(`Error: Unable to update Group Cleanup event: ${err}`);
        return -1;
    }
}

export async function updateRoadsideLitterEvent(event: RoadsideLitterEventEntity, districts: DistrictEntity[], bulkyItems: BulkyItemEntity[]): Promise<number> {
    let conn = null;
    try {
        conn = await getConnection();
        await conn.query('START TRANSACTION');
        const [result]: any = await conn.execute(
            'UPDATE roadside_litter_cleanups ' +
            'SET date = ?, litter_lbs = ?, recycling_lbs = ?, locations = ? ' +
            'WHERE id = ? ' +
            'AND deleted_at IS NULL',
            [ event.date, event.litterLbs, event.recyclingLbs, event.locations, event.id ]
        );

        // HANDLE BULKY ITEMS
        let bulkyItemsNotInIds: number[] = [];
        let bulkyItemsNotInPlaceholder: string = '';
        let bulkyItemsToInsert: BulkyItemEntity[] = [];
        let bulkyItemsToUpdate: BulkyItemEntity[] = [];
        for (let i = 0; i < bulkyItems.length; i++) {
            if (bulkyItems[i].id === undefined || bulkyItems[i].id < 1) {
                bulkyItemsToInsert.push(bulkyItems[i])
            } else {
                bulkyItemsToUpdate.push(bulkyItems[i])
            }
        }

        // Update quantity of previously selected bulky items
        if (bulkyItemsToUpdate.length > 0) {
            bulkyItemsNotInPlaceholder = '(';
            for (let i = 0; i < bulkyItemsToUpdate.length; i++) {
                await conn.execute(
                    'UPDATE roadside_litter_bulky_items ' +
                    'SET quantity = ? ' +
                    'WHERE roadside_litter_cleanup_id = ? AND id = ?',
                    [ bulkyItemsToUpdate[i].quantity, event.id, bulkyItemsToUpdate[i].id ]
                );
                bulkyItemsNotInIds.push(bulkyItemsToUpdate[i].id);
                bulkyItemsNotInPlaceholder += ' ?,'
            }
            bulkyItemsNotInPlaceholder = `${bulkyItemsNotInPlaceholder.slice(0, -1)})`; // Remove extra comma and add a right parenthesis
        }
        // Delete previously selected bulky items that were unselected
        if (bulkyItemsNotInPlaceholder !== '' && bulkyItemsNotInIds.length > 0) {
            await conn.execute(
                'DELETE FROM roadside_litter_bulky_items ' +
                'WHERE roadside_litter_cleanup_id = ? ' +
                `AND id NOT IN ${bulkyItemsNotInPlaceholder}`,
                [ event.id, ...bulkyItemsNotInIds ]
            );
        }
        // Insert newly selected bulky items
        if (bulkyItemsToInsert.length > 0) {
            let bulkyItemValuePlaceholders: string = '';
            let bulkyItemValues: any[] = [];
            bulkyItemsToInsert.map((item) => {
                bulkyItemValuePlaceholders += ' (?, ?, ?),';
                bulkyItemValues.push(item.bulkyItemRefId);
                bulkyItemValues.push(event.id);
                bulkyItemValues.push(item.quantity);
            });
            const [result] = await conn.execute(
                'INSERT INTO roadside_litter_bulky_items (bulky_item_ref_id, roadside_litter_cleanup_id, quantity) ' +
                `VALUES ${bulkyItemValuePlaceholders.slice(0, -1)}`,
                bulkyItemValues
            );
        }

        // HANDLE DISTRICTS
        let districtsNotInIds: number[] = [];
        let districtsNotInPlaceholder: string = '(';
        let newlySelectedDistricts: DistrictEntity[] = [];
        for (let i = 0; i < districts.length; i++) {
            // any district that already has an ID already exists in the database
            if (districts[i].id !== undefined && districts[i].id >= 1) {
                districtsNotInIds.push(districts[i].id);
                districtsNotInPlaceholder += ' ?,'
            } else {
                newlySelectedDistricts.push(districts[i])
            }
        }
        districtsNotInPlaceholder = `${districtsNotInPlaceholder.slice(0, -1)})`; // Remove extra comma and add a right parenthesis
        
        // Delete previously selected districts that were unselected
        if (districtsNotInPlaceholder !== '' && districtsNotInIds.length > 0) {
            await conn.execute(
                'DELETE FROM roadside_litter_districts ' +
                'WHERE roadside_litter_cleanup_id = ? ' +
                `AND id NOT IN ${districtsNotInPlaceholder}`,
                [ event.id, ...districtsNotInIds ]
            );
        }
        // Insert newly selected districts
        if (newlySelectedDistricts.length > 0) {
            let districtValuePlaceholders: string = '';
            let districtValues: any[] = [];
            newlySelectedDistricts.map((district) => {
                districtValuePlaceholders += ' (?, ?),';
                districtValues.push(district.districtCode);
                districtValues.push(event.id);
            });
            const [result] = await conn.execute(
                'INSERT INTO roadside_litter_districts (district_code, roadside_litter_cleanup_id) ' +
                `VALUES ${districtValuePlaceholders.slice(0, -1)}`,
                districtValues
            );
        }

        await conn.query('COMMIT');
        conn.release();
        return result.affectedRows;
    } catch (err) {
        if (conn) {
            await conn.query('ROLLBACK');
            conn.release();
        }
        console.error(`Error: Unable to update Roadside Litter event and associated bulky items and districts: ${err}`);
        console.error(err);
        return -1;
    }
}

export async function updateTrashRoutesEvent(event: TrashRoutesEventEntity): Promise<number> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            'UPDATE trash_can_routes ' +
            'SET date = ?, trash_lbs = ?, recycling_lbs = ? ' +
            'WHERE id = ? ' +
            'AND deleted_at IS NULL',
            [ event.date, event.trashLbs, event.recyclingLbs, event.id ]
        );
        conn.release();
        return result.affectedRows;
    } catch (err) {
        console.error(`Error: Unable to update Trash Can Routes event: ${err}`);
        return -1;
    }
}

export async function updateTreePlantingEvent(event: TreePlantingEventEntity): Promise<number> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            'UPDATE tree_planting_events ' +
            'SET date = ?, tree_count = ?, event_desc = ?, volunteer_count = ?, volunteer_hours = ? ' +
            'WHERE id = ? ' +
            'AND deleted_at IS NULL',
            [ event.date, event.treeCount, event.eventDesc, event.volunteerCount, event.volunteerHours, event.id ]
        );
        conn.release();
        return result.affectedRows;
    } catch (err) {
        console.error(`Error: Unable to update Tree Planting event: ${err}`);
        return -1;
    }
}