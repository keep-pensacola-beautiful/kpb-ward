import { useEffect, useState, useRef } from 'react';
import { TableData } from './tableData';
import { TableHeader } from './tableHeader';
import { TableHeaderModel } from './tableHeader.model';
import { TableRow } from './tableRow';
import { TableDataModel } from './tableData.model';
import { TableRowModel } from './tableRow.model';

export function SortableTable({ caption, tableHeaders, data, rowShading, maxWidth }: {
    caption: string,
    tableHeaders: TableHeaderModel[],
    data: TableRowModel[],
    rowShading: 'even' | 'odd',
    maxWidth?: string
}) {
    const [colHeaders, setColHeaders] = useState<TableHeaderModel[]>([{
        key: 'default-header', center: true, text: 'Header', dataType: 'string', index: 0
    }]); 
    const [dataRows, setDataRows] = useState<TableRowModel[]>([]);
    const [currSortedColIndex, setCurrSortedColIndex] = useState<number>(1);
    const [currSortedColSort, setCurrSortedColSort] = useState<string>('descending');
    const tableRef = useRef<HTMLTableElement>(null);
    useEffect(() => {
        let headerRow: TableHeaderModel[] = [];
        for (let i = 0; i < tableHeaders.length; i++) {
            headerRow.push({
                key: tableHeaders[i].text,
                center: tableHeaders[i].center,
                text: tableHeaders[i].text,
                dataType: tableHeaders[i].dataType,
                index: i,
                sortable: tableHeaders[i].sortable
            });
        }
        setColHeaders(headerRow);
        setDataRows(prepareDataRows(data));
    }, [tableHeaders, data, currSortedColIndex, currSortedColSort]);

    function prepareDataRows(tableData: TableRowModel[]): TableRowModel[] {
        let rows: TableRowModel[] = [];
        let rowData: TableDataModel[];
        let rowColor: string = '';
        for (let i = 0; i < tableData.length; i++) {
            rowData = [];
            if (rowShading === 'even') {
                rowColor = (i % 2 === 0) ? 'bg-[var(--tan)]' : 'bg-white';
            } else {
                rowColor = (i % 2 === 0) ? 'bg-white' : 'bg-[var(--tan)]';
            }

            for (let j = 0; j < tableData[i].data.length; j++) {
                rowData.push({ data: tableData[i].data[j].data, center: tableData[i].data[j].center, key: `data-${i}-${j}` });
            }
            rows.push({ data: rowData, key: `table-row-${i}`, color: rowColor });
        }
        return rows;
    }

    function sortColumn(columnIndex: number, sortValue: string, dataType: 'date' | 'number' | 'string' | 'unsortable') {
        function compareValues(a: any, b: any) {
            let aCol = a.data[columnIndex];
            let bCol = b.data[columnIndex];
            if (sortValue === 'ascending') {
                if (aCol.data === bCol.data) {
                    return 0;
                } else {
                    if (dataType === 'number') {
                        return aCol.data - bCol.data;
                    } else {
                        return aCol.data < bCol.data ? -1 : 1;
                    }
                }
            } else {
                if (aCol.data === bCol.data) {
                    return 0;
                } else {
                    if (dataType === 'number') {
                        return bCol.data - aCol.data;
                    } else {
                        return aCol.data > bCol.data ? -1 : 1;
                    }
                }
            }
        }

        if (dataType === 'unsortable') {
            return;
        }

        data.sort(compareValues);
    }

    /* EVENT HANDLERS */

    function handleClick(colIndex: number | undefined) {
        if (colIndex === undefined) {
            colIndex = 0;
        }
        setCurrSortedColIndex(colIndex);
        const dataType = tableHeaders[colIndex].dataType;
        if (dataType === 'unsortable') {
            return;
        }
        if (currSortedColIndex === colIndex) {
            if (currSortedColSort === 'descending') {
                setCurrSortedColSort('ascending');
                sortColumn(colIndex, 'ascending', dataType);
            } else {
                setCurrSortedColSort('descending');
                sortColumn(colIndex, 'descending', dataType);
            }
        } else {
            setCurrSortedColSort('ascending');
            sortColumn(colIndex, 'ascending', dataType);
        }
    }

    return (
        <table ref={tableRef} className={`${maxWidth !== undefined ? maxWidth : ''} w-[100%]`}>
            <caption className="border p-2 bg-white font-semibold text-left">
                {caption}
                <span className="sr-only"> (column headers with buttons are sortable).</span>
            </caption>
            <thead>
                <TableRow color="bg-[var(--gold)]">
                    { colHeaders.map((header) => {
                        if (header.sortable && header.dataType !== 'unsortable') {
                            return (
                                <TableHeader
                                    key={header.key}
                                    scope="col"
                                    center={header.center}
                                    padding=""
                                    ariaSort={currSortedColIndex === header.index ? currSortedColSort : undefined}>
                                    <button
                                        onClick={() => handleClick(header.index)}
                                        data-column-index={`${header.index}`}
                                        className={`p-[4px] m-[1px] font-semibold bg-transparent inline w-[97%] cursor-pointer
                                            focus:border-2 focus:p-[2px] focus:border-(--deepBlue) focus:bg-white
                                            hover:border-2 hover:p-[2px] hover:border-(--deepBlue) hover:bg-white
                                        `}>
                                        { header.text }
                                        <span
                                            aria-hidden="true"
                                            className={`
                                                absolute
                                                ml-1
                                                ${currSortedColIndex === header.index && currSortedColSort === 'descending' ? `after:content-['▼']` : ''}
                                                ${currSortedColIndex === header.index && currSortedColSort === 'ascending' ? `after:content-['▲']` : ''}
                                                ${currSortedColIndex !== header.index ? `after:content-['♢']` : ''}
                                                after:right-[4px] after:top-[0]
                                            `}>
                                        </span>
                                    </button>
                                </TableHeader>
                            );
                        } else {
                            return <TableHeader
                                key={header.key}
                                scope="col"
                                center={header.center}>
                                {header.text}
                            </TableHeader>
                        }
                    }) }
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