import { ButtonModel } from './button.model';

export function Button({ compact, width, design, onClick, children }: ButtonModel) {
    const DEFAULT_WIDTH: string = 'sm:w-20';
    return (
        <button
            {...((onClick !== undefined) ? { onClick: onClick } : '')}
            className={`border rounded-md text-[1.06rem] cursor-pointer
                ${compact ? '' : 'p-1'}
                ${width !== undefined ? width : DEFAULT_WIDTH}
                ${design === 'primary' ? 'bg-[var(--deepBlue)] text-[var(--tan)]' : 'bg-transparent text-[var(--deepBlue)]'}
            `}
            >
            { children }
        </button>
    );
}