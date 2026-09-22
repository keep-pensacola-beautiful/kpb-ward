import { Metadata } from 'next';
import { SearchHandler } from './searchHandler';

export const metadata: Metadata = {
  title: 'Search | WARD',
  description: 'Search for KPB events and cleanups',
  icons: ['./favicon.png']
};

export default function SearchEventsAndCleanups() {
    return (
        <div className="px-2 sm:px-4 md:px-8">
            <header>
                <h1 id="main-content-header" className="text-xl md:text-2xl" tabIndex={-1}>
                    Search Events & Cleanups
                </h1>
                <p>
                    Select a Data Category and a KPB Program, then enter at least one of the criteria and select the Search button.
                </p>
            </header>
            <SearchHandler></SearchHandler>
        </div>
    );
}