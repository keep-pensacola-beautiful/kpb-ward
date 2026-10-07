import { DialogType } from './dialogType.model';

export interface DialogModel {
    isOpen: boolean;
    id: string;
    title: React.ReactNode;
    children: React.ReactNode;
    type?: DialogType;
    heightCss?: string;
    widthCss?: string;
    closeButton?: boolean;
    onClose?: (event: any) => void;
}