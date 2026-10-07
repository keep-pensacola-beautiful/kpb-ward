export function TableHeader({ scope, center, ariaSort, padding, children }:
    { scope: 'col' | 'row', center: boolean, ariaSort?: string, padding?: string, children: React.ReactNode }
) {
    function getAriaSort(ariaSort: string): 'none' | 'ascending' | 'descending' | 'other' {
        if (ariaSort === 'none') { return 'none'; }
        else if (ariaSort === 'ascending') { return 'ascending'; }
        else if (ariaSort === 'descending') { return 'descending'; }
        else { return 'other'; }
    }

    return (
        <th
            className={`border min-w-[3rem] ${padding !== undefined ? padding : 'p-1'} ${center ? 'text-center' : 'text-left'}`}
            scope={scope}
            {...(ariaSort !== undefined ? { 'aria-sort': getAriaSort(ariaSort) } : '')}
            >
            { children }
        </th>
    );
}