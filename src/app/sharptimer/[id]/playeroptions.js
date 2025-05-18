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