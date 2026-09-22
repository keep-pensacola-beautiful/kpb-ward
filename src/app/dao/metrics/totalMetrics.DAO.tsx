import { IntervalCode, MetricVisualizeModel } from '../../models/metrics';
import { MetricsDAO } from './metrics.DAO';
import { callTotalMetricsStoredProcedure } from '../../lib/metric.sql';
import { getFirstMonthOfQuarter } from '../../utils/getFirstMonthOfQuarter';
import { TOTAL_METRIC_VALUES } from '../event/metricValues';

type MetricCode = 'trashLbs' | 'recyclingLbs' | 'volunteerHours' | 'volunteerCount';
const METRIC_CODES: MetricCode[] = ['trashLbs', 'recyclingLbs', 'volunteerHours', 'volunteerCount'];

export class TotalMetricsDAO implements MetricsDAO {
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
        try {
            if (!METRIC_CODES.includes(metricCode as any)) {
                throw new Error(`Error: Invalid metric code '${metricCode}'`);
            }
            const code: MetricCode = metricCode as any;
            let result: any = null;
            metric.metricTitle = TOTAL_METRIC_VALUES[code].metricTitle;
            metric.dataLabel = TOTAL_METRIC_VALUES[code].chartDataLabel;
            metric.chartType = TOTAL_METRIC_VALUES[code].chartType;
            metric.dataColHeaders.valueHeader = TOTAL_METRIC_VALUES[code].tableDataLabels.unitLabel;
            switch (code) {
                case METRIC_CODES[0]:
                case METRIC_CODES[1]:
                case METRIC_CODES[2]:
                case METRIC_CODES[3]:
                    if (!TOTAL_METRIC_VALUES[code].procedures || TOTAL_METRIC_VALUES[code].procedures.length < 3) {
                        throw new Error(`Missing necessary procedures to call to get Total ${code} metric.`);
                    }
                    if (interval === 'month') {
                        if (timePeriod.startMonth === undefined || timePeriod.endMonth === undefined) {
                            throw new Error('Missing start or end month required to get total metric.');
                        }
                        result = await callTotalMetricsStoredProcedure(
                            timePeriod.startMonth,
                            timePeriod.endMonth,
                            timePeriod.startYear,
                            timePeriod.endYear,
                            TOTAL_METRIC_VALUES[code].procedures[0]
                        );
                        metric.metricTitle += ' by Month';
                        metric.dataColHeaders.labelHeader = 'Month'
                    } else if (interval === 'quarter') {
                        if (timePeriod.startQuarter === undefined || timePeriod.endQuarter === undefined) {
                            throw new Error('Missing start or end quarter required to get total metric.');
                        }
                        let firstMonthInStartQuarter: number = getFirstMonthOfQuarter(timePeriod.startQuarter);
                        let firstMonthInEndQuarter: number = getFirstMonthOfQuarter(timePeriod.endQuarter);
                        result = await callTotalMetricsStoredProcedure(
                            firstMonthInStartQuarter,
                            firstMonthInEndQuarter,
                            timePeriod.startYear,
                            timePeriod.endYear,
                            TOTAL_METRIC_VALUES[code].procedures[1]
                        );
                        metric.metricTitle += ' by Quarter';
                        metric.dataColHeaders.labelHeader = 'Quarter'
                    } else if (interval === 'year') {
                        let month: number = getFirstMonthOfQuarter(4);
                        result = await callTotalMetricsStoredProcedure(
                            month,
                            month,
                            timePeriod.startYear,
                            timePeriod.endYear,
                            TOTAL_METRIC_VALUES[code].procedures[2]
                        );
                        metric.metricTitle += ' by Year';
                        metric.dataColHeaders.labelHeader = 'Year'
                    }
                    break;
            }
            if (result !== null && result.length >= 1) {
                result[0].forEach((row: any) => metric.data.push({ label: row.label, value: row.value }));
            }
        } catch (err) {
            console.error(`Error: Unable get total metric: ${err}`);
        }
        return metric;
    }
}