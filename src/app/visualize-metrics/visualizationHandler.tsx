'use client'

import { useState } from 'react';
import { MetricSearchModel } from '../models/metrics';
import { MetricSelectionForm } from './metricSelectionForm';
import { Visualizer } from './visualizer';
import { getDataToVisualize } from './actions';
import { LoadingDialog, StatusDialog } from '../components';

export function VisualizationHandler() {
    const [metricTitle, setMetricTitle] = useState<string>('<Select a Metric>');
    const [chartDataLabel, setChartDataLabel] = useState<string>('');
    const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
    const [chartData, setChartData] = useState<{ label: string, value: number }[]>([]);
    const [tableHeaders, setTableHeaders] = useState<{ labelHeader: string, valueHeader: string}>({ labelHeader: 'Label', valueHeader: 'Value' });
    const [isLoadingDialogOpen, setIsLoadingDialogOpen] = useState<boolean>(false);
    const [isNoDataDialogOpen, setIsNoDataDialogOpen] = useState<boolean>(false);

    async function handleVisualize(filters: MetricSearchModel) {
        setIsLoadingDialogOpen(true);
        const data = await getDataToVisualize(filters);
        setIsLoadingDialogOpen(false);
        setMetricTitle(data.metricTitle);
        setChartDataLabel(data.dataLabel);
        setChartType(data.chartType);
        setChartData(data.data);
        setTableHeaders(data.dataColHeaders);
        if (data.data.length === 0) {
            setIsNoDataDialogOpen(true);
        } else {
            setTimeout(() => document.getElementById('metric-title')?.focus(), 100);
        }
    }

    return (
        <div className="flex flex-col sm:flex-row mt-4">
            <LoadingDialog
                isOpen={isLoadingDialogOpen}
                dialogId="metric-dialog"
                dialogTitle="Please wait while we retrieve the metric">
            </LoadingDialog>
            <StatusDialog
                dialogId="no-data-dialog"
                isOpen={isNoDataDialogOpen}
                onClose={() => setIsNoDataDialogOpen(false)}
                title="No Data Found"
                body={
                    <p>
                        No data was found for { metricTitle } for the specified time period.
                        If you think there should be data, try expanding the time period.
                    </p>}
                type="info">
            </StatusDialog>
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