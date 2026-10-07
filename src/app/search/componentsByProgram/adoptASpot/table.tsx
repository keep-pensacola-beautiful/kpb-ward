import { useEffect, useState } from 'react';
import { Button, SortableTable } from '../../../components';
import { AdoptASpotEventModel } from '../../../models/event';
import { ProgramCode } from '../../../models/search';
import { TableRowModel } from '../../../components/table/tableRow.model';

export function AdoptASpotTable({ data, onModify, onDelete }: {
    data: AdoptASpotEventModel[],
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
                { center: true, data: `${data[i].spot.location} - ${data[i].spot.name}` },
                { center: true, data: data[i].litterCollected },
                { center: true, data: data[i].recyclingCollected },
                { center: false, data: data[i].volunteerCount },
                { center: false, data: data[i].volunteerHours },
                { 
                    center: true, data: <span className="flex flex-row justify-center gap-2">
                        <Button
                            compact={true}
                            design="primary"
                            ariaLabel={`Modify Event with ID ${data[i].id}`}
                            onClick={() => onModify('adoptASpot', data[i].id)}>
                            Modify
                        </Button>
                        <Button
                            compact={true}
                            design="primary"
                            ariaLabel={`Delete Event with ID ${data[i].id}`}
                            onClick={() => onDelete('adoptASpot', data[i].id, data[i].date, i)}>
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
            caption="Adopt-a-Spot Cleanup Events"
            data={tableData}
            tableHeaders={[
                { center: true, sortable: true, text: 'ID', dataType: 'number' },
                { center: true, sortable: true, text: 'Date', dataType: 'date' },
                { center: true, sortable: true, text: 'Adopted Spot', dataType: 'string' },
                { center: true, sortable: true, text: 'Litter (lbs)', dataType: 'number' },
                { center: true, sortable: true, text: 'Recycling (lbs)', dataType: 'number' },
                { center: true, sortable: true, text: 'Volunteer Count', dataType: 'number' },
                { center: true, sortable: true, text: 'Volunteer Hours', dataType: 'number' },
                { center: true, sortable: false, text: 'Actions', dataType: 'unsortable' }
            ]}
            rowShading="even">
        </SortableTable>
    );
}