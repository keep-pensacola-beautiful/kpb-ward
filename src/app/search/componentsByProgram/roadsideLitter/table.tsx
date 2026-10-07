import { useEffect, useState } from 'react';
import { Button, SortableTable } from '../../../components';
import { RoadsideLitterEventModel } from '../../../models/event';
import { ProgramCode } from '../../../models/search';
import { TableRowModel } from '../../../components/table/tableRow.model';

export function RoadsideLitterTable({ data, onModify, onDelete }: {
    data: RoadsideLitterEventModel[],
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
                { center: true, data: data[i].litterPounds },
                { center: true, data: data[i].recyclingPounds },
                { center: true, data: data[i].locations },
                { center: true, data: data[i].bulkyItemCount },
                { center: true, data: data[i].districtsDisplay },
                { 
                    center: true, data: <span className="flex flex-row justify-center gap-2">
                        <Button
                            compact={true}
                            design="primary"
                            ariaLabel={`Modify Event with ID ${data[i].id}`}
                            onClick={() => onModify('roadside', data[i].id)}>
                            Modify
                        </Button>
                        <Button
                            compact={true}
                            design="primary"
                            ariaLabel={`Delete Event with ID ${data[i].id}`}
                            onClick={() => onDelete('roadside', data[i].id, data[i].date, i)}>
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
            caption="Roadside Litter Events"
            data={tableData}
            tableHeaders={[
                { center: true, sortable: true, text: 'ID', dataType: 'number' },
                { center: true, sortable: true, text: 'Date', dataType: 'date' },
                { center: true, sortable: true, text: 'Litter Pounds', dataType: 'number' },
                { center: true, sortable: true, text: 'Recycling Pounds', dataType: 'number' },
                { center: true, sortable: false, text: 'Locations', dataType: 'string' },
                { center: true, sortable: true, text: 'Bulky Item Count', dataType: 'number' },
                { center: true, sortable: false, text: 'Districts', dataType: 'string'},
                { center: true, sortable: false, text: 'Actions', dataType: 'unsortable' }
            ]}
            rowShading="even">
        </SortableTable>
    );
}