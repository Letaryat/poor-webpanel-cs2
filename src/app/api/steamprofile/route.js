export default async function FetchSteamPlayerInfo(sid){
    const key = process.env.STEAM_API_KEY;
    let steamid = sid;
    const response = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${steamid}`);
    let steamdata;
    if(!response.ok){
        return steamdata = {
            avatar: "--",
            avatarmedium: "--",
            avatarfull: "--",
            created: "--",
            personaname: "--",
            lastlogoff: "--",
            personastate: "--",
            profileurl: "--",
        };
    }else{
        const data = await response.json();
        steamdata = {
            avatar: data.response.players[0].avatar,
            avatarmedium: data.response.players[0].avatarmedium,
            avatarfull: data.response.players[0].avatarfull,
            created: data.response.players[0].timecreated,
            personaname: data.response.players[0].personaname,
            lastlogoff: data.response.players[0].lastlogoff,
            personastate: data.response.players[0].personastate,
            profileurl: data.response.players[0].profileurl,
        }
        return steamdata;
    }
}