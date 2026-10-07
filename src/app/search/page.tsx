import { Metadata } from 'next';
import { SearchHandler } from './searchHandler';

export const metadata: Metadata = {
  title: 'Search | WARD',
  description: 'Search for KPB events and cleanups'
};

export default function SearchEventsAndCleanups() {
    return (
        <div className="px-2 sm:px-4 md:px-8">
            <SearchHandler></SearchHandler>
        </div>
    );
}