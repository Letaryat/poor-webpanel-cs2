import Link from "next/link"
export function Header()
{
    return(
        <header className="flex justify-center h-14 border-b border-b-neutral-800 mb-2">
        <div className="container flex items-center border border-neutral-800 border-b-0 border-t-0 pl-2 pr-2 gap-2">
            <Link href={"/"}><h1 className="text-base font-semibold">UwURanking</h1>
            </Link>
            <Link href={"/zenith"}>Ranking</Link>
        </div>
        </header>
    )
}