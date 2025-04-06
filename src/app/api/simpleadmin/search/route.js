import { PrismaClient } from "@prisma/client";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("player") || "%";
        const type = searchParams.get("type")
        const page = searchParams.get("page") || 1;

        const limit = 10;
        const offset = (page - 1) * limit;

        let admin = searchParams.get("admin") || "%";
        let server = searchParams.get("server") || "%";

        if (admin === "-1") admin = "%";
        if (server === "-1") server = "%";

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
        let totalbans;

        if (type === "bans") {
            players = await prisma.$queryRaw`
            SELECT sa_bans.id, sa_bans.player_name, sa_bans.player_steamid, sa_bans.admin_steamid, sa_bans.admin_name, sa_bans.reason, sa_bans.duration, sa_bans.ends, sa_bans.created, sa_servers.hostname AS server_id, sa_bans.unban_id, sa_bans.status, sa_unbans.reason AS reasonub, sa_admins.player_steamid AS adminUB, sa_admins.player_name AS adminnameUB
            FROM 
            sa_bans 
            LEFT JOIN sa_unbans ON sa_bans.id = sa_unbans.ban_id
            LEFT JOIN sa_admins ON sa_unbans.admin_id = sa_admins.id
            LEFT JOIN sa_servers ON sa_bans.server_id = sa_servers.id WHERE 
            sa_bans.player_steamid LIKE ${`%${search}%`} AND sa_bans.admin_steamid LIKE ${`${admin}`} AND sa_bans.server_id LIKE ${`%${server}%`} OR
            sa_bans.player_name LIKE ${`%${search}%`} AND sa_bans.admin_steamid LIKE ${`${admin}`} AND sa_bans.server_id LIKE ${`%${server}%`}
            ORDER BY created DESC LIMIT ${limit} OFFSET ${offset};
        `;
            totalbans = await prisma.$queryRaw`
        SELECT COUNT(*) OVER() AS total_count FROM sa_bans LEFT JOIN sa_servers ON sa_bans.server_id = sa_servers.id WHERE 
            sa_bans.player_steamid LIKE ${`%${search}%`} AND sa_bans.admin_steamid LIKE ${`${admin}`} AND sa_bans.server_id LIKE ${`%${server}%`} OR
            sa_bans.player_name LIKE ${`%${search}%`} AND sa_bans.admin_steamid LIKE ${`${admin}`} AND sa_bans.server_id LIKE ${`%${server}%`}
        `;

        }
        else if (type === "mutes") {
            players = await prisma.$queryRaw`
                    SELECT sa_mutes.id, sa_mutes.player_name, sa_mutes.player_steamid, sa_mutes.admin_steamid, sa_mutes.admin_name, sa_mutes.reason, sa_mutes.duration, sa_mutes.ends, sa_mutes.created, sa_mutes.type, sa_servers.hostname AS server_id, sa_mutes.unmute_id, sa_mutes.status, sa_unmutes.reason AS reasonub, sa_admins.player_steamid AS adminUB, sa_admins.player_name AS adminnameUB
                    FROM sa_mutes 
                    LEFT JOIN sa_unmutes ON sa_mutes.id = sa_unmutes.mute_id
                    LEFT JOIN sa_admins ON sa_unmutes.admin_id = sa_admins.id
                    LEFT JOIN sa_servers ON sa_mutes.server_id = sa_servers.id WHERE
                    sa_mutes.player_steamid LIKE ${`%${search}%`} AND sa_mutes.admin_steamid LIKE ${`${admin}`} AND sa_mutes.server_id LIKE ${`%${server}%`} OR
                    sa_mutes.player_name LIKE ${`%${search}%`} AND sa_mutes.admin_steamid LIKE ${`${admin}`} AND sa_mutes.server_id LIKE ${`%${server}%`}
                     ORDER BY created DESC LIMIT ${limit} OFFSET ${offset};
                `;
            totalbans = await prisma.$queryRaw`
                SELECT COUNT(*) OVER() AS total_count FROM sa_mutes LEFT JOIN sa_servers ON sa_mutes.server_id = sa_servers.id WHERE
                    sa_mutes.player_steamid LIKE ${`%${search}%`} AND sa_mutes.admin_steamid LIKE ${`${admin}`} AND sa_mutes.server_id LIKE ${`%${server}%`} OR
                    sa_mutes.player_name LIKE ${`%${search}%`} AND sa_mutes.admin_steamid LIKE ${`${admin}`} AND sa_mutes.server_id LIKE ${`%${server}%`}
                `;
        }

        const total = Number(totalbans[0].total_count);

        return new Response(JSON.stringify({
            players: players,
            page: page,
            total: total,
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