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
            conn.query('ROLLBACK');
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
            conn.query('ROLLBACK');
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

// TODO: Implement UPDATE logic
export async function updateAdoptASpotEvent(event: AdoptASpotEventEntity): Promise<number> {
    console.log('Updating Adopt-a-Spot Event...');
    return -1;
}

// TODO: Implement UPDATE logic
export async function updateBagSwapEvent(event: BagSwapEventEntity): Promise<number> {
    console.log('Updating Bag Swap Event...');
    return -1;
}

// TODO: Implement UPDATE logic
export async function updateCleanTeamEvent(event: CleanTeamEventEntity): Promise<any> {
    console.log('Updating Clean Team Event...');
    return -1;
}

// TODO: Implement UPDATE logic
export async function updateCountyCleanupEvent(event: CountyCleanupEventEntity, bulkyItems: BulkyItemEntity[]): Promise<any> {
    console.log('Updating County Cleanup Event...');
    return -1;
}

// TODO: Implement UPDATE logic
export async function updateEducationEvent(event: EducationEventEntity): Promise<number> {
    console.log('Updating Education Event...');
    return -1;
}

// TODO: Implement UPDATE logic
export async function updateGroupCleanupEvent(event: GroupCleanupEventEntity): Promise<number> {
    console.log('Updating Group Cleanup Event...');
    return -1;
}

// TODO: Implement UPDATE logic
export async function updateRoadsideLitterEvent(event: RoadsideLitterEventEntity, districts: DistrictEntity[], bulkyItems: BulkyItemEntity[]): Promise<number> {
    console.log('Updating Roadside Litter Event...');
    return -1;
}

// TODO: Implement UPDATE logic
export async function updateTrashRoutesEvent(event: TrashRoutesEventEntity): Promise<number> {
    console.log('Updating Trash Can Routes Event...');
    return -1;
}

// TODO: Implement UPDATE logic
export async function updateTreePlantingEvent(event: TreePlantingEventEntity): Promise<number> {
    console.log('Updating Tree Planting Event...');
    return -1;
}