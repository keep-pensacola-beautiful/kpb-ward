'use client'

import { useEffect, useRef } from 'react';
import { DialogModel } from './dialog.model';

export function Dialog({ isOpen, id, title, children, type = 'info', heightCss, widthCss, onClose }: DialogModel) {
    const modalRef = useRef<HTMLDialogElement>(null);
    const titleRef = useRef<HTMLParagraphElement>(null);
    
    useEffect(() => {
        if (!isOpen) {
            modalRef.current?.close();
        } else {
            modalRef.current?.showModal();
            titleRef.current?.focus();
        }
    }, [isOpen]);

    return (
        <dialog ref={modalRef} id={id} role="dialog" aria-modal="true" aria-labelledby={`${id}-title`}
            className={`m-auto rounded-lg bg-[var(--tan)] border-2
                ${type === 'info' ? 'border-[var(--deepBlue)]' : ''}
                ${type === 'error' ? 'border-red-700' : ''}
                ${type === 'success' ? 'border-green-800' : ''}
                ${heightCss ? heightCss : ''}
                ${widthCss ? widthCss : ''}`}
            >
            <div className={`p-[1em] pr-[2em]
                    ${type === 'info' ? 'bg-[var(--deepBlue)]' : ''}
                    ${type === 'error' ? 'bg-red-700' : ''}
                    ${type === 'success' ? 'bg-green-800' : ''}`}
                >
                <p ref={titleRef} id={`${id}-title`} tabIndex={-1} className="font-semibold text-lg text-[var(--tan)]">{ title }</p>
            </div>
            <div className="p-[1em]">{children}</div>
            <button
                id={`${id}-close`}
                aria-label="close"
                onClick={onClose}
                className="cursor-pointer pt-[0.125em] pb-[0.125em] pr-[0.5em] pl-[0.5em]
                    absolute top-[0.5em] right-[0.5em] mt-[0] leading-none text-2xl text-[var(--tan)]"
                >&times;
            </button>
        </dialog>
    );
}