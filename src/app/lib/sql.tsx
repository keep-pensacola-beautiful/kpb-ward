'use server'

import { getConnection, closeConnection } from '@/src/app/lib/database-connector';

export async function testConnection(): Promise<boolean> {
    let conn;
    try {
        conn = await getConnection();
        const [result]: any = await conn.execute(`SELECT 'true' AS connected`);
        conn.release();
        return result[0].connected === 'true';
    } catch (err) {
        return false;
    }
}