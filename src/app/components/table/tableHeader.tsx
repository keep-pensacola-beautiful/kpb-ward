export function TableHeader({ scope, center, children }:
    { scope: 'col' | 'row', center: boolean, children: React.ReactNode }
) {
    return (
        <th className={`border p-1 ${center ? 'text-center' : ''}`} scope={scope}>{ children }</th>
    );
}