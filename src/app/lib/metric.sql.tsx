import { getConnection, closeConnection } from '@/src/app/lib/database-connector';
import { QueryResult } from 'mysql2/promise';
import { IntervalCode } from '../models/metrics';
import { getFirstMonthOfQuarter } from '../utils/getFirstMonthOfQuarter';

export async function callTotalMetricsStoredProcedure(
    startMonth: number,
    endMonth: number,
    startYear: number,
    endYear: number,
    storedProcedure: string
): Promise<QueryResult | null> {
    let conn = null;
    try {
        if (!/^([a-z_()?(,.)]+)$/.test(storedProcedure)) {
            throw new Error(
                'Stored Procedure to get total metrics has invalid characters. ' +
                'Only lowercase letters, underscores, parentheses, question marks, commas, and periods are allowed.'
            );
        }
        conn = await getConnection();
        const [result] = await conn.execute(
            `CALL ${storedProcedure}`,
            [startYear, endYear, startMonth, endMonth]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to call stored procedure to get total metrics: ${err}`);
        if (conn) {
            conn.release();
        }
        return null;
    }
}

export async function getBulkyItemCountByInterval(
    interval: IntervalCode,
    timeFilters: {
        startMonth?: number,
        endMonth?: number,
        startQuarter?: number,
        endQuarter?: number,
        startYear: number,
        endYear: number
    },
    bulkyItemTable: string,
    eventTable: string,
    bulkyItemToEventCol: string
): Promise<QueryResult | null> {
    let conn = null;
    try {
        if (!/^([a-z_]+)$/.test(bulkyItemTable)) {
            throw new Error(
                'Bulky Item table name to retrieve most collected bulky items from has invalid characters. ' +
                'Only lowercase letters and underscores are allowed.'
            );
        }
        if (!/^([a-z_]+)$/.test(eventTable)) {
            throw new Error(
                'Event table name to retrieve most collected bulky items from has invalid characters. ' +
                'Only lowercase letters and underscores are allowed.'
            );
        }
        switch (interval) {
            case 'month':
                if (timeFilters.startMonth === undefined || timeFilters.endMonth === undefined) {
                    throw new Error('Missing start or end month when retrieving bulky item count metric by month interval.');
                }
                conn = await getConnection();
                const [monthResult] = await conn.execute(
                    'SELECT ' +
                        `CONCAT(MONTH(dates.month_date),'/',YEAR(dates.month_date)) AS label, ` +
                        `COALESCE(SUM(bulky_items.quantity), 0) AS value ` +
                    `FROM ${bulkyItemTable} AS bulky_items ` +
                    `INNER JOIN ${eventTable} AS event_table ON bulky_items.${bulkyItemToEventCol} = event_table.id ` +
                    'RIGHT JOIN ( ' +
                        `SELECT DATE_ADD(STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d'), INTERVAL n-1 MONTH) AS month_date ` +
                        'FROM tally ' +
                        'WHERE DATE_ADD( ' +
                                `STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d'),` +
                                `INTERVAL n-1 MONTH ` +
                            `) <= STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d') ` +
                    ') AS dates ' +
                        'ON YEAR(event_table.date) = YEAR(dates.month_date) ' +
                        'AND MONTH(event_table.date) = MONTH(dates.month_date) ' +
                    'GROUP BY label',
                    [
                        timeFilters.startYear, timeFilters.startMonth,
                        timeFilters.startYear, timeFilters.startMonth,
                        timeFilters.endYear, timeFilters.endMonth
                    ]
                );
                conn.release();
                return monthResult;
            case 'quarter':
                if (timeFilters.startQuarter === undefined || timeFilters.endQuarter === undefined) {
                    throw new Error('Missing start or end quarter when retrieving bulky item count metric by quarter interval.');
                }
                let firstMonthInStartQuarter: number = getFirstMonthOfQuarter(timeFilters.startQuarter);
                let firstMonthInEndQuarter: number = getFirstMonthOfQuarter(timeFilters.endQuarter);
                conn = await getConnection();
                const [quarterResult] = await conn.execute(
                    'SELECT ' +
                        `CONCAT('FY', YEAR(dates.quarter_date)+quarters.year_to_fy_adjuster,'-Q',quarters.kpb_quarter) AS label, ` +
                        `COALESCE(SUM(bulky_items.quantity), 0) AS value ` +
                    `FROM ${bulkyItemTable} AS bulky_items ` +
                    // 'INNER JOIN quarter_conversion_reference AS quarters ON QUARTER(metric_table.date) = quarters.code ' +
                    `INNER JOIN ${eventTable} AS event_table ON bulky_items.${bulkyItemToEventCol} = event_table.id ` +
                    'RIGHT JOIN ( ' +
                        `SELECT DATE_ADD(STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d'), INTERVAL n-1 QUARTER) AS quarter_date ` +
                        'FROM tally ' +
                        'WHERE DATE_ADD( ' +
                                `STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d'), ` +
                                'INTERVAL n-1 QUARTER ' +
                            `) <= STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d') ` +
                    ') AS dates ' +
                        `ON YEAR(event_table.date) = YEAR(dates.quarter_date) ` +
                        `AND QUARTER(event_table.date) = QUARTER(dates.quarter_date) ` +
                    'INNER JOIN quarter_conversion_reference AS quarters ON QUARTER(dates.quarter_date) = quarters.code ' +
                    // 'WHERE quarters.kpb_quarter >= ? ' +
                    // 'AND quarters.kpb_quarter <= ? ' +
                    // 'AND YEAR(event_table.date) >= ? ' +
                    // 'AND YEAR(event_table.date) <= ? ' +
                    'GROUP BY label',
                    [
                        timeFilters.startYear, firstMonthInStartQuarter,
                        timeFilters.startYear, firstMonthInStartQuarter,
                        timeFilters.endYear, firstMonthInEndQuarter
                    ]
                );
                conn.release();
                return quarterResult;
            case 'year':
                let month: number = getFirstMonthOfQuarter(4);
                conn = await getConnection();
                const [yearResult] = await conn.execute(
                    'SELECT ' +
                        `CONCAT('FY', YEAR(dates.quarter_date)+quarters.year_to_fy_adjuster) AS label, ` +
                        `COALESCE(SUM(bulky_items.quantity), 0) AS value ` +
                    `FROM ${bulkyItemTable} AS bulky_items ` +
                    `INNER JOIN ${eventTable} AS event_table ON bulky_items.${bulkyItemToEventCol} = event_table.id ` +
                    'RIGHT JOIN ( ' +
                        `SELECT DATE_ADD(STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d'), INTERVAL n-1 QUARTER) AS quarter_date ` +
                        'FROM tally ' +
                        'WHERE DATE_ADD( ' +
                                `STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d'), ` +
                                'INTERVAL n-1 QUARTER ' +
                            `) <= STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d') ` +
                    ') AS dates ' +
                        `ON YEAR(event_table.date) = YEAR(dates.quarter_date) ` +
                        `AND QUARTER(event_table.date) = QUARTER(dates.quarter_date) ` +
                    'INNER JOIN quarter_conversion_reference AS quarters ON QUARTER(dates.quarter_date) = quarters.code ' +
                    'GROUP BY label',
                    [
                        timeFilters.startYear, month,
                        timeFilters.startYear, month,
                        timeFilters.endYear, month
                    ]
                );
                conn.release();
                return yearResult;
        }
        return null;
    } catch (err) {
        console.error(`Error: Unable to get number of bulky items by ${interval} metric: ${err}`);
        if (conn) {
            conn.release();
        }
        return null;
    }
}

export async function getColumnSumAsMetricByInterval(
    interval: IntervalCode,
    timeFilters: {
        startMonth?: number,
        endMonth?: number,
        startQuarter?: number,
        endQuarter?: number,
        startYear: number,
        endYear: number
    },
    table: string,
    column: string
): Promise<QueryResult | null> {
    let conn = null;
    try {
        if (!/^([a-z_]+)$/.test(table)) {
            throw new Error(
                'Table name to retrieve metric from has invalid characters. ' +
                'Only lowercase letters and underscores are allowed.'
            );
        }
        if (!/^([a-z_]+)$/.test(column)) {
            throw new Error(
                'Column name to retrieve metric from has invalid characters. ' +
                'Only lowercase letters and underscores are allowed.'
            );
        }
        switch (interval) {
            case 'month':
                if (timeFilters.startMonth === undefined || timeFilters.endMonth === undefined) {
                    throw new Error('Missing start or end month when retrieving column sum as metric by month interval.');
                }
                conn = await getConnection();
                const [monthResult] = await conn.execute(
                    'SELECT ' +
                        `CONCAT(MONTH(dates.month_date),'/',YEAR(dates.month_date)) AS label, ` +
                        `COALESCE(SUM(metric_table.${column}), 0) AS value ` +
                    `FROM ${table} metric_table ` +
                    'RIGHT JOIN ( ' +
                        `SELECT DATE_ADD(STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d'), INTERVAL n-1 MONTH) AS month_date ` +
                        'FROM tally ' +
                        'WHERE DATE_ADD( ' +
                                `STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d'),` +
                                `INTERVAL n-1 MONTH ` +
                            `) <= STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d') ` +
                    ') AS dates ' +
                        'ON YEAR(metric_table.date) = YEAR(dates.month_date) ' +
                        'AND MONTH(metric_table.date) = MONTH(dates.month_date) ' +
                    'GROUP BY label',
                    [
                        timeFilters.startYear, timeFilters.startMonth,
                        timeFilters.startYear, timeFilters.startMonth,
                        timeFilters.endYear, timeFilters.endMonth
                    ]
                );
                conn.release();
                return monthResult;
            case 'quarter':
                if (timeFilters.startQuarter === undefined || timeFilters.endQuarter === undefined) {
                    throw new Error('Missing start or end quarter when retrieving column sum as metric by quarter interval.');
                }
                let firstMonthInStartQuarter: number = getFirstMonthOfQuarter(timeFilters.startQuarter);
                let firstMonthInEndQuarter: number = getFirstMonthOfQuarter(timeFilters.endQuarter);
                conn = await getConnection();
                const [quarterResult] = await conn.execute(
                    'SELECT ' +
                        `CONCAT('FY', YEAR(dates.quarter_date)+quarters.year_to_fy_adjuster,'-Q',quarters.kpb_quarter) AS label, ` +
                        `COALESCE(SUM(metric_table.${column}), 0) AS value ` +
                    `FROM ${table} AS metric_table ` +
                    'RIGHT JOIN ( ' +
                        `SELECT DATE_ADD(STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d'), INTERVAL n-1 QUARTER) AS quarter_date ` +
                        'FROM tally ' +
                        'WHERE DATE_ADD( ' +
                                `STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d'), ` +
                                'INTERVAL n-1 QUARTER ' +
                            `) <= STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d') ` +
                    ') AS dates ' +
                        `ON YEAR(metric_table.date) = YEAR(dates.quarter_date) ` +
                        `AND QUARTER(metric_table.date) = QUARTER(dates.quarter_date) ` +
                    'INNER JOIN quarter_conversion_reference AS quarters ON QUARTER(dates.quarter_date) = quarters.code ' +
                    'GROUP BY label',
                    [
                        timeFilters.startYear, firstMonthInStartQuarter,
                        timeFilters.startYear, firstMonthInStartQuarter,
                        timeFilters.endYear, firstMonthInEndQuarter
                    ]
                );
                conn.release();
                return quarterResult;
            case 'year':
                let month: number = getFirstMonthOfQuarter(4);
                conn = await getConnection();
                const [yearResult] = await conn.execute(
                    // `SELECT YEAR(dates.year_date) AS label, COALESCE(SUM(metric_table.${column}), 0) AS value ` +
                    // `FROM ${table} AS metric_table ` +
                    // 'RIGHT JOIN ( ' +
                    //     `SELECT DATE_ADD(STR_TO_DATE(CONCAT(?, '-', '01', '-01'), '%Y-%m-%d'), INTERVAL n-1 YEAR) AS year_date ` +
                    //     'FROM tally ' +
                    //     'WHERE DATE_ADD( ' +
                    //             `STR_TO_DATE(CONCAT(?, '-', '01', '-01'), '%Y-%m-%d'), ` +
                    //             'INTERVAL n-1 YEAR ' +
                    //         `) <= STR_TO_DATE(CONCAT(?, '-', '01', '-01'), '%Y-%m-%d') ` +
                    // ') AS dates ' +
                    //     `ON YEAR(metric_table.date) = YEAR(dates.year_date) ` +
                    // 'GROUP BY label'
                    
                    'SELECT ' +
                        `CONCAT('FY', YEAR(dates.quarter_date)+quarters.year_to_fy_adjuster) AS label, ` +
                        `COALESCE(SUM(metric_table.${column}), 0) AS value ` +
                    `FROM ${table} AS metric_table ` +
                    'RIGHT JOIN ( ' +
                        `SELECT DATE_ADD(STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d'), INTERVAL n-1 QUARTER) AS quarter_date ` +
                        'FROM tally ' +
                        'WHERE DATE_ADD( ' +
                                `STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d'), ` +
                                'INTERVAL n-1 QUARTER ' +
                            `) <= STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d') ` +
                    ') AS dates ' +
                        `ON YEAR(metric_table.date) = YEAR(dates.quarter_date) ` +
                        `AND QUARTER(metric_table.date) = QUARTER(dates.quarter_date) ` +
                    'INNER JOIN quarter_conversion_reference AS quarters ON QUARTER(dates.quarter_date) = quarters.code ' +
                    'GROUP BY label',
                    [
                        timeFilters.startYear, month,
                        timeFilters.startYear, month,
                        timeFilters.endYear, month
                    ]
                );
                conn.release();
                return yearResult;
        }
        return null;
    } catch (err) {
        console.error(`Error: Unable to get metric from ${table} in the ${column} column: ${err}`);
        if (conn) {
            conn.release();
        }
        return null;
    }
}

/**
 * Gets metric using an event table and a table for the thing.
 * Use if there is no reference table for the thing.
 * @param startMonth 
 * @param endMonth 
 * @param startYear 
 * @param endYear 
 * @param eventTable 
 * @param aThingTable 
 * @param eventFKColToAThing the foreign key column that connects eventTable to aThingTable
 * @param aThingLabelCol the column in aThingTable to use as the label
 * @returns 
 */
export async function getHighestOccurrencesOfAThingMetricUsing2Tables(
    startMonth: number,
    endMonth: number,
    startYear: number,
    endYear: number,
    eventTable: string,
    aThingTable: string,
    eventFKColToAThing: string,
    aThingLabelCol: string
): Promise<QueryResult | null> {
    let conn = null;
    try {
        if (!/^([a-z_]+)$/.test(eventTable)) {
            throw new Error(
                'Event table name to retrieve highest occurrences of a thing metric has invalid characters. ' +
                'Only lowercase letters and underscores are allowed.'
            );
        }
        if (!/^([a-z_]+)$/.test(aThingTable)) {
            throw new Error(
                'aThing table name to retrieve highest occurrences of a thing metric has invalid characters. ' +
                'Only lowercase letters and underscores are allowed.'
            );
        }
        if (!/^([a-z_]+)$/.test(eventFKColToAThing)) {
            throw new Error(
                'Foreign Key column name to connect event table to aThing table has invalid characters. ' +
                'Only lowercase letters and underscores are allowed.'
            );
        }
        if (!/^([a-z_]+)$/.test(aThingLabelCol)) {
            throw new Error(
                'Column name for aThing table for the label of aThing has invalid characters. ' +
                'Only lowercase letters and underscores are allowed.'
            );
        }
        conn = await getConnection();
        const [result]: any = await conn.execute(
            `SELECT thing_table.${aThingLabelCol} AS label, COUNT(event_table.id) AS value FROM ${eventTable} AS event_table ` +
            `INNER JOIN ${aThingTable} AS thing_table ON event_table.${eventFKColToAThing} = thing_table.id ` +
            'WHERE MONTH(event_table.date) >= ? ' +
            'AND MONTH(event_table.date) <= ? ' +
            'AND YEAR(event_table.date) >= ? ' +
            'AND YEAR(event_table.date) <= ? ' +
            'GROUP BY label ' +
            'ORDER BY value DESC ' +
            'LIMIT 10',
            [startMonth, endMonth, startYear, endYear]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to get highest occurrences of a thing metric: ${err}`);
        if (conn) {
            conn.release();
        }
        return null;
    }
}

/**
 * Gets metric using an event table, a table for the thing, and a reference table for the thing.
 * Use if there is a reference table for the thing.
 * @param startMonth 
 * @param startYear 
 * @param endMonth 
 * @param endYear 
 * @param eventTable 
 * @param aThingTable 
 * @param aThingRefTable 
 * @param districtToEventCol 
 * @returns 
 */
export async function getHighestOccurrencesOfAThingMetricUsing3Tables(
    startMonth: number,
    startYear: number,
    endMonth: number,
    endYear: number,
    eventTable: string,
    aThingTable: string,
    aThingRefTable: string,
    aThingFKColToEvent: string,
    aThingFKColToRef: string,
    refPKCol: string,
    sumOrCount: 'SUM' | 'COUNT',
    sumOrCountCol: string
): Promise<QueryResult | null> {
    let conn = null;
    try {
        if (!/^([a-z_]+)$/.test(eventTable)) {
            throw new Error(
                'Event table name to retrieve highest occurrences of a thing metric has invalid characters. ' +
                'Only lowercase letters and underscores are allowed.'
            );
        }
        if (!/^([a-z_]+)$/.test(aThingTable)) {
            throw new Error(
                'aThing table name to retrieve highest occurrences of a thing metric has invalid characters. ' +
                'Only lowercase letters and underscores are allowed.'
            );
        }
        if (!/^([a-z_]+)$/.test(aThingRefTable)) {
            throw new Error(
                'aThingRef table name to retrieve highest occurrences of a thing metric has invalid characters. ' +
                'Only lowercase letters and underscores are allowed.'
            );
        }
        if (!/^([a-z_]+)$/.test(aThingFKColToEvent)) {
            throw new Error(
                'Foreign Key column name to connect aThing table to event table has invalid characters. ' +
                'Only lowercase letters and underscores are allowed.'
            );
        }
        if (!/^([a-z_]+)$/.test(aThingFKColToRef)) {
            throw new Error(
                'Foreign Key column name to connect aThing table to aThingRef table has invalid characters. ' +
                'Only lowercase letters and underscores are allowed.'
            );
        }
        if (!/^([a-z_]+)$/.test(refPKCol)) {
            throw new Error(
                'Primary Key column name for aThingRef table has invalid characters. ' +
                'Only lowercase letters and underscores are allowed.'
            );
        }
        conn = await getConnection();
        const [result]: any = await conn.execute(
            `SELECT thing_ref_table.description AS label, ${sumOrCount}(thing_table.${sumOrCountCol}) AS value FROM ${aThingTable} AS thing_table ` +
            `INNER JOIN ${aThingRefTable} AS thing_ref_table ON thing_table.${aThingFKColToRef} = thing_ref_table.${refPKCol} ` +
            `INNER JOIN ${eventTable} AS event_table ON thing_table.${aThingFKColToEvent} = event_table.id ` +
            'WHERE MONTH(event_table.date) >= ? ' +
            'AND MONTH(event_table.date) <= ? ' +
            'AND YEAR(event_table.date) >= ? ' +
            'AND YEAR(event_table.date) <= ? ' +
            'GROUP BY label ' +
            'ORDER BY value DESC ' +
            'LIMIT 10',
            [startMonth, endMonth, startYear, endYear]
        );
        conn.release();
        return result;
    } catch (err) {
        console.error(`Error: Unable to get highest occurrences of a thing with a reference table metric: ${err}`);
        if (conn) {
            conn.release();
        }
        return null;
    }
}

export async function getRowCountAsMetricByInterval(
    interval: IntervalCode,
    timeFilters: {
        startMonth?: number,
        endMonth?: number,
        startQuarter?: number,
        endQuarter?: number,
        startYear: number,
        endYear: number
    },
    table: string,
    column: string
): Promise<QueryResult | null> {
    let conn = null;
    try {
        if (!/^([a-z_]+)$/.test(table)) {
            throw new Error(
                'Table name to retrieve metric from has invalid characters. ' +
                'Only lowercase letters and underscores are allowed.'
            );
        }
        if (!/^([a-z_]+)$/.test(column)) {
            throw new Error(
                'Column name to retrieve metric from has invalid characters. ' +
                'Only lowercase letters and underscores are allowed.'
            );
        }
        switch (interval) {
            case 'month':
                if (timeFilters.startMonth === undefined || timeFilters.endMonth === undefined) {
                    throw new Error('Missing start or end month when retrieving row count as metric by month interval.');
                }
                conn = await getConnection();
                const [monthResult] = await conn.execute(
                    'SELECT ' +
                        `CONCAT(MONTH(dates.month_date),'/',YEAR(dates.month_date)) AS label, ` +
                        `COALESCE(COUNT(metric_table.${column}), 0) AS value ` +
                    `FROM ${table} metric_table ` +
                    'RIGHT JOIN ( ' +
                        `SELECT DATE_ADD(STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d'), INTERVAL n-1 MONTH) AS month_date ` +
                        'FROM tally ' +
                        'WHERE DATE_ADD( ' +
                                `STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d'),` +
                                `INTERVAL n-1 MONTH ` +
                            `) <= STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d') ` +
                    ') AS dates ' +
                        'ON YEAR(metric_table.date) = YEAR(dates.month_date) ' +
                        'AND MONTH(metric_table.date) = MONTH(dates.month_date) ' +
                    'GROUP BY label',
                    [
                        timeFilters.startYear, timeFilters.startMonth,
                        timeFilters.startYear, timeFilters.startMonth,
                        timeFilters.endYear, timeFilters.endMonth
                    ]
                );
                conn.release();
                return monthResult;
            case 'quarter':
                if (timeFilters.startQuarter === undefined || timeFilters.endQuarter === undefined) {
                    throw new Error('Missing start or end quarter when retrieving row count as metric by quarter interval.');
                }
                let firstMonthInStartQuarter: number = getFirstMonthOfQuarter(timeFilters.startQuarter);
                let firstMonthInEndQuarter: number = getFirstMonthOfQuarter(timeFilters.endQuarter);
                conn = await getConnection();
                const [quarterResult] = await conn.execute(
                    'SELECT ' +
                        `CONCAT('FY', YEAR(dates.quarter_date)+quarters.year_to_fy_adjuster,'-Q',quarters.kpb_quarter) AS label, ` +
                        `COALESCE(COUNT(metric_table.${column}), 0) AS value ` +
                    `FROM ${table} AS metric_table ` +
                    'RIGHT JOIN ( ' +
                        `SELECT DATE_ADD(STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d'), INTERVAL n-1 QUARTER) AS quarter_date ` +
                        'FROM tally ' +
                        'WHERE DATE_ADD( ' +
                                `STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d'), ` +
                                'INTERVAL n-1 QUARTER ' +
                            `) <= STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d') ` +
                    ') AS dates ' +
                        `ON YEAR(metric_table.date) = YEAR(dates.quarter_date) ` +
                        `AND QUARTER(metric_table.date) = QUARTER(dates.quarter_date) ` +
                    'INNER JOIN quarter_conversion_reference AS quarters ON QUARTER(dates.quarter_date) = quarters.code ' +
                    'GROUP BY label',
                    [
                        timeFilters.startYear, firstMonthInStartQuarter,
                        timeFilters.startYear, firstMonthInStartQuarter,
                        timeFilters.endYear, firstMonthInEndQuarter
                    ]
                );
                conn.release();
                return quarterResult;
            case 'year':
                let month: number = getFirstMonthOfQuarter(4);
                conn = await getConnection();
                const [yearResult] = await conn.execute(
                    'SELECT ' +
                        `CONCAT('FY', YEAR(dates.quarter_date)+quarters.year_to_fy_adjuster) AS label, ` +
                        `COALESCE(COUNT(metric_table.${column}), 0) AS value ` +
                    `FROM ${table} AS metric_table ` +
                    'RIGHT JOIN ( ' +
                        `SELECT DATE_ADD(STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d'), INTERVAL n-1 QUARTER) AS quarter_date ` +
                        'FROM tally ' +
                        'WHERE DATE_ADD( ' +
                                `STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d'), ` +
                                'INTERVAL n-1 QUARTER ' +
                            `) <= STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d') ` +
                    ') AS dates ' +
                        `ON YEAR(metric_table.date) = YEAR(dates.quarter_date) ` +
                        `AND QUARTER(metric_table.date) = QUARTER(dates.quarter_date) ` +
                    'INNER JOIN quarter_conversion_reference AS quarters ON QUARTER(dates.quarter_date) = quarters.code ' +
                    'GROUP BY label',
                    [
                        timeFilters.startYear, month,
                        timeFilters.startYear, month,
                        timeFilters.endYear, month
                    ]
                );
                conn.release();
                return yearResult;
        }
        return null;
    } catch (err) {
        console.error(`Error: Unable to get metric from ${table} in the ${column} column: ${err}`);
        if (conn) {
            conn.release();
        }
        return null;
    }
}