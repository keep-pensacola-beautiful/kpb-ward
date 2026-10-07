'use client'

import { Button } from '../components';
import { EventModel } from '../models/event';
import { ProgramCode } from '../models/search';
import { AdoptASpotTable } from './componentsByProgram/adoptASpot/table';
import { BagSwapTable } from './componentsByProgram/bagSwap/table';
import { CleanTeamTable } from './componentsByProgram/cleanTeam/table';
import { CountyCleanupTable } from './componentsByProgram/countyCleanup/table';
import { EducationTable } from './componentsByProgram/education/table';
import { GroupCleanupTable } from './componentsByProgram/groupCleanup/table';
import { RoadsideLitterTable } from './componentsByProgram/roadsideLitter/table';
import { TrashRoutesTable } from './componentsByProgram/trashRoutes/table';
import { TreePlantingTable } from './componentsByProgram/treePlanting/table';
import {
    isAdoptASpotEventArray,
    isBagSwapEventArray,
    isCleanTeamEventArray,
    isCountyCleanupEventArray,
    isEducationEventArray,
    isGroupCleanupEventArray,
    isRoadsideLitterEventArray,
    isTrashRoutesEventArray,
    isTreePlantingEventArray
} from '../utils/eventTypeGuards';


export function SearchResultsTable({ data, onModify, onDelete, onNewSearch }: {
    data: EventModel[],
    onModify: (program: ProgramCode, eventId: number | undefined) => void,
    onDelete: (program: ProgramCode, id: number | undefined, date: string, index: number) => void,
    onNewSearch: () => void
}): React.ReactNode {
    if (data.length < 1) {
        return (
            <div>
                <p className="mb-2">
                    There are no events matching the search criteria.
                    Please return to the search page by selecting the 'Return to Search' button.
                </p>
                <Button design="primary" width="sm:w-40" onClick={onNewSearch}>Return to Search</Button>
            </div>
        );
    }

    if (isCleanTeamEventArray(data)) {
        return (
            <div className="flex flex-col gap-3 mt-4">
                <CleanTeamTable data={data} onModify={onModify} onDelete={onDelete}></CleanTeamTable>
                <Button design="primary" width="sm:w-30" onClick={onNewSearch}>New Search</Button>
            </div>
        );
    } else if (isCountyCleanupEventArray(data)) {
        return (
            <div className="flex flex-col gap-3 mt-4">
                <CountyCleanupTable data={data} onModify={onModify} onDelete={onDelete}></CountyCleanupTable>
                <Button design="primary" width="sm:w-30" onClick={onNewSearch}>New Search</Button>
            </div>
        );
    } else if (isRoadsideLitterEventArray(data)) {
        return (
            <div className="flex flex-col gap-3 mt-4">
                <RoadsideLitterTable data={data} onModify={onModify} onDelete={onDelete}></RoadsideLitterTable>
                <Button design="primary" width="sm:w-30" onClick={onNewSearch}>New Search</Button>
            </div>
        );
    } else if (isTrashRoutesEventArray(data)) {
        return (
            <div className="flex flex-col gap-3 mt-4">
                <TrashRoutesTable data={data} onModify={onModify} onDelete={onDelete}></TrashRoutesTable>
                <Button design="primary" width="sm:w-30" onClick={onNewSearch}>New Search</Button>
            </div>
        );
    } else if (isAdoptASpotEventArray(data)) {
        return (
            <div className="flex flex-col gap-3 mt-4">
                <AdoptASpotTable data={data} onModify={onModify} onDelete={onDelete}></AdoptASpotTable>
                <Button design="primary" width="sm:w-30" onClick={onNewSearch}>New Search</Button>
            </div>
        );
    } else if (isGroupCleanupEventArray(data)) {
        return (
            <div className="flex flex-col gap-3 mt-4">
                <GroupCleanupTable data={data} onModify={onModify} onDelete={onDelete}></GroupCleanupTable>
                <Button design="primary" width="sm:w-30" onClick={onNewSearch}>New Search</Button>
            </div>
        );
    } else if (isBagSwapEventArray(data)) {
        return (
            <div className="flex flex-col gap-3 mt-4">
                <BagSwapTable data={data} onModify={onModify} onDelete={onDelete}></BagSwapTable>
                <Button design="primary" width="sm:w-30" onClick={onNewSearch}>New Search</Button>
            </div>
        );
    } else if (isEducationEventArray(data)) {
        return (
            <div className="flex flex-col gap-3 mt-4">
                <EducationTable data={data} onModify={onModify} onDelete={onDelete}></EducationTable>
                <Button design="primary" width="sm:w-30" onClick={onNewSearch}>New Search</Button>
            </div>
        );
    } else if (isTreePlantingEventArray(data)) {
        return (
            <div className="flex flex-col gap-3 mt-4">
                <TreePlantingTable data={data} onModify={onModify} onDelete={onDelete}></TreePlantingTable>
                <Button design="primary" width="sm:w-30" onClick={onNewSearch}>New Search</Button>
            </div>
        );
    } else {
        return (
            <div>
                <p className="mb-2">
                    Unable to display search results.
                    Please return to the search page by selecting the 'Return to Search' button.
                </p>
                <Button design="primary" width="sm:w-40" onClick={onNewSearch}>Return to Search</Button>
            </div>
        );
    }
}