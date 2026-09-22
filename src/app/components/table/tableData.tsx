export function TableData({ center, children }: { center: boolean, children: React.ReactNode }) {
    return (
        <td className={`border p-1 pl-10 pr-10 ${center ? 'text-center' : ''}`}>
            { children }
        </td>
    )
}