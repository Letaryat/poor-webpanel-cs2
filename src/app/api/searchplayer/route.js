import { PrismaClient } from "@prisma/client";
import { stringify } from "postcss";
import FetchSteamPlayerInfo from "../steamprofile/route";

const databases = JSON.parse(process.env.ZENITH_DATABASE || "{}");

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("player") || "";
        const server = searchParams.get("server") || 0;
        if(search == ""){
            return new Response(JSON.stringify({
                players: "Brak graczy"
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" } 
            })
        }
        const prisma = new PrismaClient({
            datasources: {
                db: { url: databases[server]["url"] }
            }
        })
        const players = await prisma.$queryRaw`
            SELECT steam_id, name
            FROM zenith_player_storage
            WHERE name LIKE ${`%${search}%`} OR steam_id LIKE ${`%${search}%`};
        `;

        const playersWithAvatars = await Promise.all(players.map(async (player) => {
            try {
                const steamProfile = await FetchSteamPlayerInfo(player.steam_id);
                return {
                    ...player,
                    avatar: steamProfile?.avatar || null
                };
            } catch (error) {
                return { ...player, avatar: null }; 
            }
        }));

        return new Response(JSON.stringify({
            players: playersWithAvatars
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