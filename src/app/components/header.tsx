'use client'

import { useState } from 'react';
import Link from 'next/link';

export function Header() {
    const [isEnterDataSubNavOpen, setIsEnterDataSubNavOpen] = useState<boolean>(false);

    let timer: any = null;

    function handleClick(event: any) {
        setIsEnterDataSubNavOpen(!isEnterDataSubNavOpen)
        event.preventDefault();
    }

    function handleMouseOver() {
        setIsEnterDataSubNavOpen(true);
        if (timer) {
            clearTimeout(timer);
        }
    }

    function handleMouseOut(): void {
        timer = setTimeout(() => {
            setIsEnterDataSubNavOpen(false);
        }, 1000);
    }

    return (
        <header>
            <nav id="main-menu-navigation" aria-label="Main">
            <ul className="flex flex-row gap-4 bg-[#092E6E] md:gap-8 items-center
                px-2 sm:px-4 md:px-8
                py-1 sm:py-2 md:py-3" >
                    <li className="text-center">
                        <Link 
                            href="/"
                            className="text-[#F4E2A3] decoration-[#092E6E]
                                p-1 sm:p-2
                                text-sm sm:text-lg md:text-xl text-center
                                hover:bg-[#E5B922] hover:text-[#092E6E] hover:underline 
                                focus:bg-[#E5B922] focus:text-[#092E6E]">
                            WARD
                        </Link>
                    </li>
                    <li 
                        className={`${isEnterDataSubNavOpen ? 'open' : ''} text-center`}
                        onClick={handleClick}
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                        >
                        <Link
                            href=""
                            className="text-[#F4E2A3] cursor-pointer decoration-[#092E6E]
                                pl-0 pr-0 pt-1 pb-1 sm:p-2
                                text-sm sm:text-lg md:text-xl text-center
                                hover:bg-[#E5B922] hover:text-[#092E6E] hover:underline
                                focus:bg-[#E5B922] focus:text-[#092E6E] text-center md:text-center"
                            aria-expanded={isEnterDataSubNavOpen}
                            >
                            Enter Data
                        </Link>
                        <ul className={`${isEnterDataSubNavOpen ? 'block' : 'hidden'}
                            absolute bg-[#092E6E] text-[#F4E2A3] px-2 pb-2 ml-[-10px]
                            mt-1 md:mt-2 lg:mt-3
                            text-sm sm:text-lg md:text-xl
                            z-[10]`}>
                            <li>
                                <Link
                                    href="/enter-data/services"
                                    className="w-[100%] block decoration-[#092E6E]
                                        p-1 sm:p-2
                                        hover:bg-[#E5B922] hover:text-[#092E6E] hover:underline
                                        focus:bg-[#E5B922] focus:text-[#092E6E]"
                                    >
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/enter-data/volunteer-cleanup"
                                    className="w-[100%] block decoration-[#092E6E]
                                        p-1 sm:p-2
                                        hover:bg-[#E5B922] hover:text-[#092E6E] hover:underline
                                        focus:bg-[#E5B922] focus:text-[#092E6E]"
                                    >
                                    Volunteer Cleanup
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/enter-data/other"
                                    className="w-[100%] block decoration-[#092E6E]
                                        p-1 sm:p-2
                                        hover:bg-[#E5B922] hover:text-[#092E6E] hover:underline
                                        focus:bg-[#E5B922] focus:text-[#092E6E]"
                                    >
                                    Other
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li className="text-center">
                        <Link
                            href="/visualize-metrics"
                            className="text-[#F4E2A3] decoration-[#092E6E]
                                pl-0 pr-0 pt-1 pb-1 sm:p-2
                                text-sm sm:text-lg md:text-xl
                                hover:bg-[#E5B922] hover:text-[#092E6E] hover:underline
                                focus:bg-[#E5B922] focus:text-[#092E6E]"
                            >
                            Visualize Metrics
                        </Link>
                    </li>
                    <li className="text-center">
                        <Link
                            href="/"
                            className="text-[#F4E2A3] decoration-[#092E6E]
                                pl-0 pr-0 pt-1 pb-1 sm:p-2
                                text-sm sm:text-lg md:text-xl text-center
                                hover:bg-[#E5B922] hover:text-[#092E6E] hover:underline
                                focus:bg-[#E5B922] focus:text-[#092E6E]"
                            >
                            Search Events & Cleanups
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

/* <li>
    <Link href="/">
        <img
            src="/logo.png"
            alt="Keep Pensacola Beautiful logomark"
            width={80}
            height={80}
        />
    </Link>
</li> */