import { PrismaClient } from "@prisma/client"
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainPlayerStats from "./mainstats";
import FetchSteamPlayerInfo from "@/app/api/steamprofile/route";
import PlayerServers from "./playerservers";
import { IfTheSame } from "@/app/api/avatar/saveavatar/route";
import { StylePoints, CalculateBackground, CalculateColor, ShortNickname } from '@/lib/playerfunctions' 

const databases = JSON.parse(process.env.ZENITH_DATABASE || "{}");

export default async function PlayerProfile({ params, searchParams }) {
    const { id } = await params;
    const serverid = await searchParams || null;

    if (!serverid ) {
        console.log("Niepoprawny serverid lub brak wpisu w databases");
        return <div className="text-red-500 text-center">Nie znaleziono serwera lub ID jest niepoprawne.</div>;
    }

    //console.log(serverid["server"]);
    let prisma = new PrismaClient({
        datasources: {
            db: { url: databases[serverid["server"]]["url"] }
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

    const lastOnlineFormatted = player.last_online.toLocaleString();
    const timeStats = JSON.parse(player.K4_Zenith_TimeStats_storage);
    const ranks = JSON.parse(player.K4_Zenith_Ranks_storage);
    const stats = JSON.parse(player.K4_Zenith_Stats_storage);

    let PlayerSteamData = await FetchSteamPlayerInfo(player.steam_id);
    await prisma.$disconnect();

    await IfTheSame(id, PlayerSteamData.avatarmedium);
    //await SteamAvatarSaver(id);

    return (
        <div className="flex justify-center">
            <main className="container">
                <PlayerServers sid={id} serverid={serverid["server"]} />
                <div className="ProfileHeader relative rounded-md" style={{
                    width: "100%",
                }}>
                    <div className="ProfileBackgroundImage rounded-md"
                        style={{
                            backgroundImage: `linear-gradient(to bottom, rgba(24, 25, 26, 0.52), rgba(0, 0, 0, 0.73)), url(https://images8.alphacoders.com/132/1329760.jpeg)`,
                            backgroundSize: 'cover',
                            backgroundPosition: "50% 50%",
                            width: "100%",
                            height: "100%",
                            opacity: "65%",
                            zIndex: "-1",
                            position: "absolute"
                        }}
                    ></div>
                    <div className="flex items-center p-2">
                        <Image className="rounded-xl" src={PlayerSteamData.avatarfull} width={120} height={120} alt="pfp" unoptimized />
                        <div className="flex flex-col ml-3">
                            <h1 className="font-bold text-2xl">{player.name}</h1>
                            <p>Last online: {lastOnlineFormatted}</p>
                            <div className="flex mt-2 ml-2 items-center">
                                <div>
                                    <div className="flex justify-center mr-3 items-center h-[100%]">
                                        <div className=" absolute">
                                            {CalculateBackground(ranks?.Points)}
                                        </div>
                                         {StylePoints(ranks?.Points)}
                                    </div>
                                </div>
                                <div>
                                    - {ranks?.Rank.includes("k4.phrases.rank") ? ranks?.Rank.split('.')[3] : ranks?.Rank}

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <Tabs defaultValue="main" >
                    <TabsList>
                        <TabsTrigger value="main">Main</TabsTrigger>
                    </TabsList>
                    <div className="w-[100%]">
                        <TabsContent value="main"><MainPlayerStats id={id} sid={serverid} /></TabsContent>
                    </div>

                </Tabs>
            </main>
        </div>

    )
}