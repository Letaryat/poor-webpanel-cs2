'use client'
import Link from "next/link"
import { usePathname } from "next/navigation";
import { CustomURLS } from "./customurls";
import SteamButtons from "./steamauth/LoginButton";
import { Button, buttonVariants } from "./ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
function Links({ css, title }) {
    const path = usePathname();
    let patharray = path.split("/").filter((path) => path);
    const pathNow = patharray[patharray.length - 1];
    return (
        <div className={`${css}`}>
            <Link  className={`hover:bg-neutral-800 p-2 rounded-md`} href={"/"}><h1 className="text-base font-semibold">Pierdolnik.eu</h1></Link>
            <Link className={`hover:bg-neutral-800 p-2 rounded-md ${path.startsWith(`/zenith`) ? "bg-neutral-800" : ""}`} href={"/zenith"}>Ranking</Link>
            <Link className={`hover:bg-neutral-800 p-2 rounded-md ${path.startsWith(`/punishments`) ? "bg-neutral-800" : ""}`} href={"/punishments"}>Bany</Link>
            <Link className={`hover:bg-neutral-800 p-2 rounded-md ${path.startsWith(`/sharptimer`) ? "bg-neutral-800" : ""}`} href={"/sharptimer"}>Sharptimer</Link>
            <CustomURLS css={css}/>
        </div>
    )
}

function RwdNavBar() {
    return (
        <div className="block md:hidden">
            <Sheet>
                <SheetTrigger>
                    Open
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>
                            Navigation
                        </SheetTitle>
                    </SheetHeader>
                    <Links css={"flex flex-col"}/>
                </SheetContent>
            </Sheet>
        </div>

    )
}

export function Header() {
    return (
        <header className="flex justify-center h-14 border-b border-b-neutral-800 mb-2">
            <div className="container flex justify-between items-center border border-neutral-800 border-b-0 border-t-0 pl-2 pr-2 gap-2">
                <div className="flex items-center gap-2">
                    <RwdNavBar />
                    <Links css={"hidden md:flex items-center gap-2"} />
                </div>
                <div className="flex items-center">
                    <SteamButtons />
                </div>
            </div>
        </header>
    )
}