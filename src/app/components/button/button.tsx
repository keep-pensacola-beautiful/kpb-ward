import { ButtonModel } from './button.model';

export function Button({ compact, width, design, color = 'info', type, ariaLabel, onClick, children }: ButtonModel) {
    const DEFAULT_WIDTH: string = 'sm:w-20';
    const COLOR_STYLING = {
        primary: {
            info: 'bg-[var(--deepBlue)] text-[var(--tan)]',
            danger: 'bg-red-700 text-[var(--tan)]',
            success: 'bg-green-800 text-[var(--tan)]'
        },
        secondary: {
            info: 'bg-transparent text-[var(--deepBlue)]',
            danger: 'bg-transparent text-red-700',
            success: 'bg-transparent text-green-800'
        }
    }

    // ${design === 'primary' ? 'bg-[var(--deepBlue)] text-[var(--tan)]' : ''}
    //             ${design === 'secondary' ? 'bg-transparent text-[var(--deepBlue)]' : ''}
    //             ${design === 'danger' ? '' : ''}
    return (
        <button
            {...((onClick !== undefined) ? { onClick: onClick } : '')}
            {...((type !== undefined) ? { type: type } : '')}
            {...((ariaLabel !== undefined) ? { "aria-label": ariaLabel } : '')}
            className={`border rounded-md text-[1.06rem] cursor-pointer w-[100%]
                ${compact ? '' : 'p-1'}
                ${width !== undefined ? width : DEFAULT_WIDTH}
                ${COLOR_STYLING[design][color]}
            `}
            >
            { children }
        </button>
    );
}