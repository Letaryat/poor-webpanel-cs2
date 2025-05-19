import { PrismaClient } from "@prisma/client";

import { UnixToTime } from "@/lib/playerfunctions";

export default async function SharpTimerPlayerData({ id }) {
    let prisma = new PrismaClient({
        datasources: {
            db: { url: process.env.SHARPTIMER_DATABASE }
        }
    })

    let playerRecords = await prisma.$queryRaw`
    SELECT * FROM PlayerRecords WHERE SteamID = ${id} ORDER BY TimerTicks
    `

    prisma.$disconnect();

    if (playerRecords === null)
        return (
            <div>Twoj stary jebany</div>
        )

    return (
        <div>
            <div className="hidden lg:p-2 lg:grid grid-cols-6 w-full text-center bg-zinc-900 mb-2 rounded-md">
                <span>Map name</span>
                <span>Nickname</span>
                <span>Time</span>
                <span>Times finished</span>
                <span>Style</span>
                <span>Last finished on:</span>
            </div>
            {playerRecords.map((i, k) => (
                <div className="p-2 flex flex-col lg:grid lg:grid-cols-6 w-full border-b text-center hover:bg-zinc-900" key={k}>
                    <span>{i.MapName}</span>
                    <span>{i.PlayerName}</span>
                    <span>{i.FormattedTime}</span>
                    <span>{i.TimesFinished}</span>
                    <span>{i.Style}</span>
                    <span>{UnixToTime(i.LastFinished)} </span>
                </div>
            ))}
        </div>
    )

}