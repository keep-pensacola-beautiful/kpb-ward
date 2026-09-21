import { EventDAO } from './event.DAO';
import { MetricsDAO } from '../metrics/metrics.DAO';
import { EventModel } from '../../models';
import { IntervalCode, MetricVisualizeModel } from '../../models/metrics';
import { BagSwapEventEntity } from '../../entities/event/bagSwapEvent.entity';
import { EventEntity } from '../../entities/event/event.entity';
import { isBagSwapEvent } from '../../utils/eventTypeGuards';
import { insertBagSwapEvent, updateBagSwapEvent } from '../../lib/event.sql';
import { getColumnSumAsMetricByInterval } from '../../lib/metric.sql';
import { BAG_SWAP_METRIC_VALUES } from './metricValues';

type MetricCode = 'bagCount' | 'volunteerCount' | 'volunteerHours';
const METRIC_CODES: MetricCode[] = ['bagCount', 'volunteerCount', 'volunteerHours'];

export class BagSwapEventDAO implements EventDAO, MetricsDAO {
    async getById(id: number): Promise<EventEntity | null> {
        return null;
    }

    async save(event: EventModel, isUpdate: boolean): Promise<number> {
        if (isBagSwapEvent(event)) {
            const eventEntity: BagSwapEventEntity = {
                id: event.id ? event.id : -1,
                date: event.date,
                bagCount: event.bagsCollected,
                eventDesc: event.eventDescription,
                volunteerCount: event.volunteerCount,
                volunteerHours: event.volunteerHours
            };

            if (isUpdate) {
                return await updateBagSwapEvent(eventEntity);
            } else {
                return await insertBagSwapEvent(eventEntity);
            }
        } else {
            console.error(`Error in save(): invalid data did not adhere to BagSwapEventModel.`);
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
        let metric: MetricVisualizeModel = { metricTitle: 'Error: Unable to Retrieve Metric', dataLabel: 'error', chartType: 'bar', data: [] };
        if (METRIC_CODES.includes(metricCode as any)) {
            const code: MetricCode = metricCode as any;
            let result: any = null;
            metric.metricTitle = BAG_SWAP_METRIC_VALUES[code].metricTitle;
            metric.dataLabel = BAG_SWAP_METRIC_VALUES[code].dataLabel;
            metric.chartType = BAG_SWAP_METRIC_VALUES[code].chartType;
            switch (code) {
                case METRIC_CODES[0]:
                case METRIC_CODES[1]:
                case METRIC_CODES[2]:
                    result = await getColumnSumAsMetricByInterval(
                        interval,
                        timePeriod,
                        BAG_SWAP_METRIC_VALUES[code].tables[0],
                        BAG_SWAP_METRIC_VALUES[code].valueCol
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