'use client'

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
                    <button
                        type="button"
                        onClick={onClose}
                        className="border p-2 rounded-md
                            bg-[var(--deepBlue)] text-[var(--tan)] text-[1.06rem]
                            cursor-pointer"
                        >
                        { cancelBtnLabel }
                    </button>
                    <button className="border-2 p-2 rounded-md
                        bg-[var(--tan)] text-[var(--deepBlue)] text-[1.06rem]
                        cursor-pointer"
                        >
                        { addBtnLabel }
                    </button>
                </div>
            </form>
        </Dialog>
    );
}