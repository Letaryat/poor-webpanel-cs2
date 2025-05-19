import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { StylePoints, CalculateBackground, CalculateColor, ShortNickname } from '@/lib/playerfunctions' 
export function PlayerListRow({ position, nickname, points, rank, avatar, kills, deaths, time, kd }) {
    return (
        <div className={`lg:grid lg:grid-cols-8 relative p-2 border border-neutral-800 mb-1 items-center bg-neutral-900 rounded-md transition ease-in-out hover:-translate-y-1
        ${position == "1" ? "First" : ""}
        ${position == "2" ? "Second" : ""}
        ${position == "3" ? "Third" : ""}
        playerlistrow md:flex md:flex-col md:gap-2`}
        >
            <div>{position}.</div>
            <div className="justify-center md:justify-normal flex gap-6 items-center ">
                <Avatar>
                    <AvatarImage src={avatar} />
                    <AvatarFallback>{nickname}</AvatarFallback>
                </Avatar>
                {ShortNickname(nickname)}</div>
            <div className="flex justify-center items-center h-[100%]">
                <div className=" absolute">
                {CalculateBackground(points)}
                </div>
                {StylePoints(points)}
            </div>
            <div>{rank}</div>
            <div>{kills}</div>
            <div>{deaths}</div>
            <div>{kd}</div>
            <div>{(time / 60).toFixed(2)} hr.</div>
        </div>
    )
}