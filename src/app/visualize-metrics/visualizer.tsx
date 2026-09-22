'use client'

import { useState } from 'react';
import {
    RadioList,
    Table,
    TableRow,
    TableHeader
} from '../components';
import { TableRowModel } from '../components/table/tableRow.model';
import { VIEW_FORMAT_VALUES, VIEW_FORMAT_LIST_NAME, VIEW_FORMAT_OPTIONS } from './visualizeMetricsJson';
import { BarChart } from '../components/chartJS/barChart';
import { PieChart } from '../components/chartJS/pieChart';

export function Visualizer({
    metricTitle, chartDataLabel, chartType, chartData, tableHeaders
}: {
    metricTitle: string,
    chartDataLabel: string,
    chartType: 'bar' | 'pie',
    chartData: { label: string, value: number }[],
    tableHeaders: { labelHeader: string, valueHeader: string }
}) {
    const [viewFormat, setViewFormat] = useState<string>(VIEW_FORMAT_VALUES.chart.code);

    function handleViewFormatChange(event: any) {
        setViewFormat(event.target.value);
    }

    function getVisualization() {
        if (chartData && chartData.length > 0) {
            if (viewFormat === VIEW_FORMAT_VALUES.chart.code) {
                if (chartType === 'bar') {
                    return (
                        <BarChart
                            chartTitle={metricTitle}
                            dataLabel={chartDataLabel}
                            data={chartData}>
                        </BarChart>
                    );
                } else if (chartType === 'pie') {
                    return (
                        <PieChart
                            chartTitle={metricTitle}
                            dataLabel={chartDataLabel}
                            data={chartData}>
                        </PieChart>
                    );
                }
            } else if (viewFormat === VIEW_FORMAT_VALUES.table.code) {
                return getTable();
            }
        }
    }

    function getTable() {
        let tableData: TableRowModel[][] = [[]];
        for (let i = 0; i < chartData.length; i++) {
            tableData.push(
                [{ center: true, data: chartData[i].label }, { center: true, data: chartData[i].value }]
            );
        }
        return (
            <div className="ml-4 mb-4">
                <Table
                    caption={metricTitle}
                    data={JSON.stringify(tableData)}
                    rowShading="even">
                    <TableRow color="bg-[var(--gold)]">
                        <TableHeader scope="col" center={true}>{ tableHeaders.labelHeader }</TableHeader>
                        <TableHeader scope="col" center={true}>{ tableHeaders.valueHeader }</TableHeader>
                    </TableRow>
                </Table>
            </div>
        );
    }
    
    return (
        <main className="w-1/1 bg-white">
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
            { getVisualization() }
        </main>
    );
}