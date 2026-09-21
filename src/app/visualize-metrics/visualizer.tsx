'use client'

import { useState } from 'react';
import { RadioList } from '../components';
import { VIEW_FORMAT_VALUES, VIEW_FORMAT_LIST_NAME, VIEW_FORMAT_OPTIONS } from './visualizeMetricsJson';
import { BarChart } from '../components/chartJS/barChart';
import { PieChart } from '../components/chartJS/pieChart';

export function Visualizer({
    metricTitle, chartDataLabel, chartType, chartData
}: { metricTitle: string, chartDataLabel: string, chartType: 'bar' | 'pie', chartData: { label: string, value: number }[]}) {
    const [viewFormat, setViewFormat] = useState<string>(VIEW_FORMAT_VALUES.chart.code);

    function handleViewFormatChange(event: any) {
        setViewFormat(event.target.value);
    }
    
    return (
        <main className="w-1/1">
            <div className="flex flex-row grow-2 justify-between gap-2 mb-4 bg-[var(--gold)] p-2">
                <h2 id="main-content-header" className="text-lg md:text-xl self-center font-semibold">
                    { metricTitle }
                </h2>
                <RadioList
                    label="View Format"
                    listName={VIEW_FORMAT_LIST_NAME}
                    options={JSON.stringify(VIEW_FORMAT_OPTIONS)}
                    selectedValue={viewFormat}
                    handleChange={handleViewFormatChange}
                    orientation="row"
                    >
                </RadioList>
            </div>
            { (chartData && chartData.length > 0 && chartType === 'bar') &&
                <BarChart
                    chartTitle={metricTitle}
                    dataLabel={chartDataLabel}
                    data={chartData}>
                </BarChart>
            }
            { (chartData && chartData.length > 0 && chartType === 'pie') &&
                <PieChart
                    chartTitle={metricTitle}
                    dataLabel={chartDataLabel}
                    data={chartData}>
                </PieChart>
            }
        </main>
    );
}