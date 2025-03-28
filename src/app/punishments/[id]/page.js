
import FetchSteamPlayerInfo from "@/app/api/steamprofile/route";
import { Prisma, PrismaClient } from "@prisma/client";
import { Ban, MicOff } from 'lucide-react';
import { BanCard } from "@/components/bans/bancardprofile";
import { Accordion } from "@radix-ui/react-accordion";
import Image from "next/image";
import PlayerServers from "@/app/zenith/[id]/playerservers";
import IfAdmin from "./admin";

export default async function PlayerProfile({ params }) {
    const { id } = await params;
    let playerSteamData;
    try {
        playerSteamData = await FetchSteamPlayerInfo(id);
    }
    catch (error) {
        console.log(error);
    }

    let prisma = new PrismaClient({
        datasources: {
            db: { url: process.env.SIMPLEADMIN_DATABASE }
        }
    })
    let playerBans = await prisma.$queryRaw`
        SELECT sa_bans.id, sa_bans.player_name, sa_bans.player_steamid, sa_bans.admin_steamid, sa_bans.admin_name, sa_bans.reason, sa_bans.duration, sa_bans.ends, sa_bans.created, sa_servers.hostname AS server_id, sa_bans.unban_id, sa_bans.status
        FROM sa_bans 
        LEFT JOIN sa_servers ON sa_bans.server_id = sa_servers.id 
        WHERE player_steamid = ${`${id}`}
     `;

    let playerMutes = await prisma.$queryRaw`
     SELECT sa_mutes.id, sa_mutes.player_name, sa_mutes.player_steamid, sa_mutes.admin_steamid, sa_mutes.admin_name, sa_mutes.reason, sa_mutes.duration, sa_mutes.ends, sa_mutes.created, sa_mutes.type, sa_servers.hostname AS server_id, sa_mutes.unmute_id, sa_mutes.status
     FROM sa_mutes LEFT JOIN sa_servers ON sa_mutes.server_id = sa_servers.id
     WHERE player_steamid = ${`${id}`}
    `;

    prisma.$disconnect();
    return (
        <div className="flex justify-center">
            <main className="relative flex container gap-2 flex-col">
                <div className="text-center">
                    <h1 className="font-bold text-2xl">{playerSteamData.personaname}</h1>
                    <p className="">Punishment history</p>
                </div>
                <div className="flex justify-center">
                    <div className="">
                        <div className="rounded-full bg-zinc-800 p-4 relative top-16 left-6 text-red-400">
                            <Ban />
                        </div>
                    </div>
                    <div>
                        <Image className="rounded-full bg-zinc-800 border-zinc-800 border-8" src={playerSteamData.avatarfull} width={184} height={184} alt="avatar" unoptimized />
                        <IfAdmin sid={id} />
                    </div>
                    <div>
                        <div className="rounded-full bg-zinc-800 p-4 relative top-16 right-6 text-red-400">
                            <MicOff />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <p className="mb-2">Was playing on:</p>
                    <PlayerServers sid={id} />
                </div>
                <div className="grid grid-cols-2 justify-center gap-1">
                    <div className="flex justify-center ">
                        <Accordion type="single" collapsible className={`w-full`}>

                            {playerBans.length > 0 ? (
                                playerBans.map((bans, i) => (
                                    <BanCard key={i}
                                        id={bans.id}
                                        pname={bans.player_name}
                                        psid={bans.player_steamid}
                                        asid={bans.admin_steamid}
                                        aname={bans.admin_name}
                                        reason={bans.reason}
                                        duration={bans.duration}
                                        end={bans.ends ? new Date(bans.ends).toLocaleString() : "Unknown"}
                                        created={bans.created ? new Date(bans.created).toLocaleString() : "Unknown"}
                                        serverid={bans.server_id}
                                        unbanid={bans.unban_id}
                                        status={bans.status}
                                        ubreason={bans.reasonub}
                                        aubsid={bans.adminUB}
                                        aubname={bans.adminnameUB}
                                    />
                                ))
                            ) : (
                                <div className="flex justify-center items-center">
                                    <p className="flex justify-center p-1 pl-2 pr-2 items-center rounded-md border border-green-800 bg-green-400 bg-opacity-20">
                                    No bans founded for this player! </p>
                                </div>
                            )}
                        </Accordion>
                    </div>
                    <div className="flex justify-center ">
                        <Accordion type="single" collapsible className={`w-full`}>
                            {playerMutes.length > 0 ? (
                                playerMutes.map((bans, i) => (
                                    <BanCard key={i}
                                        id={bans.id}
                                        pname={bans.player_name}
                                        psid={bans.player_steamid}
                                        asid={bans.admin_steamid}
                                        aname={bans.admin_name}
                                        reason={bans.reason}
                                        duration={bans.duration}
                                        end={bans.ends ? new Date(bans.ends).toLocaleString() : "Unknown"}
                                        created={bans.created ? new Date(bans.created).toLocaleString() : "Unknown"}
                                        serverid={bans.server_id}
                                        unbanid={bans.unban_id}
                                        status={bans.status}
                                        ubreason={bans.reasonub}
                                        aubsid={bans.adminUB}
                                        aubname={bans.adminnameUB}
                                    />
                                ))
                            ) : (
                                <div className="flex justify-center items-center">
                                    <p className="flex justify-center p-1 pl-2 pr-2 items-center rounded-md border border-green-800 bg-green-400 bg-opacity-20">
                                    No mutes founded for this player! </p>
                                </div>
                            )}
                        </Accordion>
                    </div>
                </div>
            </main>
        </div>
    )
}