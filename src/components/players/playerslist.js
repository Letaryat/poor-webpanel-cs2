import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function PlayerListRow({ position, nickname, points, rank, avatar }) {
    return (
        <div className={`grid grid-cols-4 p-2 border border-neutral-800 mb-2 items-center bg-neutral-900 rounded-md 
        ${position == "1" ? "First" : ""}
        ${position == "2" ? "Second" : ""}
        ${position == "3" ? "Third" : ""}
        `}
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
        </div>
    )
}