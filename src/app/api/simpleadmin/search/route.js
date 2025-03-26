import { PrismaClient } from "@prisma/client";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("player") || "";
        const type = searchParams.get("type")

        if (search == "") {
            return new Response(JSON.stringify({
                players: "Brak graczy"
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            })
        }
        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: process.env.SIMPLEADMIN_DATABASE
                },
            },
        });
        let players;

        if (type === "bans") {
            players = await prisma.$queryRaw`
            SELECT sa_bans.id, sa_bans.player_name, sa_bans.player_steamid, sa_bans.admin_steamid, sa_bans.admin_name, sa_bans.reason, sa_bans.duration, sa_bans.ends, sa_bans.created, sa_servers.hostname AS server_id, sa_bans.unban_id, sa_bans.status
            FROM sa_bans LEFT JOIN sa_servers ON sa_bans.server_id = sa_servers.id WHERE sa_bans.player_steamid LIKE  ${`%${search}%`} OR sa_bans.player_name LIKE ${`%${search}%`} ORDER BY created DESC LIMIT 10;
        `;
        }
        else if (type === "mutes") {
            players = await prisma.$queryRaw`
                    SELECT sa_mutes.id, sa_mutes.player_name, sa_mutes.player_steamid, sa_mutes.admin_steamid, sa_mutes.admin_name, sa_mutes.reason, sa_mutes.duration, sa_mutes.ends, sa_mutes.created, sa_mutes.type, sa_servers.hostname AS server_id, sa_mutes.unmute_id, sa_mutes.status
                    FROM sa_mutes LEFT JOIN sa_servers ON sa_mutes.server_id = sa_servers.id WHERE sa_mutes.player_steamid LIKE  ${`%${search}%`} OR sa_mutes.player_name LIKE ${`%${search}%`} ORDER BY created DESC LIMIT 10;
                `;

        }

        return new Response(JSON.stringify({
            players: players
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        })

    }
    catch (error) {
        return new Response(JSON.stringify({ error: `Błąd pobierania danych: ${error.message}` }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}