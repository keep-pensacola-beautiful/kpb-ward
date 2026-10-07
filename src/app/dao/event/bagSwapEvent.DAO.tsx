import { EventDAO } from './event.DAO';
import { MetricsDAO } from '../metrics/metrics.DAO';
import { BagSwapEventModel, EventModel } from '../../models/event';
import { IntervalCode, MetricVisualizeModel } from '../../models/metrics';
import { BagSwapEventEntity } from '../../entities/event/bagSwapEvent.entity';
import { isBagSwapEvent } from '../../utils/eventTypeGuards';
import {
    deleteBagSwapEventById,
    getBagSwapEventById,
    insertBagSwapEvent,
    updateBagSwapEvent
} from '../../lib/event.sql';
import { getColumnSumAsMetricByInterval } from '../../lib/metric.sql';
import { searchBagSwapEvents } from '../../lib/search.sql';
import { BAG_SWAP_METRIC_VALUES } from './metricValues';

type MetricCode = 'bagCount' | 'volunteerCount' | 'volunteerHours';
const METRIC_CODES: MetricCode[] = ['bagCount', 'volunteerCount', 'volunteerHours'];

export class BagSwapEventDAO implements EventDAO, MetricsDAO {
    async getById(id: number): Promise<BagSwapEventModel | null> {
        if (id <= 0) {
            return null;
        }
        let event: BagSwapEventModel | null = null;
        let result: any = await getBagSwapEventById(id);
        if (result !== null && result.length > 0) {
            event = {
                id: result[0].id,
                date: result[0].date,
                bagsCollected: result[0].bagCount,
                eventDescription: result[0].eventDesc,
                volunteerCount: result[0].volunteerCount,
                volunteerHours: result[0].volunteerHours
            }
        }
        return event;
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

    async deleteById(id: number): Promise<number> {
        if (id <= 0) {
            return 0;
        }
        return await deleteBagSwapEventById(id);
    }

    async search(searchCriteria: Map<string, string>): Promise<BagSwapEventModel[]> {
        const startDate: string | undefined = searchCriteria.get('start-date');
        const endDate: string | undefined = searchCriteria.get('end-date');
        if (startDate === undefined || endDate === undefined) {
            console.error('Error: Unable to search for Bag Swap Events due to missing start date or end date.');
            return [];
        }
        const result: any = await searchBagSwapEvents(
            startDate, endDate,
            searchCriteria.get('bag-min'), searchCriteria.get('bag-max'),
            searchCriteria.get('vol-count-min'), searchCriteria.get('vol-count-max'),
            searchCriteria.get('event-desc')
        );
        let events: BagSwapEventModel[] = [];
        if (result !== null && result.length >= 1) {
            result.forEach((row: any) => events.push({
                id: row.id,
                date: row.date,
                bagsCollected: row.bagCount,
                volunteerCount: row.volunteerCount,
                volunteerHours: row.volunteerHours,
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
            metric.metricTitle = BAG_SWAP_METRIC_VALUES[code].metricTitle;
            metric.dataLabel = BAG_SWAP_METRIC_VALUES[code].chartDataLabel;
            metric.chartType = BAG_SWAP_METRIC_VALUES[code].chartType;
            metric.dataColHeaders.valueHeader = BAG_SWAP_METRIC_VALUES[code].tableDataLabels.unitLabel;
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
                    result = await getColumnSumAsMetricByInterval(
                        interval,
                        timePeriod,
                        BAG_SWAP_METRIC_VALUES[code].tables[0],
                        BAG_SWAP_METRIC_VALUES[code].valueCol
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