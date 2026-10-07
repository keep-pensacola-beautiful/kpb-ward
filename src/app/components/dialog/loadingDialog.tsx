'use client'

import { Dialog } from './dialog';

export function LoadingDialog({ isOpen, dialogId, dialogTitle }: {
    isOpen: boolean,
    dialogId: string,
    dialogTitle: string
}) {
    return (
        <Dialog
            isOpen={isOpen}
            id={dialogId}
            title={dialogTitle}
            widthCss="w-[375px]"
            closeButton={false}
            >
            <div className="flex flex-row justify-center">
                <div className={`
                        border-16 border-white
                        border-t-16 border-t-[var(--deepBlue)]
                        rounded-[50%]
                        w-20 h-20
                        animate-spin
                    `}>
                </div>
            </div>
        </Dialog>
    );
}