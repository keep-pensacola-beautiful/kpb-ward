export interface TextboxModel {
    inputId: string;
    inputType: string;
    inputName?: string;
    labelText: string;
    descriptionText?: string;
    maxlength?: number;
    step?: number;
    width?: string;
    isRequired?: boolean;
    labelFontWeight?: string;
    errorText?: string;
    compact?: boolean;
    ariaDescribedBy?: string;
}