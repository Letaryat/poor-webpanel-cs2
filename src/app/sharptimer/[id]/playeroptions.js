import { PrismaClient } from "@prisma/client";
export async function SharpTimerPlayerOptions(id)
{
        let prisma = new PrismaClient({
            datasources: {
                db: { url: process.env.SHARPTIMER_DATABASE }
            }
        })
    
        let playerData = await prisma.$queryRaw`
        SELECT * FROM PlayerStats WHERE SteamID = ${id}
        `
    
        prisma.$disconnect();
    
        if (playerData === null)
            return (
                <div>Twoj stary jebany</div>
            )

        return playerData;
    
}

export async function GetFavMap(id)
{
            let prisma = new PrismaClient({
            datasources: {
                db: { url: process.env.SHARPTIMER_DATABASE }
            }
        })
    
        let map = await prisma.$queryRaw`
        SELECT * FROM PlayerRecords WHERE SteamID = ${id} ORDER BY TimesFinished DESC LIMIT 1
        `
    
        prisma.$disconnect();
    
        if (map === null)
            return (
                <div>Twoj stary jebany</div>
            )

        return map;
}

export function formatDateToMySQL(dateStr) {
        // fuck it, chatgpt
        // not proud of that but fuck it x2
        const iso = new Date(dateStr);
        if (!isNaN(iso.getTime())) {
            return iso.toISOString().slice(0, 19).replace("T", " ");
        }

        const match = /^(\d{2})\.(\d{2})\.(\d{4}), (\d{2}):(\d{2}):(\d{2})$/.exec(dateStr);
        if (match) {
            const [_, dd, mm, yyyy, hh, mi, ss] = match;
            return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
        }

        return null;
    }