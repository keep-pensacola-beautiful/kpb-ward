export function SiteAlert({ header, body, compact, design }: {
    header: string, body: string, compact: boolean, design: 'info' | 'danger'
}) {
    const STYLING_OPTIONS = {
        info: {
            coloring: 'border-[var(--deepBlue)] bg-[#e7f6f8]',
            icon: 'i'
        },
        danger: {
            coloring: 'border-red-700 bg-[#f4e3db]',
            icon: '!'
        }
    }

    return (
        <section className={`border-1 border-l-[0.5rem] ${STYLING_OPTIONS[design].coloring}`} aria-label="Site alert,">
            <div>
                <div className="px-2 sm:px-4 md:px-8 sm:py-2">
                    <div className="flex flex-row gap-2 p-2 text-black">
                        <span
                            id={`site-alert-icon`}
                            className={`bg-black text-white px-[12px] p-[3px] h-8 font-bold text-lg mt-[-6px] rounded-[50%]`}
                            aria-label=""
                            >
                            { STYLING_OPTIONS[design].icon }
                        </span>
                        { !compact &&
                            <div>
                                <h4>{ header }</h4>
                                <p>{ body }</p>
                            </div>
                        }
                        { compact &&
                            <div>
                                <strong>{ header }.</strong>
                                <p className="inline"> { body }</p>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </section>
    );
}