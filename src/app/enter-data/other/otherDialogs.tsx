import { useState } from 'react';
import { Textbox } from '../../components';
import { ErrorModel, ReferenceDataModel } from '../../models';
import { AddOptionDialog, StatusDialog } from '../../components';
import { DialogType } from '../../components/dialog/dialogType.model';
import { ifErrorThenGetErrorText } from '../../utils/ifErrorThenGetErrorText';
import { saveEducationRecipient, saveEducationTopic } from './actions';
import { GroupModel } from '../../models/group';

export function OtherDialogs(
{
    isRecipientOpen,
    onAddRecipient,
    onCloseRecipient,
    currentRecipientValues,
    isTopicOpen,
    onAddTopic,
    onCloseTopic,
    currentTopicValues
}: { 
    isRecipientOpen: boolean,
    onAddRecipient?: (newRecipient: string) => void,
    onCloseRecipient: (e: any) => void,
    currentRecipientValues: Map<string, string>,
    isTopicOpen: boolean,
    onAddTopic?: (newTopic: string) => void,
    onCloseTopic: (e: any) => void,
    currentTopicValues: Map<string, string>
}) {
    const [errors, setErrors] = useState<Map<string, ErrorModel>>(new Map<string, ErrorModel>());
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState<boolean>(false);
    const [statusDialogContent, setStatusDialogContent] = useState<{ id: string, title: string, body: React.ReactNode, type: DialogType }>(
        { id: '', title: '', body: '', type: 'info' });
    
    function clearRecipientDialogInputs(): void {
        const nameInput: HTMLInputElement = document.getElementById('recipient-name') as HTMLInputElement;
        if (nameInput) {
            nameInput.value = '';
        }
    }

    function clearTopicDialogInputs(): void {
        const topicInput: HTMLInputElement = document.getElementById('topic-desc') as HTMLInputElement;
        if (topicInput) {
            topicInput.value = '';
        }
    }

    function onRecipientDialogClose(e: any) {
        clearRecipientDialogInputs();
        setErrors(new Map<string, ErrorModel>());
        onCloseRecipient(e);
    }

    function onTopicDialogClose(e: any) {
        clearTopicDialogInputs();
        setErrors(new Map<string, ErrorModel>());
        onCloseTopic(e);
    }

    async function handleAddRecipient(formData: FormData) {
        const result: { addedId: number, data: GroupModel | null, errors: Map<string, ErrorModel> } =
            await saveEducationRecipient(
                formData,
                'recipient-name',
                'Recipient Name',
                currentRecipientValues
            );

        if (result.errors && result.errors.size > 0) {
            setTimeout(() => {
                document.getElementById('recipient-name')?.focus();
            }, 50);
        } else {
            if (result.addedId === -1) {
                setStatusDialogContent({
                    id: 'add-recipient-error',
                    title: `Error: Unable to Add Education Recipient`,
                    body: <p>Recipient <strong>{result.data?.name}</strong> was not added.
                        If it is outside of normal business hours, the database may be off.
                        Please try again later. Select 'Okay' to return to the Add a New Education Recipient dialog window.</p>,
                    type: 'danger'
                });
                setTimeout(() => setIsStatusDialogOpen(true), 100);
                if (onAddRecipient) {
                    onAddRecipient('');
                }
            } else {
                setStatusDialogContent({
                    id: 'add-recipient-success',
                    title: `Successfully Added Education Recipient`,
                    body: <p>Recipient <strong>{result.data?.name}</strong> is automatically selected.
                        Please select 'Okay' to return to the Education Event entry form.</p>,
                    type: 'success'
                });
                setTimeout(() => {
                    setIsStatusDialogOpen(true);
                    clearRecipientDialogInputs();
                }, 100);
                if (onAddRecipient) {
                    onAddRecipient(result.data?.name ? result.data?.name : '');
                }
            }
        }

        setErrors(result.errors);
    }

    async function handleAddTopic(formData: FormData) {
        const result: { addedId: number, data: ReferenceDataModel | null, errors: Map<string, ErrorModel> } =
            await saveEducationTopic(
                formData,
                'topic-desc',
                'Topic Description',
                currentTopicValues
            );

        if (result.errors && result.errors.size > 0) {
            setTimeout(() => {
                document.getElementById('topic-desc')?.focus();
            }, 50);
        } else {
            if (result.addedId === -1) {
                setStatusDialogContent({
                    id: 'add-topic-error',
                    title: `Error: Unable to Add Educational Topic`,
                    body: <p>Topic <strong>{result.data?.description}</strong> was not added.
                        If it is outside of normal business hours, the database may be off.
                        Please try again later. Select 'Okay' to return to the Add a New Educational Topic dialog window.</p>,
                    type: 'danger'
                });
                setTimeout(() => setIsStatusDialogOpen(true), 100);
                if (onAddTopic) {
                    onAddTopic('');
                }
            } else {
                setStatusDialogContent({
                    id: 'add-topic-success',
                    title: `Successfully Added Educational Topic`,
                    body: <p>Topic <strong>{result.data?.description}</strong> is automatically selected.
                        Please select 'Okay' to return to the Education Event entry form.</p>,
                    type: 'success'
                });
                setTimeout(() => {
                    setIsStatusDialogOpen(true);
                    clearTopicDialogInputs();
                }, 100);
                if (onAddTopic) {
                    onAddTopic(result.data?.description ? result.data?.description : '');
                }
            }
        }

        setErrors(result.errors);
    }

    return (
        <span>
            <AddOptionDialog
                isOpen={isRecipientOpen}
                onClose={onRecipientDialogClose}
                dialogId="add-recipient-dialog"
                dialogTitle="Add a New Education Recipient"
                addBtnLabel="Add"
                cancelBtnLabel="Cancel"
                onAddOption={handleAddRecipient}>
                <Textbox
                    inputId="recipient-name"
                    inputType="text"
                    labelText="Recipient Name"
                    maxlength={50}
                    width="sm:w-80"
                    errorText={ifErrorThenGetErrorText(errors, 'recipient-name')}>
                </Textbox>
            </AddOptionDialog>

            <AddOptionDialog
                isOpen={isTopicOpen}
                onClose={onTopicDialogClose}
                dialogId="add-topic-dialog"
                dialogTitle="Add a New Educational Topic"
                addBtnLabel="Add"
                cancelBtnLabel="Cancel"
                onAddOption={handleAddTopic}>
                <Textbox
                    inputId="topic-desc"
                    inputType="text"
                    labelText="Topic Description"
                    maxlength={50}
                    width="sm:w-80"
                    errorText={ifErrorThenGetErrorText(errors, 'topic-desc')}>
                </Textbox>
            </AddOptionDialog>

            <StatusDialog
                dialogId={statusDialogContent.id}
                isOpen={isStatusDialogOpen}
                onClose={() => setIsStatusDialogOpen(false)}
                title={statusDialogContent.title}
                body={statusDialogContent.body}
                type={statusDialogContent.type}>
            </StatusDialog>
        </span>
    );
}