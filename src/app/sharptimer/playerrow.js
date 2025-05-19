import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SquareArrowOutUpRight, CircleUser } from 'lucide-react';
import Link from "next/link";
export function PlayerRow({ name, sid, time, style, timesfinished, mapname }) {
    return (
        <div className="flex flex-col lg:grid lg:grid-cols-5 p-2  text-center items-center border border-neutral-800 mb-1  bg-neutral-900 rounded-md transition ease-in-out">
            <div className="flex gap-2 items-center">
                <Link className="hover:text-blue-400 transition ease-in-out" href={`/sharptimer/${sid}`}>
                    <CircleUser />
                </Link>
                <Avatar >
                    <AvatarImage src={`/api/avatar/ifexist/${sid}`} />
                    <AvatarFallback>{name}</AvatarFallback>
                </Avatar>
                {name}
            </div>
            <div>{time}</div>
            <div>{mapname}</div>
            <div>{style}</div>
            <div>{timesfinished}</div>
        </div>
    )
}