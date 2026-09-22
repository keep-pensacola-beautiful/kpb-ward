import { EventDAO } from './event.DAO';
import { MetricsDAO } from '../metrics/metrics.DAO';
import { BulkyItemEntity } from '../../entities/bulkyItem.entity';
import { DistrictEntity } from '../../entities/district.entity';
import { EventEntity } from '../../entities/event/event.entity';
import { RoadsideLitterEventEntity } from '../../entities/event/roadsideLitterEvent.entity';
import { BulkyItemModel, DistrictModel, EventModel } from '../../models';
import { IntervalCode, MetricVisualizeModel } from '../../models/metrics';
import { isRoadsideLitterEvent } from '../../utils/eventTypeGuards';
import { insertRoadsideLitterEvent, updateRoadsideLitterEvent } from '../../lib/event.sql';
import {
    getBulkyItemCountByInterval,
    getColumnSumAsMetricByInterval,
    getHighestOccurrencesOfAThingMetricUsing3Tables
} from '../../lib/metric.sql';
import { ROADSIDE_LITTER_METRIC_VALUES } from './metricValues';

type MetricCode = 'litterLbs' | 'recyclingLbs' | 'bulkyCount' | 'topBulkyItems' | 'topDistricts';
const METRIC_CODES: MetricCode[] = ['litterLbs', 'recyclingLbs', 'bulkyCount', 'topBulkyItems', 'topDistricts'];

export class RoadsideLitterEventDAO implements EventDAO, MetricsDAO {
    async getById(id: number): Promise<EventEntity | null> {
        return null;
    }

    async save(event: EventModel, isUpdate: boolean): Promise<number> {
        if (isRoadsideLitterEvent(event)) {
            const eventEntity: RoadsideLitterEventEntity = {
                id: event.id ? event.id : -1,
                date: event.date,
                litterLbs: event.litterPounds,
                recyclingLbs: event.recyclingPounds,
                locations: event.locations
            };

            let districtEntities: DistrictEntity[] = [];
            event.districts.map((district: DistrictModel) => {
                districtEntities.push({
                    id: district.id ? district.id : -1,
                    eventId: event.id ? event.id : -1,
                    districtCode: `${district.districtRef.code}`
                });
            });

            let bulkyItemEntities: BulkyItemEntity[] = [];
            event.bulkyItems.map((item: BulkyItemModel) => {
                bulkyItemEntities.push({
                    id: item.id ? item.id : -1,
                    bulkyItemRefId: Number(item.bulkyItemRef.code),
                    eventId: event.id ? event.id : -1,
                    quantity: item.quantity
                });
            });

            if (isUpdate) {
                return await updateRoadsideLitterEvent(eventEntity, districtEntities, bulkyItemEntities);
            } else {
                return await insertRoadsideLitterEvent(eventEntity, districtEntities, bulkyItemEntities);
            }
        } else {
            console.error(`Error in save(): invalid data did not adhere to RoadsideLitterModel.`);
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
            metric.metricTitle = ROADSIDE_LITTER_METRIC_VALUES[code].metricTitle;
            metric.dataLabel = ROADSIDE_LITTER_METRIC_VALUES[code].chartDataLabel;
            metric.chartType = ROADSIDE_LITTER_METRIC_VALUES[code].chartType;
            metric.dataColHeaders.valueHeader = ROADSIDE_LITTER_METRIC_VALUES[code].tableDataLabels.unitLabel;
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
                        ROADSIDE_LITTER_METRIC_VALUES[code].tables[0],
                        ROADSIDE_LITTER_METRIC_VALUES[code].valueCol
                    );
                    break;
                case METRIC_CODES[2]:
                    if (!ROADSIDE_LITTER_METRIC_VALUES[code].extraCols || ROADSIDE_LITTER_METRIC_VALUES[code].extraCols.length < 1) {
                        throw new Error(`Missing necessary columns to get Roadside Litter ${code} metric.`);
                    }
                    result = await getBulkyItemCountByInterval(
                        interval,
                        timePeriod,
                        ROADSIDE_LITTER_METRIC_VALUES[code].tables[0],
                        ROADSIDE_LITTER_METRIC_VALUES[code].tables[1],
                        ROADSIDE_LITTER_METRIC_VALUES[code].extraCols[0]
                    );
                    break;
                case METRIC_CODES[3]:
                    if (!ROADSIDE_LITTER_METRIC_VALUES[code].extraCols || ROADSIDE_LITTER_METRIC_VALUES[code].extraCols.length < 3) {
                        throw new Error(`Missing necessary columns to get Roadside Litter ${code} metric.`);
                    }
                    if (timePeriod.startMonth === undefined || timePeriod.endMonth === undefined) {
                        throw new Error(`Missing start or end month to get Roadside Litter ${code} metric.`);
                    }
                    if (ROADSIDE_LITTER_METRIC_VALUES[code].tableDataLabels.dataLabel !== undefined) {
                        metric.dataColHeaders.labelHeader = ROADSIDE_LITTER_METRIC_VALUES[code].tableDataLabels.dataLabel;
                    }
                    result = await getHighestOccurrencesOfAThingMetricUsing3Tables(
                        timePeriod.startMonth,
                        timePeriod.startYear,
                        timePeriod.endMonth,
                        timePeriod.endYear,
                        ROADSIDE_LITTER_METRIC_VALUES[code].tables[0],
                        ROADSIDE_LITTER_METRIC_VALUES[code].tables[1],
                        ROADSIDE_LITTER_METRIC_VALUES[code].tables[2],
                        ROADSIDE_LITTER_METRIC_VALUES[code].extraCols[0],
                        ROADSIDE_LITTER_METRIC_VALUES[code].extraCols[1],
                        ROADSIDE_LITTER_METRIC_VALUES[code].extraCols[2],
                        'SUM',
                        'quantity'
                    );
                    break;
                case METRIC_CODES[4]:
                    if (!ROADSIDE_LITTER_METRIC_VALUES[code].extraCols || ROADSIDE_LITTER_METRIC_VALUES[code].extraCols.length < 3) {
                        throw new Error(`Missing necessary columns to get Roadside Litter ${code} metric.`);
                    }
                    if (timePeriod.startMonth === undefined || timePeriod.endMonth === undefined) {
                        throw new Error(`Missing start or end month to get Roadside Litter ${code} metric.`);
                    }
                    if (ROADSIDE_LITTER_METRIC_VALUES[code].tableDataLabels.dataLabel !== undefined) {
                        metric.dataColHeaders.labelHeader = ROADSIDE_LITTER_METRIC_VALUES[code].tableDataLabels.dataLabel;
                    }
                    result = await getHighestOccurrencesOfAThingMetricUsing3Tables(
                        timePeriod.startMonth,
                        timePeriod.startYear,
                        timePeriod.endMonth,
                        timePeriod.endYear,
                        ROADSIDE_LITTER_METRIC_VALUES[code].tables[0],
                        ROADSIDE_LITTER_METRIC_VALUES[code].tables[1],
                        ROADSIDE_LITTER_METRIC_VALUES[code].tables[2],
                        ROADSIDE_LITTER_METRIC_VALUES[code].extraCols[0],
                        ROADSIDE_LITTER_METRIC_VALUES[code].extraCols[1],
                        ROADSIDE_LITTER_METRIC_VALUES[code].extraCols[2],
                        'COUNT',
                        'id'
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