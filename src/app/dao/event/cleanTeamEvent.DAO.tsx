import { EventDAO } from './event.DAO';
import { MetricsDAO } from '../metrics/metrics.DAO';
import { EventEntity } from '../../entities/event/event.entity';
import { CleanTeamEventEntity } from '../../entities/event/cleanTeamEvent.entity';
import { EventModel } from '../../models';
import { IntervalCode, MetricVisualizeModel } from '../../models/metrics';
import { isCleanTeamEvent } from '../../utils/eventTypeGuards';
import { insertCleanTeamEvent, updateCleanTeamEvent } from '../../lib/event.sql';
import { getColumnSumAsMetricByInterval } from '../../lib/metric.sql';
import { CLEAN_TEAM_METRIC_VALUES } from './metricValues';

type MetricCode = 'trashLbs' | 'recyclingLbs';
const METRIC_CODES: MetricCode[] = ['trashLbs', 'recyclingLbs'];

export class CleanTeamEventDAO implements EventDAO, MetricsDAO {
    async getById(id: number): Promise<EventEntity | null> {
        return null;
    }

    async save(event: EventModel, isUpdate: boolean): Promise<number> {
        if (isCleanTeamEvent(event)) {
            const eventEntity: CleanTeamEventEntity = {
                id: event.id ? event.id : -1,
                date: event.date,
                eventDesc: event.eventDescription,
                trashLbs: event.trashPounds,
                recyclingLbs: event.recyclingPounds
            };

            if (isUpdate) {
                return await updateCleanTeamEvent(eventEntity);
            } else {
                return await insertCleanTeamEvent(eventEntity);
            }
        } else {
            console.error(`Error in save(): invalid data did not adhere to CleanTeamModel.`);
        }
        return -1;
    }

    async delete(id: number): Promise<void> {
        console.log('Deleting');
        return;
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
        let metric: MetricVisualizeModel = { metricTitle: 'Error: Unable to Retrieve Metric', dataLabel: 'error', chartType: 'bar', data: [] };
        if (METRIC_CODES.includes(metricCode as any)) {
            const code: MetricCode = metricCode as any;
            let result: any = null;
            metric.metricTitle = CLEAN_TEAM_METRIC_VALUES[code].metricTitle;
            metric.dataLabel = CLEAN_TEAM_METRIC_VALUES[code].dataLabel;
            metric.chartType = CLEAN_TEAM_METRIC_VALUES[code].chartType;
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
            switch (interval) {
                case 'month':
                    metric.metricTitle += ' by Month';
                    break;
                case 'quarter':
                    metric.metricTitle += ' by Quarter';
                    break;
                case 'year':
                    metric.metricTitle += ' by Year';
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