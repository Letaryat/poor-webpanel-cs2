import { PrismaClient } from "@prisma/client";
export default async function SharpTimerPlayerOptions({id})
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

        return (
            <div>
                
            </div>
        )
    
}