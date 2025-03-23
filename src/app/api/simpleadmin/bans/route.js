import { PrismaClient } from "@prisma/client";
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: process.env.SIMPLEADMIN_DATABASE
                },
            },
        });

        const bans = await prisma.$queryRaw`
            SELECT sa_bans.id, sa_bans.player_name, sa_bans.player_steamid, sa_bans.admin_steamid, sa_bans.admin_name, sa_bans.reason, sa_bans.duration, sa_bans.ends, sa_bans.created, sa_servers.hostname AS server_id, sa_bans.unban_id, sa_bans.status
            FROM sa_bans LEFT JOIN sa_servers ON sa_bans.server_id = sa_servers.id ORDER BY created DESC LIMIT ${limit} OFFSET ${offset};
          `;


        const totalbans = await prisma.$queryRaw`
        SELECT COUNT(*) as total FROM sa_bans;
        `

        const total = Number(totalbans[0].total);

        return new Response(JSON.stringify({
            bans: bans,
            total,
            page,
            limit

        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: `Blad pobierania danych: ${error}` }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        })
    }



}
