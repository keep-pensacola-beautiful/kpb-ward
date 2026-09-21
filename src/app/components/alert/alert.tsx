'use client'

import { useEffect, useState } from 'react';
import { AlertModel } from './alert.model';

export function Alert({ id, type = 'info', header, body, onClose }: AlertModel) {
    const [alertBorderAndBg, setAlertBorderAndBg] = useState<string>('');
    const [iconCharacter, setIconCharacter] = useState<string>('');

    useEffect(() => {
        if (type === 'info') {
            setAlertBorderAndBg('border-[var(--deepBlue)] bg-[#e7f6f8]');
            setIconCharacter('i');
        } else if (type === 'error') {
            setAlertBorderAndBg('border-red-700 bg-[#f4e3db]');
            setIconCharacter('!');
        } else if (type === 'success') {
            setAlertBorderAndBg('border-green-800 bg-[#ecf3ec]');
            setIconCharacter('');
        }
    }, [type])

    return (
        <div id={id} className={`relative rounded-xl border-1 border-l-[0.5rem] bg-[#f4e3db] ${alertBorderAndBg}`}>
            <style>{`
                #${`${id}-icon`}.error {
                    clip-path: circle(40%);
                }
                #${`${id}-icon`}.success {
                    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
                }
            `}</style>
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-2 p-2 text-black">
                    <span
                        id={`${id}-icon`}
                        className={`bg-black text-white pl-[10px] pr-[10px] p-[5px] h-10 font-bold text-lg mt-[-6px] ${ type }`}
                        aria-label=""
                        >
                        { iconCharacter }
                    </span>
                    <div>
                        <h2 id={`${id}-header`} className="text-lg" tabIndex={-1}>{ header }</h2>
                        <div id={`${id}-body`}>{ body }</div>
                    </div>
                </div>
                <button
                    id={`${id}-close`}
                    aria-label="close"
                    onClick={onClose}
                    className="cursor-pointer pt-[0.125em] pb-[0.125em] pr-[0.5em] pl-[0.5em]
                        mt-[0] leading-none text-2xl text-black self-start"
                    >&times;
                </button>
            </div>
        </div>
    );
}