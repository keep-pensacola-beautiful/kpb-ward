import { useEffect, useState } from 'react';
import { Button, SortableTable } from '../../../components';
import { BagSwapEventModel } from '../../../models/event';
import { ProgramCode } from '../../../models/search';
import { TableRowModel } from '../../../components/table/tableRow.model';

export function BagSwapTable({ data, onModify, onDelete }: {
    data: BagSwapEventModel[],
    onModify: (program: ProgramCode, eventId: number | undefined) => void,
    onDelete: (program: ProgramCode, id: number | undefined, date: string, index: number) => void
}): React.ReactNode {
    const [tableData, setTableData] = useState<TableRowModel[]>([])
    useEffect(() => {
        let rows: TableRowModel[] = [];
        for (let i = 0; i < data.length; i++) {
            rows.push({ data: [
                { center: true, data: data[i].id !== undefined ? data[i].id : -1 },
                { center: true, data: data[i].date },
                { center: true, data: data[i].bagsCollected },
                { center: true, data: data[i].eventDescription },
                { center: false, data: data[i].volunteerCount },
                { center: false, data: data[i].volunteerHours },
                { 
                    center: true, data: <span className="flex flex-row justify-center gap-2">
                        <Button
                            compact={true}
                            design="primary"
                            ariaLabel={`Modify Event with ID ${data[i].id}`}
                            onClick={() => onModify('bagSwap', data[i].id)}>
                            Modify
                        </Button>
                        <Button
                            compact={true}
                            design="primary"
                            ariaLabel={`Delete Event with ID ${data[i].id}`}
                            onClick={() => onDelete('bagSwap', data[i].id, data[i].date, i)}>
                            Delete
                        </Button>
                    </span>
                }
            ]});
        }
        setTableData(rows);
    }, [data]);

    function onDeleteRow(index: number, date: string) {
        console.log('Delete row');
    }

    return (
        <SortableTable
            caption="Bag Swap Events"
            data={tableData}
            tableHeaders={[
                { center: true, sortable: true, text: 'ID', dataType: 'number' },
                { center: true, sortable: true, text: 'Date', dataType: 'date' },
                { center: true, sortable: true, text: 'Bag Count', dataType: 'number' },
                { center: true, sortable: false, text: 'Event Description', dataType: 'string' },
                { center: true, sortable: true, text: 'Volunteer Count', dataType: 'number' },
                { center: true, sortable: true, text: 'Volunteer Hours', dataType: 'number' },
                { center: true, sortable: false, text: 'Actions', dataType: 'unsortable' }
            ]}
            rowShading="even">
        </SortableTable>
    );
}