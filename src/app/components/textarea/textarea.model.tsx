export interface TextareaModel {
    textareaId: string;
    textareaName?: string;
    labelText: string;
    descriptionText?: string;
    maxlength?: number;
    rows?: number;
    cols?: number;
    isRequired?: boolean;
    defaultValue?: string;
    labelFontWeight?: number;
    errorText?: string;
}