import { useEffect, useState } from 'react';
import { TableData } from './tableData';
import { TableRow } from './tableRow';
import { TableRowModel } from './tableRow.model';

export function Table({ data, rowShading, children }: {
    data: string,
    rowShading: 'even' | 'odd',
    children: React.ReactNode
}) {
    const [dataRows, setDataRows] = useState<React.ReactNode[]>([<TableRow color="bg-white"><TableData center={false}>Loading...</TableData></TableRow>]);
    useEffect(() => {
        const tableData: TableRowModel[][] = parseDataJson(data);
        let rows: React.ReactNode[] = [];
        let rowData: React.ReactNode[];
        let rowColor: string = '';
        for (let i = 0; i < tableData.length; i++) {
            rowData = [];
            if (rowShading === 'even') {
                rowColor = (i % 2 === 0) ? 'bg-[var(--tan)]' : 'bg-white';
            } else {
                rowColor = (i % 2 === 0) ? 'bg-white' : 'bg-[var(--tan)]';
            }

            for (let j = 0; j < tableData[i].length; j++) {
                rowData.push(<TableData center={tableData[i][j].center}>{ tableData[i][j].data }</TableData>);
            }
            rows.push(<TableRow key={`table-row-${i}`} color={rowColor}>{ rowData }</TableRow>);
            setDataRows(rows);
        }
    }, [data]);

    function parseDataJson(jsonDataString: string) {
        try {
            let dataJson: any[] = JSON.parse(jsonDataString);
            if (dataJson && dataJson.constructor === [].constructor && dataJson[0].constructor === [].constructor) {
                return dataJson;
            } else {
                throw new Error('JSON data for table rows did not match expected type.');
            }
        } catch (error) {
            console.error(`Error: Parsing JSON failed. ${error}`);
            return [];
        }
    }

    return (
        <table>
            <thead>
                { children }
            </thead>
            <tbody>
                { dataRows }
            </tbody>
        </table>
    );
}