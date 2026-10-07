export interface TableHeaderModel {
    center: boolean;
    sortable?: boolean;
    text: string;
    dataType: 'date' | 'string' | 'number' | 'unsortable';
    key?: string;
    index?: number;
}