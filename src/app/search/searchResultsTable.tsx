'use client'

import { Table, TableHeader, TableRow } from '../components';

export function SearchResultsTable({ caption, onNewSearch }: { caption: string, onNewSearch: () => void }): React.ReactNode {
    return (
        <Table
            caption={caption}
            data={JSON.stringify([[{ center: true, data: 'data' }, { center: true, data: 'data' }]])}
            rowShading="even">
            <TableRow color="bg-[var(--gold)]">
                <TableHeader scope="col" center={true}>Header</TableHeader>
                <TableHeader scope="col" center={true}>Header</TableHeader>
            </TableRow>
        </Table>
    )
}