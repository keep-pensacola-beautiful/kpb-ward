import { Dialog } from '..';
import { DialogType } from './dialogType.model';

export function StatusDialog({ dialogId, isOpen, onClose, title, body, type = 'info' }:
    { dialogId: string, isOpen: boolean, onClose: (e: any) => void, title: string, body: React.ReactNode, type: DialogType }
) {
    return (
        <Dialog
            isOpen={isOpen}
            id={dialogId}
            title={title}
            widthCss="w-[400px]"
            onClose={onClose}
            type={type}
            >
            { body }
            <div className="flex flex-row justify-end mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className={`border p-2 rounded-md
                            text-[var(--tan)] text-[1.06rem]
                            cursor-pointer
                            ${type === 'info' ? 'bg-[var(--deepBlue)]' : ''}
                            ${type === 'error' ? 'bg-red-700' : ''}
                            ${type === 'success' ? 'bg-green-800' : ''}`}
                        >
                        Okay
                    </button>
                </div>
        </Dialog>
    );
}