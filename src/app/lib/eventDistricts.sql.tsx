import { getConnection, closeConnection } from '@/src/app/lib/database-connector';
import { QueryResult } from 'mysql2';

export async function getRoadsideLitterDistrictsByEventId(eventId: number): Promise<QueryResult | null> {
    let conn = null;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(
            'SELECT district.id, district.district_code AS districtCode, districtRef.description ' +
            'FROM roadside_litter_districts district ' +
            'INNER JOIN district_reference districtRef ON district.district_code = districtRef.code ' +
            'WHERE district.roadside_litter_cleanup_id = ? ' +
            'AND district.deleted_at IS NULL',
            [ eventId ]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to get Roadside Litter Districts: ${err}`);
        return null;
    }
}