import { PrismaClient } from "@prisma/client";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const map = searchParams.get('map') || "%";
        const type = searchParams.get("type") || "global";
        const player = searchParams.get("player") || "%";
        const limit = 10;
        const offset = (page - 1) * limit;

        const newPlayer = `${player}%`

        console.log(map);

        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: process.env.SHARPTIMER_DATABASE
                },
            },
        });

        let dataquery = await prisma.$queryRaw`
        SELECT * FROM PlayerRecords WHERE MapName LIKE ${map} AND (PlayerName LIKE ${newPlayer} OR SteamID LIKE ${newPlayer}) ORDER BY TimerTicks ASC LIMIT ${limit} OFFSET ${offset};
        `;

        let totalquery = await prisma.$queryRaw`
        SELECT COUNT(*) as total FROM PlayerRecords WHERE MapName LIKE ${map} AND (PlayerName LIKE ${newPlayer} OR SteamID LIKE ${newPlayer})
        `

        let total = Number(totalquery[0].total);

        return new Response(JSON.stringify({
            data: dataquery,
            total: total,
            limit: limit,
            page: page
        }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" }
            })
    }
    catch (error) {
        return new Response(JSON.stringify({ error: `Blad pobierania danych: ${error}` }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        })
    }

}