'use client'

import { useState } from 'react';
import { MetricSearchModel } from '../models/metrics';
import { MetricSelectionForm } from './metricSelectionForm';
import { Visualizer } from './visualizer';
import { getDataToVisualize } from './actions';

export function VisualizationHandler() {
    const [metricTitle, setMetricTitle] = useState<string>('<Select a Metric>');
    const [chartDataLabel, setChartDataLabel] = useState<string>('');
    const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
    const [chartData, setChartData] = useState<{ label: string, value: number }[]>([]);
    const [tableHeaders, setTableHeaders] = useState<{ labelHeader: string, valueHeader: string}>({ labelHeader: 'Label', valueHeader: 'Value' });

    async function handleVisualize(filters: MetricSearchModel) {
        const data = await getDataToVisualize(filters);
        setMetricTitle(data.metricTitle);
        setChartDataLabel(data.dataLabel);
        setChartType(data.chartType);
        setChartData(data.data);
        setTableHeaders(data.dataColHeaders);
    }

    return (
        <div className="flex flex-col sm:flex-row mt-4">
            <MetricSelectionForm onVisualize={handleVisualize}></MetricSelectionForm>
            <Visualizer
                metricTitle={metricTitle}
                chartDataLabel={chartDataLabel}
                chartType={chartType}
                chartData={chartData}
                tableHeaders={tableHeaders}>
            </Visualizer>
        </div>
    );
}