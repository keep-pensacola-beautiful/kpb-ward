import { EventDAO } from './event.DAO';
import { MetricsDAO } from '../metrics/metrics.DAO';
import { BulkyItemEntity } from '../../entities/bulkyItem.entity';
import { CountyCleanupEventEntity } from '../../entities/event/countyCleanupEvent.entity';
import { EventEntity } from '../../entities/event/event.entity';
import { ItemWeightReferenceDataEntity } from '../../entities/referenceData/itemWeightReferenceData.entity';
import { BulkyItemModel, EventModel } from '../../models';
import { IntervalCode, MetricVisualizeModel } from '../../models/metrics';
import { isCountyCleanupEvent } from '../../utils/eventTypeGuards';
import { insertCountyCleanupEvent, updateCountyCleanupEvent } from '../../lib/event.sql';
import { getColumnSumAsMetricByInterval, getHighestOccurrencesOfAThingMetricUsing3Tables } from '../../lib/metric.sql';
import { ItemWeightReferenceDataDAO } from '../referenceData';
import { COUNTY_CLEANUP_METRIC_VALUES } from './metricValues';

type MetricCode = 'tireCount' | 'paintChemicalCount' | 'bulkyLbs' | 'topBulkyItems';
const METRIC_CODES: MetricCode[] = ['tireCount', 'paintChemicalCount', 'bulkyLbs', 'topBulkyItems'];

export class CountyCleanupEventDAO implements EventDAO, MetricsDAO {
    private static TIRE_WEIGHT_CODE = 'TIRE';
    private static PAINT_CAN_HOUSEHOLD_CHEMICAL_WEIGHT_CODE = 'PCHC';

    async getById(id: number): Promise<EventEntity | null> {
        return null;
    }

    async save(event: EventModel, isUpdate: boolean): Promise<number> {
        if (isCountyCleanupEvent(event)) {
            const itemWeightDAO: ItemWeightReferenceDataDAO = new ItemWeightReferenceDataDAO();
            const itemWeights: ItemWeightReferenceDataEntity[] = await itemWeightDAO.getAll();
            let tireWeight: number = 1;
            let paintCanHouseholdChemicalWeight: number = 1;
            itemWeights.map((weight: ItemWeightReferenceDataEntity) => {
                if (weight.code === CountyCleanupEventDAO.TIRE_WEIGHT_CODE) {
                    tireWeight = weight.weight;
                } else if (weight.code === CountyCleanupEventDAO.PAINT_CAN_HOUSEHOLD_CHEMICAL_WEIGHT_CODE) {
                    paintCanHouseholdChemicalWeight = weight.weight;
                }
            });

            const eventEntity: CountyCleanupEventEntity = {
                id: event.id ? event.id : -1,
                date: event.date,
                tireCount: event.tireCount,
                tireLbs: event.tireCount * tireWeight,
                paintCanAndHouseholdChemicalCount: event.paintCanAndHouseholdChemicalCount,
                paintCanAndHouseholdChemicalLbs: event.paintCanAndHouseholdChemicalCount * paintCanHouseholdChemicalWeight,
                bulkyItemsLbs: event.otherBulkyItemPounds
            };

            let bulkyItemEntities: BulkyItemEntity[] = [];
            event.otherBulkyItems.map((item: BulkyItemModel) => {
                bulkyItemEntities.push({
                    id: item.id ? item.id : -1,
                    bulkyItemRefId: Number(item.bulkyItemRef.code),
                    eventId: event.id ? event.id : -1,
                    quantity: item.quantity
                });
            });

            if (isUpdate) {
                return await updateCountyCleanupEvent(eventEntity, bulkyItemEntities);
            } else {
                return await insertCountyCleanupEvent(eventEntity, bulkyItemEntities);
            }
        } else {
            console.error(`Error in save(): invalid data did not adhere to CountyCleanupModel.`);
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
            metric.metricTitle = COUNTY_CLEANUP_METRIC_VALUES[code].metricTitle;
            metric.dataLabel = COUNTY_CLEANUP_METRIC_VALUES[code].chartDataLabel;
            metric.chartType = COUNTY_CLEANUP_METRIC_VALUES[code].chartType;
            metric.dataColHeaders.valueHeader = COUNTY_CLEANUP_METRIC_VALUES[code].tableDataLabels.unitLabel;
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
                        COUNTY_CLEANUP_METRIC_VALUES[code].tables[0],
                        COUNTY_CLEANUP_METRIC_VALUES[code].valueCol
                    );
                    break;
                case METRIC_CODES[3]:
                    if (!COUNTY_CLEANUP_METRIC_VALUES[code].extraCols || COUNTY_CLEANUP_METRIC_VALUES[code].extraCols.length < 3) {
                        throw new Error(`Missing necessary columns to get County Neighborhood Cleanup ${code} metric.`);
                    }
                    if (timePeriod.startMonth === undefined || timePeriod.endMonth === undefined) {
                        throw new Error(`Missing start or end month to get County Neighborhood Cleanup ${code} metric.`);
                    }
                    if (COUNTY_CLEANUP_METRIC_VALUES[code].tableDataLabels.dataLabel !== undefined) {
                        metric.dataColHeaders.labelHeader = COUNTY_CLEANUP_METRIC_VALUES[code].tableDataLabels.dataLabel;
                    }
                    result = await getHighestOccurrencesOfAThingMetricUsing3Tables(
                        timePeriod.startMonth,
                        timePeriod.startYear,
                        timePeriod.endMonth,
                        timePeriod.endYear,
                        COUNTY_CLEANUP_METRIC_VALUES[code].tables[0],
                        COUNTY_CLEANUP_METRIC_VALUES[code].tables[1],
                        COUNTY_CLEANUP_METRIC_VALUES[code].tables[2],
                        COUNTY_CLEANUP_METRIC_VALUES[code].extraCols[0],
                        COUNTY_CLEANUP_METRIC_VALUES[code].extraCols[1],
                        COUNTY_CLEANUP_METRIC_VALUES[code].extraCols[2],
                        'SUM',
                        'quantity'
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