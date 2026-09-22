export function TableRow({ color, children }: { color: string, children: React.ReactNode }) {
    return (
        <tr className={`${color}`}>
            {children}
        </tr>
    )
}