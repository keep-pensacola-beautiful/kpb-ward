import { EventDAO } from './event.DAO';
import { MetricsDAO } from '../metrics/metrics.DAO';
import { EventModel, TreePlantingEventModel } from '../../models/event';
import { IntervalCode, MetricVisualizeModel } from '../../models/metrics';
import { TreePlantingEventEntity } from '../../entities/event/treePlantingEvent.entity';
import { isTreePlantingEvent } from '../../utils/eventTypeGuards';
import {
    deleteTreePlantingEventById,
    getTreePlantingEventById,
    insertTreePlantingEvent,
    updateTreePlantingEvent
} from '../../lib/event.sql';
import { getColumnSumAsMetricByInterval } from '../../lib/metric.sql';
import { searchTreePlantingEvents } from '../../lib/search.sql';
import { TREE_PLANTING_METRIC_VALUES } from './metricValues';

type MetricCode = 'treeCount' | 'volunteerCount' | 'volunteerHours';
const METRIC_CODES: MetricCode[] = ['treeCount', 'volunteerCount', 'volunteerHours'];

export class TreePlantingEventDAO implements EventDAO, MetricsDAO {
    async getById(id: number): Promise<TreePlantingEventModel | null> {
        if (id <= 0) {
            return null;
        }
        let event: TreePlantingEventModel | null = null;
        let result: any = await getTreePlantingEventById(id);
        if (result !== null && result.length > 0) {
            event = {
                id: result[0].id,
                date: result[0].date,
                treesPlanted: result[0].treeCount,
                eventDescription: result[0].eventDesc,
                volunteerCount: result[0].volunteerCount,
                volunteerHours: result[0].volunteerHours
            }
        }
        return event;
    }

    async save(event: EventModel, isUpdate: boolean): Promise<number> {
        if (isTreePlantingEvent(event)) {
            const eventEntity: TreePlantingEventEntity = {
                id: event.id ? event.id : -1,
                date: event.date,
                treeCount: event.treesPlanted,
                eventDesc: event.eventDescription,
                volunteerCount: event.volunteerCount,
                volunteerHours: event.volunteerHours
            };

            if (isUpdate) {
                return await updateTreePlantingEvent(eventEntity);
            } else {
                return await insertTreePlantingEvent(eventEntity);
            }
        } else {
            console.error(`Error in save(): invalid data did not adhere to TreePlantingEventModel.`);
        }
        return -1;
    }

    async deleteById(id: number): Promise<number> {
        if (id <= 0) {
            return 0;
        }
        return await deleteTreePlantingEventById(id);
    }

    async search(searchCriteria: Map<string, string>): Promise<TreePlantingEventModel[]> {
        const startDate: string | undefined = searchCriteria.get('start-date');
        const endDate: string | undefined = searchCriteria.get('end-date');
        if (startDate === undefined || endDate === undefined) {
            console.error('Error: Unable to search for Tree Planting Events due to missing start date or end date.');
            return [];
        }
        const result: any = await searchTreePlantingEvents(
            startDate, endDate,
            searchCriteria.get('tree-min'), searchCriteria.get('tree-max'),
            searchCriteria.get('vol-count-min'), searchCriteria.get('vol-count-max'),
            searchCriteria.get('event-desc')
        );
        let events: TreePlantingEventModel[] = [];
        if (result !== null && result.length >= 1) {
            result.forEach((row: any) => events.push({
                id: row.id,
                date: row.date,
                treesPlanted: row.treeCount,
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
            metric.metricTitle = TREE_PLANTING_METRIC_VALUES[code].metricTitle;
            metric.dataLabel = TREE_PLANTING_METRIC_VALUES[code].chartDataLabel;
            metric.chartType = TREE_PLANTING_METRIC_VALUES[code].chartType;
            metric.dataColHeaders.valueHeader = TREE_PLANTING_METRIC_VALUES[code].tableDataLabels.unitLabel;
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
                        TREE_PLANTING_METRIC_VALUES[code].tables[0],
                        TREE_PLANTING_METRIC_VALUES[code].valueCol
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