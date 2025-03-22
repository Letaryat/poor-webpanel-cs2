import { PrismaClient } from "@prisma/client";

import Image from "next/image";

import PlayerTimeChart from "./timechart";
import {WeaponFavStats, WeaponStats} from "./weaponstats";
import { FavMap, MapStats } from "./mapstats";


const databases = JSON.parse(process.env.ZENITH_DATABASE || "{}");
export default async function MainPlayerStats({ id, sid }) {
    const prisma = new PrismaClient({
        datasources: {
            db: { url: databases[sid["server"]]["url"] }
        }
    })

    const player = await prisma.zenith_player_storage.findUnique({
        where: {
            steam_id: id,
        },
    });
    if (!player) {
        return <div>Gracza nie ma</div>
    }
    /*
    const weaponStats = await prisma.zenith_weapon_stats.findMany({
        where: {
            steam_id: id,
        },
        orderBy: {
            kills: "desc",
        },
    });
    if (!weaponStats || weaponStats.length === 0) {
        return <div>Gracza nie ma - weaponstats</div>;
    }
    */

    const mapStats = await prisma.zenith_map_stats.findMany({
        where: {
            steam_id: id,
        },
        orderBy: {
            rounds_overall: "desc",
        },
    });
    /*
    if (!weaponStats || weaponStats.length === 0) {
        return <div>Gracza nie ma - weaponstats</div>;
    }
    */
    const lastOnlineFormatted = player.last_online.toLocaleString();
    const timeStats = JSON.parse(player.K4_Zenith_TimeStats_storage);
    const ranks = JSON.parse(player.K4_Zenith_Ranks_storage);
    const stats = JSON.parse(player.K4_Zenith_Stats_storage);
/*
    const labels = [
        "HeadHits",
        "ChestHits",
        "Stomach",
        "Left Arm",
        "Right Arm",
        "Left leg",
        "Right leg",
        "Neck",

    ];
    const killsData = [
        stats.HeadHits,
        stats.ChestHits,
        stats.StomachHits,
        stats.LeftArmHits,
        stats.RightArmHits,
        stats.LeftLegHits,
        stats.RightLegHits,
        stats.NeckHits,

    ];
    */
    await prisma.$disconnect();
    return (
        <div>
            <div className="grid grid-cols-5 grid-rows-6 gap-2 h-[850px] mb-2">
                <div className="relative overflow-hidden border border-neutral-800 bg-neutral-900 p-2 text-center rounded-md flex justify-center items-center" >
                    <div className="flex flex-col">
                        <p className="text-xl">Kills</p>
                        <h3 className="text-5xl font-bold">{stats?.Kills ?? "0"}</h3>
                    </div>
                </div>
                <div className="relative overflow-hidden border border-neutral-800 bg-neutral-900 p-2 text-center rounded-md flex justify-center items-center">
                    <div className="flex flex-col">
                        <p className="text-xl">Deaths</p>
                        <h3 className="text-5xl font-bold">{stats?.Deaths ?? "0"}</h3>
                    </div>
                </div>
                <div className="relative overflow-hidden border border-neutral-800 bg-neutral-900 p-2 text-center rounded-md flex justify-center items-center">
                    <div className="flex flex-col">
                        <p className="text-xl">Assists</p>
                        <h3 className="text-5xl font-bold">{stats?.Assists ?? "0"}</h3>
                    </div>
                </div>

                <WeaponFavStats id={id} sid={sid}/>
                <WeaponStats id={id} sid={sid}/>


                <div className="col-span-2 row-span-2 col-start-4 row-start-1 relative overflow-hidden border border-neutral-800 bg-neutral-900 p-2 text-center rounded-md flex flex-col justify-center items-center">
                    <h4 className="text-xl font-bold">Player playtime</h4>
                    <div className="h-[225px] w-[225px]">
                        <PlayerTimeChart tt={timeStats?.TerroristPlaytime ?? "0"} ct={timeStats?.CounterTerroristPlaytime ?? "0"} spec={timeStats?.SpectatorPlaytime ?? "0"}/>
                    </div>
                </div>

                <FavMap id={id} sid={sid}/>
                <MapStats id={id} sid={sid}/>
            </div>


        </div>
    )
}