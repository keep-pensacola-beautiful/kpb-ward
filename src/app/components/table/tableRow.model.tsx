import { TableDataModel } from './tableData.model';

export interface TableRowModel {
    data: TableDataModel[];
    color?: string;
    key?: string;
}