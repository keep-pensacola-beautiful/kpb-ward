import { getConnection, closeConnection } from '@/src/app/lib/database-connector';
import { QueryResult } from 'mysql2';

export async function getCountyCleanupBulkyItemsByEventId(eventId: number): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            'SELECT item.id, item.bulky_item_ref_id AS bulkyItemRefId, itemRef.description, item.quantity ' +
            'FROM county_cleanups_bulky_items item ' +
            'INNER JOIN bulky_items_reference itemRef ON item.bulky_item_ref_id = itemRef.id ' +
            'WHERE item.county_cleanup_id = ? ' +
            'AND item.deleted_at IS NULL',
            [ eventId ]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to get County Cleanup Bulky Items: ${err}`);
        return null;
    }
}

export async function getRoadsideLitterBulkyItemsByEventId(eventId: number): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            'SELECT item.id, item.bulky_item_ref_id AS bulkyItemRefId, itemRef.description, item.quantity ' +
            'FROM roadside_litter_bulky_items item ' +
            'INNER JOIN bulky_items_reference itemRef ON item.bulky_item_ref_id = itemRef.id ' +
            'WHERE item.roadside_litter_cleanup_id = ? ' +
            'AND item.deleted_at IS NULL',
            [ eventId ]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to get Roadside Litter Bulky Items: ${err}`);
        return null;
    }
}