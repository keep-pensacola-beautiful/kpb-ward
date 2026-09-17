import { EventDAO } from './';
import { EventEntity } from '../../entities/event/event.entity';
import { AdoptASpotEventEntity } from '../../entities/event/adoptASpotEvent.entity';
import { EventModel } from '../../models';
import { IntervalCode, MetricVisualizeModel } from '../../models/metrics';
import { isAdoptASpotEvent } from '../../utils/eventTypeGuards';
import { insertAdoptASpotEvent, updateAdoptASpotEvent } from '../../lib/event.sql';
import {
    getColumnSumAsMetricByInterval,
    getHighestOccurrencesOfAThingMetricUsing2Tables,
    getRowCountAsMetricByInterval
} from '../../lib/metric.sql';
import { ADOPT_A_SPOT_METRIC_VALUES } from './metricValues';

type MetricCode = 'volunteerCount' | 'volunteerHours' | 'litterLbs' | 'recyclingLbs' | 'cleanupCount' | 'topGroups';
const METRIC_CODES: MetricCode[] = [
    'volunteerCount', 'volunteerHours', 'litterLbs',
    'recyclingLbs', 'cleanupCount', 'topGroups'
];

export class AdoptASpotEventDAO implements EventDAO {
    async getById(id: number): Promise<EventEntity | null> {
        return null;
    }

    async save(event: EventModel, isUpdate: boolean): Promise<number> {
        if (isAdoptASpotEvent(event)) {
            const assignmentId: number = event.spot.id ? event.spot.id : -1;
            if (assignmentId === -1) {
                console.error(`Error in save(): no valid assignment for Adopt-a-Spot Cleanup.`);
                return -1;
            }
            const eventEntity: AdoptASpotEventEntity = {
                id: event.id ? event.id : -1,
                date: event.date,
                assignmentId: assignmentId,
                volunteerCount: event.volunteerCount,
                volunteerHours: event.volunteerHours,
                litterLbs: event.litterCollected,
                recyclingLbs: event.recyclingCollected
            };

            if (isUpdate) {
                return await updateAdoptASpotEvent(eventEntity);
            } else {
                return await insertAdoptASpotEvent(eventEntity);
            }
        } else {
            console.error(`Error in save(): invalid data did not adhere to AdoptASpotModel.`);
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
            metric.metricTitle = ADOPT_A_SPOT_METRIC_VALUES[code].metricTitle;
            metric.dataLabel = ADOPT_A_SPOT_METRIC_VALUES[code].dataLabel;
            metric.chartType = ADOPT_A_SPOT_METRIC_VALUES[code].chartType;
            switch (code) {
                case METRIC_CODES[0]:
                case METRIC_CODES[1]:
                case METRIC_CODES[2]:
                case METRIC_CODES[3]:
                    result = await getColumnSumAsMetricByInterval(
                        interval,
                        timePeriod,
                        ADOPT_A_SPOT_METRIC_VALUES[code].tables[0],
                        ADOPT_A_SPOT_METRIC_VALUES[code].valueCol
                    );
                    break;
                case METRIC_CODES[4]:
                    result = await getRowCountAsMetricByInterval(
                        interval,
                        timePeriod,
                        ADOPT_A_SPOT_METRIC_VALUES[code].tables[0],
                        ADOPT_A_SPOT_METRIC_VALUES[code].valueCol
                    );
                    break;
                case METRIC_CODES[5]:
                    if (!ADOPT_A_SPOT_METRIC_VALUES[code].extraCols || ADOPT_A_SPOT_METRIC_VALUES[code].extraCols.length < 2) {
                        throw new Error(`Missing necessary columns to get Adopt-a-Spot ${code} metric.`);
                    }
                    if (timePeriod.startMonth === undefined || timePeriod.endMonth === undefined) {
                        throw new Error(`Missing start or end month to get Adopt-a-Spot ${code} metric.`);
                    }
                    result = await getHighestOccurrencesOfAThingMetricUsing2Tables(
                        timePeriod.startMonth,
                        timePeriod.startYear,
                        timePeriod.endMonth,
                        timePeriod.endYear,
                        ADOPT_A_SPOT_METRIC_VALUES[code].tables[0],
                        ADOPT_A_SPOT_METRIC_VALUES[code].tables[1],
                        ADOPT_A_SPOT_METRIC_VALUES[code].extraCols[0],
                        ADOPT_A_SPOT_METRIC_VALUES[code].extraCols[1]
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
            console.log(result);
            if (result !== null && result.length >= 1) {
                result.forEach((row: any) => metric.data.push({ label: row.label, value: row.value }));
            }
        } else {
            console.error(`Error: Invalid metric code '${metricCode}'`);
        }
        return metric;
    }
}