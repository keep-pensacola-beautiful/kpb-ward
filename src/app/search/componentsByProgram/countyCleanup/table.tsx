import { useEffect, useState } from 'react';
import { Button, SortableTable } from '../../../components';
import { CountyCleanupEventModel } from '../../../models/event';
import { ProgramCode } from '../../../models/search';
import { TableRowModel } from '../../../components/table/tableRow.model';

export function CountyCleanupTable({ data, onModify, onDelete }: {
    data: CountyCleanupEventModel[],
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
                { center: true, data: data[i].tireCount },
                { center: true, data: data[i].tirePounds },
                { center: true, data: data[i].paintCanAndHouseholdChemicalCount },
                { center: true, data: data[i].paintCanAndHouseholdChemicalPounds },
                { center: false, data: data[i].otherBulkyItemPounds },
                { center: false, data: data[i].bulkyItemCount },
                { 
                    center: true, data: <span className="flex flex-row justify-center gap-2">
                        <Button
                            compact={true}
                            design="primary"
                            ariaLabel={`Modify Event with ID ${data[i].id}`}
                            onClick={() => onModify('countyCleanup', data[i].id)}>
                            Modify
                        </Button>
                        <Button
                            compact={true}
                            design="primary"
                            ariaLabel={`Delete Event with ID ${data[i].id}`}
                            onClick={() => onDelete('countyCleanup', data[i].id, data[i].date, i)}>
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
            caption="County Neighborhood Cleanup Events"
            data={tableData}
            tableHeaders={[
                { center: true, sortable: true, text: 'ID', dataType: 'number' },
                { center: true, sortable: true, text: 'Date', dataType: 'date' },
                { center: true, sortable: true, text: 'Tire Count', dataType: 'number' },
                { center: true, sortable: true, text: 'Tire Pounds', dataType: 'number' },
                { center: true, sortable: true, text: 'Paint Cans & Household Chemical Count', dataType: 'number' },
                { center: true, sortable: true, text: 'Paint Cans & Household Chemical Pounds', dataType: 'number' },
                { center: true, sortable: true, text: 'Bulky Item Pounds', dataType: 'number' },
                { center: true, sortable: true, text: 'Bulky Item Count', dataType: 'number' },
                { center: true, sortable: false, text: 'Actions', dataType: 'unsortable' }
            ]}
            rowShading="even">
        </SortableTable>
    );
}