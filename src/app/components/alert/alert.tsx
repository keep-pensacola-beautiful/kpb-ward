'use client'

import { AlertModel } from './alert.model';

export function Alert({ id, type = 'info', header, body, closeButton, onClose }: AlertModel) {
    const ICON_CHARACTERS = {
        info: 'i',
        danger: '!',
        success: ''
    }
    const ALERT_STYLING = {
        info: 'border-[var(--deepBlue)] bg-[#e7f6f8]',
        danger: 'border-red-700 bg-[#f4e3db]',
        success: 'border-green-800 bg-[#ecf3ec]'
    }

    return (
        <div id={id} className={`relative rounded-xl border-1 border-l-[0.5rem] bg-[#f4e3db] ${ALERT_STYLING[type]}`}>
            <style>{`
                #${`${id}-icon`}.success {
                    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
                }
            `}</style>
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-2 p-2 text-black">
                    <span
                        id={`${id}-icon`}
                        className={`bg-black text-white px-[12px] p-[3px] h-8 font-bold text-lg mt-[-4px] rounded-[50%] ${ type }`}
                        aria-label=""
                        >
                        { ICON_CHARACTERS[type] }
                    </span>
                    <div>
                        <h2 id={`${id}-header`} className="text-lg" tabIndex={-1}>{ header }</h2>
                        <div id={`${id}-body`}>{ body }</div>
                    </div>
                </div>
                { closeButton &&
                    <button
                        id={`${id}-close`}
                        aria-label="close"
                        onClick={onClose}
                        className="cursor-pointer pt-[0.125em] pb-[0.125em] pr-[0.5em] pl-[0.5em]
                            mt-[0] leading-none text-2xl text-black self-start"
                        >&times;
                    </button>
                }
            </div>
        </div>
    );
}