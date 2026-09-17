export interface MetricVisualizeModel {
    metricTitle: string;
    dataLabel: string;
    chartType: 'bar' | 'pie';
    data: { label: string, value: number }[];
}