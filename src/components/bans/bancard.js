import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SquareArrowOutUpRight } from 'lucide-react';
import Link from "next/link";

function durationChange(value, status, ubreason, aubsid, aubname) {
    if (value == 0) {
        return (
            <span className="bg-red-400 bg-opacity-20 text-xs font-base text-red-400 p-2 rounded-2xl flex justify-center">
                FOREVER
            </span>
        )
    }
    else {
        if (status === "EXPIRED") {
            return (
                <span className="bg-green-400 bg-opacity-20 text-xs font-base text-green-400 p-2 rounded-2xl flex justify-center">
                    EXPIRED :)
                </span>
            )
        }
        else if (status === "UNBANNED" || status === "UNMUTED") {
            return (
                <HoverCard>
                    <HoverCardTrigger>
                        <span className="bg-blue-400 bg-opacity-20 text-xs font-base text-blue-400 p-2 rounded-2xl flex justify-center">
                            {status === "UNBANNED" ? "UNBANNED" : "UNMUTED"}
                        </span></HoverCardTrigger>
                    <HoverCardContent>
                        <div>
                        <Link target="_blank" href={`/zenith/${aubsid}`}>
                                <div className="flex items-center gap-2 mt-2 hover:text-blue-400 transition-all ease-in-out">
                                    <Avatar >
                                        <AvatarImage src={`/api/avatar/ifexist/${aubsid}`} />
                                        <AvatarFallback>{aubname}</AvatarFallback>
                                    </Avatar>
                                    <p >{aubname}</p>
                                    <SquareArrowOutUpRight size={16} />
                                </div>
                            </Link>
                        </div>
                        <span className="text-center">
                        {ubreason}
                        </span>

                    </HoverCardContent>
                </HoverCard>

            )
        }
        else {
            return (
                <span className="bg-orange-400 bg-opacity-20 text-xs font-base text-orange-400 p-2 rounded-2xl flex justify-center">
                    {(value / 60) / 24} days
                </span>
            )
        }

    }
}

export function BanCard({ id, pname, psid, asid, aname, reason, duration, end, created, serverid, unbanid, status, ubreason, aubsid, aubname }) {
    return (
        <AccordionItem value={`item-${id}`} className="data-[state=open]:bg-zinc-900 rounded-md">
            <AccordionTrigger className="hover:no-underline ">
                <div className="flex w-[100%] justify-between p-2">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <Avatar>
                                <AvatarImage src={`/api/avatar/ifexist/${psid}`} />
                                <AvatarFallback>{pname}</AvatarFallback>
                            </Avatar>
                            <h2 className="font-bold text-lg">{pname}</h2>

                        </div>

                        <p>{created}</p>
                    </div>
                    <div className="flex justify-center items-center ">
                        {durationChange(duration, status, ubreason, aubsid, aubname)}
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className="grid gap-2">
                <div>
                    <h4 className="font-black">Server</h4>
                    <p>{serverid}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex gap-2 flex-col">
                        <div className="h-[68px] flex flex-col justify-center">
                            <h4 className="font-black">Player Steamid64</h4>
                            <Link target="_blank" className="hover:text-blue-400 transition-all ease-in-out" href={`https://steamcommunity.com/profiles/${psid}`}>
                                <p className="flex  justify-center gap-1 items-center">{psid} <SquareArrowOutUpRight size={16} /></p>
                            </Link>
                        </div>
                        <div>
                            <h4 className="font-black">Created</h4>
                            <p>{created}</p>
                        </div>
                        <div>
                            <h4 className="font-black">Ends</h4>
                            <p>{end}</p>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-col">
                        <div className="flex justify-center items-center flex-col">
                            <h4 className="font-black">Admin</h4>
                            <Link target="_blank" href={`/zenith/${asid}`}>
                                <div className="flex items-center gap-2 mt-2 hover:text-blue-400 transition-all ease-in-out">
                                    <Avatar >
                                        <AvatarImage src={`/api/avatar/ifexist/${asid}`} />
                                        <AvatarFallback>{aname}</AvatarFallback>
                                    </Avatar>
                                    <p >{aname}</p>
                                    <SquareArrowOutUpRight size={16} />
                                </div>
                            </Link>
                        </div>
                        <div >
                            <h4 className="font-black">Reason</h4>
                            <p>{reason}</p>
                        </div>
                        <div >
                            <h4 className="font-black">Status</h4>
                            <p>{status}</p>
                        </div>
                    </div>
                </div>

            </AccordionContent>
        </AccordionItem>
    )
}