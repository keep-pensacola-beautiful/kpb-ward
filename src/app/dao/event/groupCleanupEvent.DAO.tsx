import { EventDAO } from './event.DAO';
import { MetricsDAO } from '../metrics/metrics.DAO';
import { GroupCleanupEventEntity } from '../../entities/event/groupCleanupEvent.entity';
import { EventModel, GroupCleanupEventModel } from '../../models/event';
import { MetricVisualizeModel, IntervalCode } from '../../models/metrics';
import { isGroupCleanupEvent } from '../../utils/eventTypeGuards';
import {
    deleteGroupCleanupEventById,
    getGroupCleanupEventById,
    insertGroupCleanupEvent,
    updateGroupCleanupEvent
} from '../../lib/event.sql';
import {
    getColumnSumAsMetricByInterval,
    getHighestOccurrencesOfAThingMetricUsing2Tables,
    getRowCountAsMetricByInterval
} from '../../lib/metric.sql';
import { searchGroupCleanupEvents } from '../../lib/search.sql';
import { GROUP_CLEANUP_METRIC_VALUES } from './metricValues';

type MetricCode = 'volunteerCount' | 'volunteerHours' | 'litterLbs' | 'recyclingLbs' | 'cleanupCount' | 'topOrganizations' | 'topLocations';
const METRIC_CODES: MetricCode[] = [
    'volunteerCount', 'volunteerHours', 'litterLbs',
    'recyclingLbs', 'cleanupCount', 'topOrganizations',
    'topLocations'
];

export class GroupCleanupEventDAO implements EventDAO, MetricsDAO {
    async getById(id: number): Promise<GroupCleanupEventModel | null> {
        if (id <= 0) {
            return null;
        }
        let event: GroupCleanupEventModel | null = null;
        let result: any = await getGroupCleanupEventById(id);
        if (result !== null && result.length > 0) {
            event = {
                id: result[0].id,
                date: result[0].date,
                litterCollected: result[0].litterLbs,
                recyclingCollected: result[0].recyclingLbs,
                volunteerCount: result[0].volunteerCount,
                volunteerHours: result[0].volunteerHours,
                organization: { id: result[0].organizationId, name: result[0].organization },
                location: { code: result[0].locationId, description: result[0].location }
            }
        }
        return event;
    }

    async save(event: EventModel, isUpdate: boolean): Promise<number> {
        if (isGroupCleanupEvent(event)) {
            const locationId: number = Number.isNaN(Number(event.location.code)) ? -1 : Number(event.location.code);
            const organizationId: number = event.organization.id ? event.organization.id : -1;
            if (locationId === -1 || organizationId === -1) {
                console.error(`Error in save(): no valid location or organization for Group Cleanup.`);
                return -1;
            }
            const eventEntity: GroupCleanupEventEntity = {
                id: event.id ? event.id : -1,
                date: event.date,
                organizationId: organizationId,
                locationId: locationId,
                volunteerCount: event.volunteerCount,
                volunteerHours: event.volunteerHours,
                litterLbs: event.litterCollected,
                recyclingLbs: event.recyclingCollected
            };

            if (isUpdate) {
                return await updateGroupCleanupEvent(eventEntity);
            } else {
                return await insertGroupCleanupEvent(eventEntity);
            }
        } else {
            console.error(`Error in save(): invalid data did not adhere to GroupCleanupModel.`);
        }
        return -1;
    }

    async deleteById(id: number): Promise<number> {
        if (id <= 0) {
            return 0;
        }
        return await deleteGroupCleanupEventById(id);
    }

    async search(searchCriteria: Map<string, string>): Promise<GroupCleanupEventModel[]> {
        const startDate: string | undefined = searchCriteria.get('start-date');
        const endDate: string | undefined = searchCriteria.get('end-date');
        if (startDate === undefined || endDate === undefined) {
            console.error('Error: Unable to search for Group Cleanup Events due to missing start date or end date.');
            return [];
        }
        const result: any = await searchGroupCleanupEvents(
            startDate, endDate,
            searchCriteria.get('litter-min'), searchCriteria.get('litter-max'),
            searchCriteria.get('recycling-min'), searchCriteria.get('recycling-max'),
            searchCriteria.get('organization-combobox-input'),
            searchCriteria.get('location-combobox-input'),
            searchCriteria.get('vol-count-min'), searchCriteria.get('vol-count-max')
        );
        let events: GroupCleanupEventModel[] = [];
        if (result !== null && result.length >= 1) {
            result.forEach((row: any) => events.push({
                id: row.id,
                date: row.date,
                litterCollected: row.litterLbs,
                recyclingCollected: row.recyclingLbs,
                volunteerCount: row.volunteerCount,
                volunteerHours: row.volunteerHours,
                organization: { name: row.name },
                location: { description: row.location }
            }));
        }
        return events;
    }

    async getMetric(
        timePeriod: {
            startMonth?: number, endMonth?: number,
            startQuarter?: number, endQuarter?: number,
            startYear: number, endYear: number
        },
        metricCode: string,
        interval: IntervalCode
    ): Promise<MetricVisualizeModel> {
        let metric: MetricVisualizeModel = {
            metricTitle: 'Error: Unable to Retrieve Metric',
            dataLabel: 'error',
            dataColHeaders: { labelHeader: 'error', valueHeader: 'error' },
            chartType: 'bar',
            data: []
        };
        if (METRIC_CODES.includes(metricCode as any)) {
            const code: MetricCode = metricCode as any;
            let result: any = null;
            metric.metricTitle = GROUP_CLEANUP_METRIC_VALUES[code].metricTitle;
            metric.dataLabel = GROUP_CLEANUP_METRIC_VALUES[code].chartDataLabel;
            metric.chartType = GROUP_CLEANUP_METRIC_VALUES[code].chartType;
            metric.dataColHeaders.valueHeader = GROUP_CLEANUP_METRIC_VALUES[code].tableDataLabels.unitLabel;
            switch (interval) {
                case 'month':
                    metric.metricTitle += ' by Month';
                    metric.dataColHeaders.labelHeader = 'Month';
                    break;
                case 'quarter':
                    metric.metricTitle += ' by Quarter';
                    metric.dataColHeaders.labelHeader = 'Quarter';
                    break;
                case 'year':
                    metric.metricTitle += ' by Year';
                    metric.dataColHeaders.labelHeader = 'Year';
                    break;
            }
            switch (code) {
                case METRIC_CODES[0]:
                case METRIC_CODES[1]:
                case METRIC_CODES[2]:
                case METRIC_CODES[3]:
                    result = await getColumnSumAsMetricByInterval(
                        interval,
                        timePeriod,
                        GROUP_CLEANUP_METRIC_VALUES[code].tables[0],
                        GROUP_CLEANUP_METRIC_VALUES[code].valueCol
                    );
                    break;
                case METRIC_CODES[4]:
                    result = await getRowCountAsMetricByInterval(
                        interval,
                        timePeriod,
                        GROUP_CLEANUP_METRIC_VALUES[code].tables[0],
                        GROUP_CLEANUP_METRIC_VALUES[code].valueCol
                    );
                    break;
                case METRIC_CODES[5]:
                case METRIC_CODES[6]:
                    if (!GROUP_CLEANUP_METRIC_VALUES[code].extraCols || GROUP_CLEANUP_METRIC_VALUES[code].extraCols.length < 2) {
                        throw new Error(`Missing necessary columns to get Group Cleanup ${code} metric.`);
                    }
                    if (timePeriod.startMonth === undefined || timePeriod.endMonth === undefined) {
                        throw new Error(`Missing start or end month to get Education Event ${code} metric.`);
                    }
                    if (GROUP_CLEANUP_METRIC_VALUES[code].tableDataLabels.dataLabel !== undefined) {
                        metric.dataColHeaders.labelHeader = GROUP_CLEANUP_METRIC_VALUES[code].tableDataLabels.dataLabel;
                    }
                    result = await getHighestOccurrencesOfAThingMetricUsing2Tables(
                        timePeriod.startMonth,
                        timePeriod.endMonth,
                        timePeriod.startYear,
                        timePeriod.endYear,
                        GROUP_CLEANUP_METRIC_VALUES[code].tables[0],
                        GROUP_CLEANUP_METRIC_VALUES[code].tables[1],
                        GROUP_CLEANUP_METRIC_VALUES[code].extraCols[0],
                        GROUP_CLEANUP_METRIC_VALUES[code].extraCols[1]
                    );
                    break;
            }
            if (result !== null && result.length >= 1) {
                result.forEach((row: any) => metric.data.push({ label: row.label, value: row.value }));
            }
        } else {
            console.error(`Error: Invalid metric code '${metricCode}'`);
        }
        return metric;
    }
}