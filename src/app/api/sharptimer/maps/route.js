import { PrismaClient } from "@prisma/client";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type") || "global";

        let prefix;
        if(type === "global")
        {
            prefix = "%";
        }
        else{
             prefix = `${type}%`;
        }

        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: process.env.SHARPTIMER_DATABASE
                },
            },
        });

        let dataquery = await prisma.$queryRaw`
        SELECT DISTINCT MapName FROM PlayerRecords WHERE MapName LIKE ${prefix} ORDER BY MapName ASC;
        `;

        return new Response(JSON.stringify({
            data: dataquery
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