import { PrismaClient } from "@prisma/client";
import FetchSteamPlayerInfo from "../steamprofile/route";
import {AvatarSaverForTable} from "../avatar/saveavatar/route";
const databases = JSON.parse(process.env.ZENITH_DATABASE || "{}");

//const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const server = parseInt(searchParams.get("server") || 0);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const offset = (page - 1) * limit;

        console.log(databases[server]["url"])

        if(!databases[server]){
            return new Response(JSON.stringify({ error: `No server in db` }), { 
                status: 500, 
                headers: { "Content-Type": "application/json" } 
            });
        }

        const prisma = new PrismaClient({
            datasources: {
                db: { url:databases[server]["url"]}
            }
        })

        const players = await prisma.$queryRaw`
            SELECT 
                steam_id, 
                name, 
                last_online, 
                JSON_UNQUOTE(JSON_EXTRACT(\`K4-Zenith-Ranks.storage\`, '$.Points')) AS points,
                JSON_UNQUOTE(JSON_EXTRACT(\`K4-Zenith-Ranks.storage\`, '$.Rank')) AS rank,
                JSON_UNQUOTE(JSON_EXTRACT(\`K4-Zenith-Stats.storage\`, '$.Kills')) AS kills,
                JSON_UNQUOTE(JSON_EXTRACT(\`K4-Zenith-Stats.storage\`, '$.Deaths')) AS deaths,
                JSON_UNQUOTE(JSON_EXTRACT(\`K4-Zenith-TimeStats.storage\`, '$.TotalPlaytime')) AS time
            FROM zenith_player_storage
            ORDER BY CAST(points AS UNSIGNED) DESC
            LIMIT ${limit} OFFSET ${offset};
        `;
        /*
        const playersWithAvatars = await Promise.all(players.map(async (player) => {
            try {
                await AvatarSaverForTable(player.steam_id);
            } catch (error) {
                console.error(`Błąd pobierania awatara dla ${player.steam_id}:`, error);
            }
        }));


        const playersWithAvatars = await Promise.all(players.map(async (player) => {
            try {
                const steamProfile = await FetchSteamPlayerInfo(player.steam_id);
                return {
                    ...player,
                    avatar: steamProfile?.avatar || null 
                };
            } catch (error) {
                console.error(`Błąd pobierania awatara dla ${player.steam_id}:`, error);
                return { ...player, avatar: "avatars/1.jpg" }; 
            }
        }));
        */
        const totalPlayersResult = await prisma.$queryRaw`
            SELECT COUNT(*) as total FROM zenith_player_storage;
        `;

        const totalPlayers = Number(totalPlayersResult[0].total);

        return new Response(JSON.stringify({
            players: players,
            total: totalPlayers, 
            page,
            limit
        }), { 
            status: 200, 
            headers: { "Content-Type": "application/json" } 
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: `Błąd pobierania danych: ${error.message}` }), { 
            status: 500, 
            headers: { "Content-Type": "application/json" } 
        });
    }
}
