import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function PlayerListRow({ position, nickname, points, rank, avatar, kills, deaths, time, kd }) {
    return (
        <div className={`grid grid-cols-8 relative p-2 border border-neutral-800 mb-1 items-center bg-neutral-900 rounded-md transition ease-in-out hover:-translate-y-1
        ${position == "1" ? "First" : ""}
        ${position == "2" ? "Second" : ""}
        ${position == "3" ? "Third" : ""}
        playerlistrow`}
        >
            <div>{position}.</div>
            <div className="flex gap-6 items-center">
                <Avatar>
                    <AvatarImage src={avatar} />
                    <AvatarFallback>{nickname}</AvatarFallback>
                </Avatar>
                {nickname}</div>
            <div>{points}</div>
            <div>{rank}</div>
            <div>{kills}</div>
            <div>{deaths}</div>
            <div>{kd}</div>
            <div>{time}</div>
        </div>
    )
}