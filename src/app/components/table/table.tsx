import { useEffect, useState } from 'react';
import { TableData } from './tableData';
import { TableRow } from './tableRow';
import { TableDataModel } from './tableData.model';

export function Table({ caption, data, rowShading, maxWidth, children }: {
    caption: string,
    data: TableDataModel[][],
    rowShading: 'even' | 'odd',
    maxWidth?: string,
    children: React.ReactNode
}) {
    const [dataRows, setDataRows] = useState<React.ReactNode[]>([
        <TableRow key="default-row" color="bg-white"><TableData key="default-data" center={false}>Loading...</TableData></TableRow>
    ]);
    useEffect(() => {
        let rows: React.ReactNode[] = [];
        let rowData: React.ReactNode[];
        let rowColor: string = '';
        for (let i = 0; i < data.length; i++) {
            rowData = [];
            if (rowShading === 'even') {
                rowColor = (i % 2 === 0) ? 'bg-[var(--tan)]' : 'bg-white';
            } else {
                rowColor = (i % 2 === 0) ? 'bg-white' : 'bg-[var(--tan)]';
            }

            for (let j = 0; j < data[i].length; j++) {
                rowData.push(<TableData key={`data-${i}-${j}`} center={data[i][j].center}>{ data[i][j].data }</TableData>);
            }
            rows.push(<TableRow key={`table-row-${i}`} color={rowColor}>{ rowData }</TableRow>);
            setDataRows(rows);
        }
    }, [data]);

    return (
        <table className={`${maxWidth !== undefined ? maxWidth : ''} w-[100%]`}>
            <caption className="border p-2 bg-white font-semibold text-left">{ caption }</caption>
            <thead>
                { children }
            </thead>
            <tbody>
                { dataRows }
            </tbody>
        </table>
    );
}