export interface MetricVisualizeModel {
    metricTitle: string;
    dataLabel: string;
    dataColHeaders: { labelHeader: string, valueHeader: string };
    chartType: 'bar' | 'pie';
    data: { label: string, value: number }[];
}