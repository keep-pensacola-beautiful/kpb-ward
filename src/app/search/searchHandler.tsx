'use client'

import { useState } from 'react';
import { SearchForm } from './searchForm';
import { SearchResultsTable } from './searchResultsTable';

export function SearchHandler() {
    const [showResults, setShowResults] = useState<boolean>(false);

    function handleSearch() {
        setShowResults(true);
    }
    
    function handleNewSearch() {
        setShowResults(false);
    }

    return (
        <div>
            { !showResults &&
                <SearchForm onSearch={handleSearch}></SearchForm>
            }
            { showResults &&
                <SearchResultsTable caption="Search Results" onNewSearch={handleNewSearch}></SearchResultsTable>
            }
        </div>
    );
}