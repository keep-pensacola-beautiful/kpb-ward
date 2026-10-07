export interface ButtonModel {
    compact?: boolean;
    width?: string;
    design: 'primary' | 'secondary';
    color?: 'info' | 'danger' | 'success';
    type?: 'button';
    ariaLabel?: string;
    onClick?: (e: any) => void;
    children: React.ReactNode;
}