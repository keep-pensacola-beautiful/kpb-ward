import { IntervalCode, MetricVisualizeModel } from '../../models/metrics';

export interface TotalMetricsDAO {
    getTotalMetric(
        timePeriod: {
            startMonth?: number, endMonth?: number,
            startQuarter?: number, endQuarter?: number,
            startYear: number, endYear: number
        },
        metricCode: string,
        interval: IntervalCode
    ): Promise<MetricVisualizeModel>;
}