import { PrismaClient } from "@prisma/client";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type") || "global";

        let prefix;
        if (type === "global") {
            prefix = "%";
        }
        else {
            prefix = `${type}%`;
        }

        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: process.env.SHARPTIMER_DATABASE
                },
            },
        });

        const dataquery = await prisma.$queryRaw`
        SELECT DISTINCT MapName FROM PlayerRecords WHERE MapName LIKE ${prefix} ORDER BY MapName ASC;
        `;

        const mapCategories = await prisma.$queryRaw`
            SELECT
                EXISTS(SELECT 1 FROM PlayerRecords WHERE MapName LIKE 'SURF%') AS has_surf,
                EXISTS(SELECT 1 FROM PlayerRecords WHERE MapName LIKE 'KZ%') AS has_kz,
                EXISTS(SELECT 1 FROM PlayerRecords WHERE MapName LIKE 'BHOP%') AS has_bhop,
                EXISTS(SELECT 1 FROM PlayerRecords WHERE MapName NOT LIKE 'SURF%' AND MapName NOT LIKE 'KZ%' AND MapName NOT LIKE 'BHOP%') AS has_other;
        `;

        const presence = mapCategories[0];

        return new Response(JSON.stringify({
            data: dataquery,
            surf: Boolean(presence.has_surf),
            kz: Boolean(presence.has_kz),
            bhop: Boolean(presence.has_bhop),
            other: Boolean(presence.has_other)
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