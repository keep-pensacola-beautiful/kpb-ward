import { EventDAO } from './event.DAO';
import { MetricsDAO } from '../metrics/metrics.DAO';
import { CleanTeamEventEntity } from '../../entities/event/cleanTeamEvent.entity';
import { CleanTeamEventModel, EventModel } from '../../models/event';
import { IntervalCode, MetricVisualizeModel } from '../../models/metrics';
import { isCleanTeamEvent } from '../../utils/eventTypeGuards';
import {
    deleteCleanTeamEventById,
    getCleanTeamEventById,
    insertCleanTeamEvent,
    updateCleanTeamEvent
} from '../../lib/event.sql';
import { getColumnSumAsMetricByInterval } from '../../lib/metric.sql';
import { searchCleanTeamEvents } from '../../lib/search.sql';
import { CLEAN_TEAM_METRIC_VALUES } from './metricValues';

type MetricCode = 'trashLbs' | 'recyclingLbs';
const METRIC_CODES: MetricCode[] = ['trashLbs', 'recyclingLbs'];

export class CleanTeamEventDAO implements EventDAO, MetricsDAO {
    async getById(id: number): Promise<CleanTeamEventModel | null> {
        if (id <= 0) {
            return null;
        }
        let event: CleanTeamEventModel | null = null;
        let result: any = await getCleanTeamEventById(id);
        if (result !== null && result.length > 0) {
            event = {
                id: result[0].id,
                date: result[0].date,
                trashPounds: result[0].trash_lbs,
                recyclingPounds: result[0].recycling_lbs,
                eventDescription: result[0].event_desc
            }
        }
        return event;
    }

    async save(event: EventModel, isUpdate: boolean): Promise<number> {
        if (isCleanTeamEvent(event)) {
            console.log(event);
            const eventEntity: CleanTeamEventEntity = {
                id: event.id ? event.id : -1,
                date: event.date,
                eventDesc: event.eventDescription,
                trashLbs: event.trashPounds,
                recyclingLbs: event.recyclingPounds
            };

            if (isUpdate) {
                const affectedRowCount: number = await updateCleanTeamEvent(eventEntity);
                return affectedRowCount === 1 ? 1 : -1;
            } else {
                const insertedId: number = await insertCleanTeamEvent(eventEntity);
                return insertedId;
            }
        } else {
            console.error(`Error in save(): invalid data did not adhere to CleanTeamModel.`);
        }
        return -1;
    }

    async deleteById(id: number): Promise<number> {
        if (id <= 0) {
            return 0;
        }
        return await deleteCleanTeamEventById(id);
    }

    async search(searchCriteria: Map<string, string>): Promise<CleanTeamEventModel[]> {
        const startDate: string | undefined = searchCriteria.get('start-date');
        const endDate: string | undefined = searchCriteria.get('end-date');
        if (startDate === undefined || endDate === undefined) {
            console.error('Error: Unable to search for Clean Team Events due to missing start date or end date.');
            return [];
        }
        const result: any = await searchCleanTeamEvents(
            startDate, endDate,
            searchCriteria.get('trash-min'), searchCriteria.get('trash-max'),
            searchCriteria.get('recycling-min'), searchCriteria.get('recycling-max'),
            searchCriteria.get('event-desc')
        );
        let events: CleanTeamEventModel[] = [];
        if (result !== null && result.length >= 1) {
            result.forEach((row: any) => events.push({
                id: row.id,
                date: row.date,
                trashPounds: row.trashLbs,
                recyclingPounds: row.recyclingLbs,
                eventDescription: row.eventDesc
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
            metric.metricTitle = CLEAN_TEAM_METRIC_VALUES[code].metricTitle;
            metric.dataLabel = CLEAN_TEAM_METRIC_VALUES[code].chartDataLabel;
            metric.chartType = CLEAN_TEAM_METRIC_VALUES[code].chartType;
            metric.dataColHeaders.valueHeader = CLEAN_TEAM_METRIC_VALUES[code].tableDataLabels.unitLabel;
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
                    result = await getColumnSumAsMetricByInterval(
                        interval,
                        timePeriod,
                        CLEAN_TEAM_METRIC_VALUES[code].tables[0],
                        CLEAN_TEAM_METRIC_VALUES[code].valueCol
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