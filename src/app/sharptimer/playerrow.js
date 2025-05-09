import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SquareArrowOutUpRight, CircleUser } from 'lucide-react';
import Link from "next/link";
export function PlayerRow({ name, sid, time, style, timesfinished }) {
    return (
        <div className="grid grid-cols-4 p-2 border mb-1 rounded-md text-center items-center">
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
            <div>{style}</div>
            <div>{timesfinished}</div>
        </div>
    )
}