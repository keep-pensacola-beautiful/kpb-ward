export interface ButtonModel {
    compact?: boolean;
    width?: string;
    design: 'primary' | 'secondary';
    onClick?: () => void;
    children: React.ReactNode;
}