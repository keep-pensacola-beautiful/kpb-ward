import { useEffect, useRef, useState } from 'react';

export function Pagination({ pageSize, maxPage, onPageChange }: {
    pageSize: number,
    maxPage: number,
    onPageChange: (offset: number, limit: number) => void
}) {
    const [page, setPage] = useState<number>(1);
    const [innerPagesToDisplay, setInnerPagesToDisplay] = useState<number[]>([]);
    const [displayPrev, setDisplayPrev] = useState<boolean>(false);
    const [displayNext, setDisplayNext] = useState<boolean>(true);
    const prevRef = useRef<HTMLAnchorElement>(null);
    const firstPageBtnRef = useRef<HTMLAnchorElement>(null);
    const lastPageBtnRef = useRef<HTMLAnchorElement>(null);
    const nextRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        setInnerPagesToDisplay(calculateInnerPages());
        onPageChange(pageSize * (page - 1), pageSize);
        handlePreviousButton();
        handleNextButton();
    }, [page]);

    function calculateInnerPages(): number[] {
        let innerPages: number[] = [];
        if (maxPage <= 5) {
            for (let i = 2; i <= maxPage - 1; i++) {
                innerPages.push(i);
            }
        } else if (page < 4) {
            innerPages.push(2)
            innerPages.push(3);
            innerPages.push(4);
        } else if (page >= (maxPage - 2)) {
            innerPages.push(maxPage - 3);
            innerPages.push(maxPage - 2);
            innerPages.push(maxPage - 1);
        } else {
            innerPages.push(page - 1);
            innerPages.push(page);
            innerPages.push(page + 1);
        }
        return innerPages;
    }

    function handlePreviousButton(): void {
        if (page === 1) {
            if (document.activeElement === prevRef.current && firstPageBtnRef.current) {
                firstPageBtnRef.current.focus();
            }
            setDisplayPrev(false);
        } else if (page > 1 && !displayPrev) {
            setDisplayPrev(true);
        }
    }

    function handleNextButton(): void {
        if (page === maxPage) {
            if (document.activeElement === nextRef.current && lastPageBtnRef.current) {
                lastPageBtnRef.current.focus();
            }
            setDisplayNext(false);
        } else if (page < maxPage && !displayNext) {
            setDisplayNext(true);
        }
    }
    
    return (
        <nav aria-label="Pagination">
            <ul>
                { displayPrev &&
                    <li className="inline mr-2">
                        &#60;&nbsp;
                        <a
                            ref={prevRef}
                            href="#"
                            onClick={() => setPage(page - 1)}
                            className="underline cursor-pointer"
                            aria-label="Previous page">
                            <span>Previous</span>
                        </a>
                    </li>
                }
                <li className={`inline rounded-md border m-[4px] py-1 text-lg
                        ${page === 1 ? 'bg-[var(--deepBlue)] text-white' : 'bg-white'}
                        hover:border-2 hover:m-[3px]
                    `}>
                    <a
                        ref={firstPageBtnRef}
                        href="#"
                        className={`underline py-1 px-2 text-lg
                                focus:outline-3 focus:outline-solid focus:outline-(--deepBlue)
                                focus:shadow-[0 0 0 6px white]
                            `}
                        onClick={() => setPage(1)}
                        aria-label="Page 1">
                        1
                    </a>
                </li>
                { (maxPage > 5 && page >= 4) && <li className="inline mx-1 font-semibold text-lg"><span>...</span></li> }
                { innerPagesToDisplay.map((innerPage: number) =>
                    <li key={`page-${innerPage}`} className={`inline rounded-md border m-[4px] py-1 text-lg
                        ${page === innerPage ? 'bg-[var(--deepBlue)] text-white' : 'bg-white'}
                        hover:border-2 hover:m-[3px]
                    `}>
                        <a
                            href="#"
                            className={`underline py-1 px-2 text-lg
                                    focus:outline-3 focus:outline-solid focus:outline-(--deepBlue)
                                    focus:shadow-[0 0 0 6px white]
                                `}
                            onClick={() => setPage(innerPage)}
                            aria-label={`Page ${innerPage}`}
                            aria-current={innerPage === page ? 'page' : undefined}>
                            { innerPage }
                        </a>
                    </li>
                )}
                { (maxPage > 5 && page < (maxPage - 2)) && <li className="inline m-1 font-semibold text-lg"><span>...</span></li> }
                <li className={`inline rounded-md border m-[4px] py-1 text-lg
                        ${page === maxPage ? 'bg-[var(--deepBlue)] text-white' : 'bg-white'}
                        hover:border-2 hover:m-[3px]
                    `}>
                    <a
                        ref={lastPageBtnRef}
                        href="#"
                        className={`underline py-1 px-2 text-lg
                                focus:outline-3 focus:outline-solid focus:outline-(--deepBlue)
                                focus:shadow-[0 0 0 6px white]
                            `}
                        onClick={() => setPage(maxPage)}
                        aria-label={`Last page, page ${maxPage}`}>
                        { maxPage }
                    </a>
                </li>
                { displayNext &&
                    <li className="inline ml-2">
                        <a
                            ref={nextRef}
                            href="#"
                            onClick={() => setPage(page + 1)}
                            className="underline cursor-pointer"
                            aria-label="Next page"
                            ><span>Next</span>
                        </a>
                        &nbsp;&#62;
                    </li>
                }
            </ul>
        </nav>
    );
}