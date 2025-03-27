import { PrismaClient } from "@prisma/client";

export async function GET(){
    try{
        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: process.env.SIMPLEADMIN_DATABASE
                },
            },
        });
        let dataAdmins = await prisma.$queryRaw`
            SELECT player_name, player_steamid FROM sa_admins;
        `
        let dataServers = await prisma.$queryRaw`
            SELECT id, hostname FROM sa_servers;
        `
        
        return new Response(JSON.stringify({
            admins: dataAdmins,
            servers: dataServers
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        })
    }
    catch(error)
    {
        return new Response(JSON.stringify({ error: `Błąd pobierania danych: ${error.message}` }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }

}