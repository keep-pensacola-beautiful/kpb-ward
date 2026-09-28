import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Home | WARD",
  description: "Web Application for Reporting Data home page"
};

export default function Page() {
  return (
    <main id="main-content" className="px-2 sm:px-4 md:px-8">
      <div className="flex flex-row items-center gap-4">
        <img
          src="/logo.png"
          alt="Keep Pensacola Beautiful logomark"
          width={80}
          height={80}
        />
        <h1 id="main-content-header" tabIndex={-1} className="text-xl md:text-3xl">Web Application for Reporting Data (WARD)</h1>
      </div>
      <p className="mt-2 text-[1.06rem]">
        WARD is your one-stop shop for reporting data.
      </p>
      <ul className="list-disc ml-4 mt-1">
        <li>
          <p className="mt-2 text-[1.06rem]">
            enter information about&nbsp;
            <Link href="/enter-data/services" className="underline" aria-label="enter services activities">services activities</Link>
            &nbsp;like roadside litter and park routes,&nbsp;
            <Link href="/enter-data/services" className="underline" aria-label="enter volunteer cleanup activities">volunteer cleanup activities</Link>
            &nbsp;like group cleanups and adopt-a-spot cleanups, and&nbsp;
            <Link href="/enter-data/services" className="underline" aria-label="enter other activities">other activities</Link>
            &nbsp;like education events.
          </p>
        </li>
        <li className="mt-1">
          <p className="mt-2 text-[1.06rem]">
            <Link href="/enter-data/services" className="underline">get metrics about KPB's activities</Link>
            &nbsp;by month, quarter, or year, and
          </p>
        </li>
        <li className="mt-1">
          <p className="mt-2 text-[1.06rem]">
            <Link href="/enter-data/services" className="underline">search for individual events and cleanups</Link>
            &nbsp;to view and to update or correct granular data.
          </p>
        </li>
      </ul>
    </main>
  );
}