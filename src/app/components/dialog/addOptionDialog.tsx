'use client'

import { Button } from '../button/button';
import { Dialog } from './dialog';

export function AddOptionDialog(
{
    isOpen, 
    onClose,
    dialogId,
    dialogTitle,
    addBtnLabel = 'Add',
    cancelBtnLabel = 'Cancel',
    children,
    onAddOption
}: {
    isOpen: boolean,
    onClose: (e: any) => void,
    dialogId: string,
    dialogTitle: string,
    addBtnLabel: string,
    cancelBtnLabel: string,
    children: React.ReactNode,
    onAddOption: (formData: FormData) => void
}
) {
    function onSubmit(e: any) {
        e.preventDefault();
        onAddOption(new FormData(e.target));
    }

    return (
        <Dialog
            isOpen={isOpen}
            id={dialogId}
            title={dialogTitle}
            widthCss="w-[400px]"
            onClose={onClose}
            >
            <form onSubmit={onSubmit}>
                { children }
                <div className="flex flex-row justify-end gap-2 mt-4">
                    <Button type="button" design="primary" onClick={onClose}>{ cancelBtnLabel }</Button>
                    <Button design="secondary">{ addBtnLabel }</Button>
                </div>
            </form>
        </Dialog>
    );
}