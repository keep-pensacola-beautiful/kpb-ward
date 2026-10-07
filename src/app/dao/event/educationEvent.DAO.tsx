import { EventDAO } from './event.DAO';
import { MetricsDAO } from '../metrics/metrics.DAO';
import { EducationEventEntity } from '../../entities/event/educationEvent.entity';
import { EducationEventModel, EventModel } from '../../models/event';
import { IntervalCode, MetricVisualizeModel } from '../../models/metrics';
import { isEducationEvent } from '../../utils/eventTypeGuards';
import {
    deleteEducationEventById,
    getEducationEventById,
    insertEducationEvent,
    updateEducationEvent
} from '../../lib/event.sql';
import { getColumnSumAsMetricByInterval, getHighestOccurrencesOfAThingMetricUsing2Tables } from '../../lib/metric.sql';
import { searchEducationEvents } from '../../lib/search.sql';
import { EDUCATION_METRIC_VALUES } from './metricValues';

type MetricCode = 'studentCount' | 'volunteerCount' | 'volunteerHours' | 'topRecipients' | 'topTopics';
const METRIC_CODES: MetricCode[] = ['studentCount', 'volunteerCount', 'volunteerHours', 'topRecipients', 'topTopics'];

export class EducationEventDAO implements EventDAO, MetricsDAO {
    async getById(id: number): Promise<EducationEventModel | null> {
        if (id <= 0) {
            return null;
        }
        let event: EducationEventModel | null = null;
        let result: any = await getEducationEventById(id);
        if (result !== null && result.length > 0) {
            event = {
                id: result[0].id,
                date: result[0].date,
                duration: result[0].eventLength,
                studentCount: result[0].studentCount,
                volunteerCount: result[0].volunteerCount,
                volunteerHours: result[0].volunteerHours,
                recipient: { id: result[0].recipientId, name: result[0].recipient },
                topic: { code: result[0].topicId, description: result[0].topic }
            }
        }
        return event;
    }

    async save(event: EventModel, isUpdate: boolean): Promise<number> {
        if (isEducationEvent(event)) {
            const topicId: number = Number.isNaN(Number(event.topic.code)) ? -1 : Number(event.topic.code);
            const recipientId: number = event.recipient.id ? event.recipient.id : -1;
            if (topicId === -1 || recipientId === -1) {
                console.error(`Error in save(): no valid topic or recipient in Education Event.`);
                return -1;
            }
            const eventEntity: EducationEventEntity = {
                id: event.id ? event.id : -1,
                date: event.date,
                topicId: topicId,
                recipientId: recipientId,
                eventLength: event.duration,
                studentCount: event.studentCount,
                volunteerCount: event.volunteerCount,
                volunteerHours: event.volunteerHours
            };

            if (isUpdate) {
                return await updateEducationEvent(eventEntity);
            } else {
                return await insertEducationEvent(eventEntity);
            }
        } else {
            console.error(`Error in save(): invalid data did not adhere to EducationEventModel.`);
        }
        return -1;
    }

    async deleteById(id: number): Promise<number> {
        if (id <= 0) {
            return 0;
        }
        return await deleteEducationEventById(id);
    }

    async search(searchCriteria: Map<string, string>): Promise<EducationEventModel[]> {
        const startDate: string | undefined = searchCriteria.get('start-date');
        const endDate: string | undefined = searchCriteria.get('end-date');
        if (startDate === undefined || endDate === undefined) {
            console.error('Error: Unable to search for Education Events due to missing start date or end date.');
            return [];
        }
        const result: any = await searchEducationEvents(
            startDate, endDate,
            searchCriteria.get('student-min'), searchCriteria.get('student-max'),
            searchCriteria.get('topic-combobox-input'),
            searchCriteria.get('recipient-combobox-input'),
            searchCriteria.get('vol-count-min'), searchCriteria.get('vol-count-max'),
        );
        let events: EducationEventModel[] = [];
        if (result !== null && result.length >= 1) {
            result.forEach((row: any) => events.push({
                id: row.id,
                date: row.date,
                studentCount: row.studentCount,
                duration: row.eventLength,
                volunteerCount: row.volunteerCount,
                volunteerHours: row.volunteerHours,
                topic: { description: row.topic },
                recipient: { name: row.name }
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
            metric.metricTitle = EDUCATION_METRIC_VALUES[code].metricTitle;
            metric.dataLabel = EDUCATION_METRIC_VALUES[code].chartDataLabel;
            metric.chartType = EDUCATION_METRIC_VALUES[code].chartType;
            metric.dataColHeaders.valueHeader = EDUCATION_METRIC_VALUES[code].tableDataLabels.unitLabel;
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
                        EDUCATION_METRIC_VALUES[code].tables[0],
                        EDUCATION_METRIC_VALUES[code].valueCol
                    );
                    break;
                case METRIC_CODES[3]:
                case METRIC_CODES[4]:
                    if (!EDUCATION_METRIC_VALUES[code].extraCols || EDUCATION_METRIC_VALUES[code].extraCols.length < 2) {
                        throw new Error(`Missing necessary columns to get Education Event ${code} metric.`);
                    }
                    if (timePeriod.startMonth === undefined || timePeriod.endMonth === undefined) {
                        throw new Error(`Missing start or end month to get Education Event ${code} metric.`);
                    }
                    if (EDUCATION_METRIC_VALUES[code].tableDataLabels.dataLabel !== undefined) {
                        metric.dataColHeaders.labelHeader = EDUCATION_METRIC_VALUES[code].tableDataLabels.dataLabel;
                    }
                    result = await getHighestOccurrencesOfAThingMetricUsing2Tables(
                        timePeriod.startMonth,
                        timePeriod.endMonth,
                        timePeriod.startYear,
                        timePeriod.endYear,
                        EDUCATION_METRIC_VALUES[code].tables[0],
                        EDUCATION_METRIC_VALUES[code].tables[1],
                        EDUCATION_METRIC_VALUES[code].extraCols[0],
                        EDUCATION_METRIC_VALUES[code].extraCols[1]
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