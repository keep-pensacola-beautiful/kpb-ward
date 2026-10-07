import { useEffect, useState } from 'react';
import { TableData } from './tableData';
import { TableHeader } from './tableHeader';
import { TableHeaderModel } from './tableHeader.model';
import { TableRow } from './tableRow';
import { TableDataModel } from './tableData.model';
import { TableRowModel } from './tableRow.model';

export function Table({ caption, tableHeaders, data, rowShading, maxWidth }: {
    caption: string,
    tableHeaders: TableHeaderModel[],
    data: TableDataModel[][],
    rowShading: 'even' | 'odd',
    maxWidth?: string
}) {
    const [colHeaders, setColHeaders] = useState<TableHeaderModel[]>([{
        key: 'default-header', center: true, text: 'Header', dataType: 'string', index: 0
    }]);
    const [dataRows, setDataRows] = useState<TableRowModel[]>([]);

    useEffect(() => {
        let headerRow: TableHeaderModel[] = [];
        for (let i = 0; i < tableHeaders.length; i++) {
            headerRow.push({
                key: `${tableHeaders[i].text}`,
                center: tableHeaders[i].center,
                text: tableHeaders[i].text,
                dataType: tableHeaders[i].dataType
            });
        }
        setColHeaders(headerRow);

        let rows: TableRowModel[] = [];
        let rowData: TableDataModel[];
        let rowColor: string = '';
        for (let i = 0; i < data.length; i++) {
            rowData = [];
            if (rowShading === 'even') {
                rowColor = (i % 2 === 0) ? 'bg-[var(--tan)]' : 'bg-white';
            } else {
                rowColor = (i % 2 === 0) ? 'bg-white' : 'bg-[var(--tan)]';
            }

            for (let j = 0; j < data[i].length; j++) {
                rowData.push({ key: `data-${i}-${j}`, center: data[i][j].center, data: data[i][j].data });
                // rowData.push(<TableData key={`data-${i}-${j}`} center={data[i][j].center}>{data[i][j].data}</TableData>);
            }
            rows.push({ key: `table-row-${i}`, color: rowColor, data: rowData });
            // rows.push(<TableRow key={`table-row-${i}`} color={rowColor}>{rowData}</TableRow>);
            setDataRows(rows);
        }
    }, [tableHeaders, data]);

    return (
        <table className={`${maxWidth !== undefined ? maxWidth : ''} w-[100%]`}>
            <caption className="border p-2 bg-white font-semibold text-left">{caption}</caption>
            <thead>
                <TableRow color="bg-[var(--gold)]">
                    { colHeaders.map((header) => (
                        <TableHeader
                            key={header.key}
                            scope="col"
                            center={header.center}>
                            {header.text}
                        </TableHeader>
                    ))}
                </TableRow>
            </thead>
            <tbody>
                { dataRows.map((row) => {
                    return (<TableRow key={row.key} color={row.color !== undefined ? row.color : 'bg-white'}>
                        { row.data.map((td) => {
                            return (<TableData key={td.key} center={td.center}>{td.data}</TableData>)
                        })}
                    </TableRow>)
                })}
            </tbody>
        </table>
    );
}