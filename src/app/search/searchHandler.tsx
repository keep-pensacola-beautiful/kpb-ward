'use client'

import { useState } from 'react';
import { SearchForm } from './searchForm';
import { SearchResultsTable } from './searchResultsTable';
import { EventModel } from '../models/event';
import { ProgramCode } from '../models/search';
import { ModifyEventForm } from './modifyEventForm';
import { deleteEventById, getEventByProgramAndById, searchEventsByProgramAndByCriteria } from './actions';
import { Button, Dialog, LoadingDialog, StatusDialog } from '../components';
import { DialogType } from '../components/dialog/dialogType.model';

export function SearchHandler() {
    const [currentPage, setCurrentPage] = useState<'search' | 'table' | 'modify'>('search');
    const [searchResults, setSearchResults] = useState<EventModel[]>([]);
    const [program, setProgram] = useState<ProgramCode>('cleanTeam');
    const [event, setEvent] = useState<EventModel>();
    const [searchCriteria, setSearchCriteria] = useState<Map<string, string>>(new Map<string, string>());
    const [isNoResultsDialogOpen, setIsNoResultsDialogOpen] = useState<boolean>(false);
    const [confirmActionDialogContent, setConfirmActionDialogContent] = useState<{
        id: string, title: string, body: string, type: DialogType
    }>({ id: '', title: '', body: '', type: 'info' });
    const [statusDialogContent, setStatusDialogContent] = useState<{
        id: string, title: string, body: string, type: DialogType
    }>({ id: '', title: '', body: '', type: 'info' });
    const [eventToDelete, setEventToDelete] = useState<{ id: number, date: string, index: number }>();
    const [isModifyLoadingDialogOpen, setIsModifyLoadingDialogOpen] = useState<boolean>(false);
    const [isDeleteLoadingDialogOpen, setIsDeleteLoadingDialogOpen] = useState<boolean>(false);

    function handleSearch(pgrmCode: ProgramCode, events: EventModel[], searchCriteria: Map<string, string>): void {
        if (events.length >= 1) {
            setProgram(pgrmCode);
            setSearchResults(events);
            setSearchCriteria(searchCriteria);
            setCurrentPage('table');
        } else {
            setIsNoResultsDialogOpen(true);
        }
    }
    
    function handleNewSearch(): void {
        setCurrentPage('search');
    }

    function displayModifyFailureDialog(eventId: number | undefined) {
        setStatusDialogContent({
            id: 'modify-failure-dialog',
            title: 'Unable to modify Event',
            body: `Unable to modify Event with ID ${eventId} due to an unexpected error. ` +
                `Please try again later.`,
            type: 'danger'
        });
    }

    async function handleModify(pgrmCode: ProgramCode, eventId: number | undefined): Promise<void> {
        if (eventId === undefined || eventId < 1) {
            displayModifyFailureDialog(eventId);
            console.error('Error: Unable to modify event. Event ID was undefined or invalid.');
            return;
        }
        setIsModifyLoadingDialogOpen(true);
        let data: EventModel | null = await getEventByProgramAndById(pgrmCode, eventId);
        if (data === null) {
            setIsModifyLoadingDialogOpen(false);
            displayModifyFailureDialog(eventId);
            console.error(`Error: Unable to modify event. Event (id=${eventId}) could not be retrieved.`);
        } else {
            setProgram(pgrmCode);
            setEvent(data);
            setIsModifyLoadingDialogOpen(false);
            setCurrentPage('modify');
        }
    }

    async function handleSuccessfulModify(nextPage: 'search' | 'table' | 'modify'): Promise<void> {
        if (nextPage === 'table') {
            const events: EventModel[] = await searchEventsByProgramAndByCriteria(program, searchCriteria);
            setSearchResults(events);
        }
        setCurrentPage(nextPage);
    }

    function handleModifyCancel(): void {
        setCurrentPage('table');
    }

    function handleDelete(pgrmCode: ProgramCode, id: number | undefined, date: string, index: number): void {
        if (id !== undefined) {
            setEventToDelete({ id: id, date: date, index: index });
            setProgram(pgrmCode);
            setConfirmActionDialogContent({
                id: 'confirm-delete-dialog',
                title: `Are you sure you want to delete the Event?`,
                body: `To delete the Event that took place on ${date} with ID ${id}, please select 'Delete'.` +
                    `To cancel deleting, please select 'Cancel'.`,
                type: 'danger'
            });
        }
    }

    function displayDeleteFailureStatusDialog(bodyText: string) {
        setStatusDialogContent({
            id: 'delete-failure-dialog',
            title: 'Unable to delete Event',
            body: bodyText,
            type: 'danger'
        });
    }

    async function deleteEvent() {
        if (eventToDelete !== undefined && eventToDelete.id !== undefined) {
            clearConfirmActionDialogContent();
            setIsDeleteLoadingDialogOpen(true);

            let isSuccessfulDelete: boolean = await deleteEventById(program, eventToDelete.id);
            
            setIsDeleteLoadingDialogOpen(false);
            if (isSuccessfulDelete) {
                setStatusDialogContent({
                    id: 'delete-success-dialog',
                    title: 'Successfully deleted Event',
                    body: `The Event that took place on ${eventToDelete.date} with ` +
                        `ID ${eventToDelete.id} was successfully deleted and removed from the search results. ` +
                        `If this was done mistakenly, the Event can be recovered from the database.`,
                    type: 'success'
                });
                setSearchResults(searchResults.toSpliced(eventToDelete.index, 1));
            } else {
                displayDeleteFailureStatusDialog(
                    `The Event that took place on ${eventToDelete.date} with ID ${eventToDelete.id} ` +
                    `was NOT deleted due to an unexpected error. Please try again later.`
                );
                console.error(`Error: Unable to delete Event (id=${eventToDelete.id}). Delete returned unsuccessful.`);
            }
        } else {
            displayDeleteFailureStatusDialog(`Unable to modify Event due to an unexpected error. Please try again later.`);
            console.error(`Error: Unable to delete Event because event to delete or the event ID was undefined.`);
        }
    }

    function clearConfirmActionDialogContent(): void {
        setConfirmActionDialogContent({ id: '', title: '', body: '', type: 'info' });
    }

    function clearStatusDialogContent(): void {
        setStatusDialogContent({ id: '', title: '', body: '', type: 'info' });
    }

    switch (currentPage) {
        case 'search':
            return (
                <div>
                    <StatusDialog
                        dialogId="no-results-dialog"
                        isOpen={isNoResultsDialogOpen}
                        onClose={() => setIsNoResultsDialogOpen(false)}
                        title="No Results Found"
                        body={
                            <p>
                                No events matched the criteria you entered.
                                Select the 'Okay' button to return to the search criteria form.
                            </p>}
                        type="info">
                    </StatusDialog>
                    <h1 id="main-content-header" className="text-xl md:text-2xl" tabIndex={-1}>
                        Search Events & Cleanups
                    </h1>
                    <SearchForm onSearch={handleSearch}></SearchForm>
                </div>
        );
        case 'table':
            return (
                <div>
                    <Dialog
                        isOpen={confirmActionDialogContent.title !== ''}
                        id={confirmActionDialogContent.id}
                        title={confirmActionDialogContent.title}
                        widthCss="w-[400px]"
                        onClose={() => clearConfirmActionDialogContent()}
                        type="danger"
                        >
                        <p>
                            { confirmActionDialogContent.body }
                        </p>
                        <div className="flex flex-row-reverse justify-start gap-2 mt-4">
                            <Button
                                design="primary"
                                color="danger"
                                type="button"
                                onClick={() => clearConfirmActionDialogContent()}>
                                Cancel
                            </Button>
                            <Button
                                design="secondary"
                                color="danger"
                                type="button"
                                onClick={() => deleteEvent()}>
                                Delete
                            </Button>
                        </div>
                    </Dialog>
                    <StatusDialog
                        dialogId={statusDialogContent.id}
                        isOpen={statusDialogContent.title !== ''}
                        onClose={() => clearStatusDialogContent()}
                        title={statusDialogContent.title}
                        body={
                            <p>
                                { statusDialogContent.body }
                            </p>}
                        type={statusDialogContent.type}>
                    </StatusDialog>
                    <LoadingDialog
                        isOpen={isModifyLoadingDialogOpen}
                        dialogId="modify-dialog"
                        dialogTitle="Please wait while we prepare to modify the Event">
                    </LoadingDialog>
                    <LoadingDialog
                        isOpen={isDeleteLoadingDialogOpen}
                        dialogId="delete-dialog"
                        dialogTitle="Please wait while we prepare to delete the Event">
                    </LoadingDialog>


                    <h1 id="main-content-header" className="text-xl md:text-2xl" tabIndex={-1}>
                        Search Events & Cleanups
                    </h1>
                    <SearchResultsTable
                        data={searchResults}
                        onModify={handleModify}
                        onDelete={handleDelete}
                        onNewSearch={handleNewSearch}>
                    </SearchResultsTable>
                </div>
            );
        case 'modify':
            return (
                <ModifyEventForm
                    pgrmCode={program}
                    event={event}
                    onModifySuccess={handleSuccessfulModify}
                    onModifyCancel={handleModifyCancel}>
                </ModifyEventForm>);
    }
}