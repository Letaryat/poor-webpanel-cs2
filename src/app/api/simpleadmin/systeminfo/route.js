import { PrismaClient } from "@prisma/client";

export async function GET() {
    try {
        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: process.env.SIMPLEADMIN_DATABASE
                },
            },
        });
        let dataAdmins = await prisma.$queryRaw`
            SELECT 
                sa_admins.player_name, 
                sa_admins.player_steamid, 
                sa_admins_flags.flag AS Flag,
                CAST((SELECT COUNT(*) FROM sa_bans WHERE sa_bans.admin_steamid = sa_admins.player_steamid) AS SIGNED) AS BANS,
                CAST((SELECT COUNT(*) FROM sa_mutes WHERE sa_mutes.admin_steamid = sa_admins.player_steamid) AS SIGNED) AS MUTES
            FROM sa_admins 
            LEFT JOIN sa_admins_flags ON sa_admins_flags.admin_id = sa_admins.id
        `
        let dataServers = await prisma.$queryRaw`
            SELECT id, hostname FROM sa_servers;
        `

        return new Response(JSON.stringify({
            admins: dataAdmins.map(admin => ({
                ...admin,
                BANS: Number(admin.BANS),  // Konwersja BigInt → Number
                MUTES: Number(admin.MUTES) // Konwersja BigInt → Number
            })),
            servers: dataServers
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