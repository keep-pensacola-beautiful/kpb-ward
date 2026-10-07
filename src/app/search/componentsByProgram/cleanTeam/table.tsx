import { useEffect, useState } from 'react';
import { Button, SortableTable } from '../../../components';
import { CleanTeamEventModel } from '../../../models/event';
import { ProgramCode } from '../../../models/search';
import { TableRowModel } from '../../../components/table/tableRow.model';

export function CleanTeamTable({ data, onModify, onDelete }: {
    data: CleanTeamEventModel[],
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
                { center: true, data: data[i].trashPounds },
                { center: true, data: data[i].recyclingPounds },
                { center: false, data: data[i].eventDescription },
                { 
                    center: true, data: <span className="flex flex-row justify-center gap-2">
                        <Button
                            compact={true}
                            design="primary"
                            ariaLabel={`Modify Event with ID ${data[i].id}`}
                            onClick={() => onModify('cleanTeam', data[i].id)}>
                            Modify
                        </Button>
                        <Button
                            compact={true}
                            design="primary"
                            ariaLabel={`Delete Event with ID ${data[i].id}`}
                            onClick={() => onDelete('cleanTeam', data[i].id, data[i].date, i)}>
                            Delete
                        </Button>
                    </span>
                }
            ]});
        }
        setTableData(rows);
    }, [data]);

    return (
        <SortableTable
            caption="Clean Team Events"
            data={tableData}
            tableHeaders={[
                { center: true, sortable: true, text: 'ID', dataType: 'number' },
                { center: true, sortable: true, text: 'Date', dataType: 'date' },
                { center: true, sortable: true, text: 'Trash (lbs)', dataType: 'number' },
                { center: true, sortable: true, text: 'Recycling (lbs)', dataType: 'number' },
                { center: true, sortable: false, text: 'Event Description', dataType: 'string' },
                { center: true, sortable: false, text: 'Actions', dataType: 'unsortable' }
            ]}
            rowShading="even">
        </SortableTable>
    );
}