'use server'

import { testConnection } from './lib/sql';

export async function isDatabaseOperational(): Promise<boolean> {
    return await testConnection();
}