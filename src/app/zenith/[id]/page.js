import { PrismaClient } from "@prisma/client"
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainPlayerStats from "./mainstats";
import FetchSteamPlayerInfo from "@/app/api/steamprofile/route";
import PlayerServers from "./playerservers";
const databases = JSON.parse(process.env.ZENITH_DATABASE || "{}");

export default async function PlayerProfile({ params, searchParams }) {
    const { id } = await params;
    const serverid = await searchParams;
    //console.log(serverid["server"]);
    const prisma = new PrismaClient({
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

    return (
        <div className="flex justify-center">
            <main className="container">
                <PlayerServers sid={id} serverid={serverid["server"]}/>
                <div className="ProfileHeader relative rounded-md" style={{
                    width: "100%",
                }}>
                    <div className="ProfileBackgroundImage rounded-md"
                        style={{
                            backgroundImage: `linear-gradient(to bottom, rgba(24, 25, 26, 0.52), rgba(0, 0, 0, 0.73)), url(https://rank.pierdolnik.eu/storage/cache/img/maps/730/de_mirage.jpg)`,
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
                            <p>{lastOnlineFormatted}</p>
                            <p>{ranks.Points} - {ranks.Rank.split('.')[3]}</p>
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