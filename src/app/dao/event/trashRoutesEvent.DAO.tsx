import { EventDAO } from './event.DAO';
import { MetricsDAO } from '../metrics/metrics.DAO';
import { EventEntity } from '../../entities/event/event.entity';
import { TrashRoutesEventEntity } from '../../entities/event/trashRoutesEvent.entity';
import { EventModel } from '../../models';
import { IntervalCode, MetricVisualizeModel } from '../../models/metrics';
import { isTrashRoutesEvent } from '../../utils/eventTypeGuards';
import { insertTrashRoutesEvent, updateTrashRoutesEvent } from '../../lib/event.sql';
import { getColumnSumAsMetricByInterval } from '../../lib/metric.sql';
import { TRASH_ROUTES_METRIC_VALUES } from './metricValues';

type MetricCode = 'trashLbs' | 'recyclingLbs';
const METRIC_CODES: MetricCode[] = ['trashLbs', 'recyclingLbs'];

export class TrashRoutesEventDAO implements EventDAO, MetricsDAO {
    async getById(id: number): Promise<EventEntity | null> {
        return null;
    }

    async save(event: EventModel, isUpdate: boolean): Promise<number> {
        if (isTrashRoutesEvent(event)) {
            const eventEntity: TrashRoutesEventEntity = {
                id: event.id ? event.id : -1,
                date: event.date,
                trashLbs: event.trashPounds,
                recyclingLbs: event.recyclingPounds
            };

            if (isUpdate) {
                return await updateTrashRoutesEvent(eventEntity);
            } else {
                return await insertTrashRoutesEvent(eventEntity);
            }
        } else {
            console.error(`Error in save(): invalid data did not adhere to TrashRoutesModel.`);
        }
        return -1;
    }

    delete(id: number): void {
        console.log('Deleting');
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
            metric.metricTitle = TRASH_ROUTES_METRIC_VALUES[code].metricTitle;
            metric.dataLabel = TRASH_ROUTES_METRIC_VALUES[code].chartDataLabel;
            metric.chartType = TRASH_ROUTES_METRIC_VALUES[code].chartType;
            metric.dataColHeaders.valueHeader = TRASH_ROUTES_METRIC_VALUES[code].tableDataLabels.unitLabel;
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
                        TRASH_ROUTES_METRIC_VALUES[code].tables[0],
                        TRASH_ROUTES_METRIC_VALUES[code].valueCol
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