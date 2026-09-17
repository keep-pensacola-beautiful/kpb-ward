export interface RadioListModel {
    label: string;
    listName: string;
    options: string;
    orientation?: 'col' | 'row';
    descriptionText?: string;
    isRequired?: boolean;
    selectedValue: string;
    handleChange: (event: any) => void;
}