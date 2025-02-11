'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "./ui/progress";
import { Skeleton } from "./ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { LoaderSpinner } from "./loader";
import Link from "next/link";

export function ServerList() {
    const [serverData, setServerData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchServerData() {
            try {
                const response = await fetch("/api/servers");
                const data = await response.json();
                setServerData(data);
                setLoading(false);
            } catch (error) {
                console.error("Error:", error);
                setLoading(false);
            }
        }

        fetchServerData();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-3 justify-center gap-2">
                <Skeleton className="h-[150px] rounded-md" />
                <Skeleton className="h-[150px] rounded-md" />
                <Skeleton className="h-[150px] rounded-md" />
            </div>
        )
    }

    return (
        <div className="grid grid-cols-3 justify-center gap-2">
            {
            serverData.map((server, i) => (
                <div key={i} className="flex relative serverCard rounded-sm h-[150px] justify-center items-center">
                    {server.state ? (
                        <>
                            <div className="serverMap rounded-sm"
                                style={{
                                    backgroundImage: `linear-gradient(to bottom, rgba(24, 25, 26, 0.52), rgba(0, 0, 0, 0.73)), url(https://rank.pierdolnik.eu/storage/cache/img/maps/730/${server.state.map}.jpg)`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: "50% 50%",
                                    minHeight: "100%",
                                    minWidth: "100%",
                                    opacity: "65%",
                                    zIndex: "-1",
                                    position: "absolute"
                                }}></div>
                            <div className="p-2 w-[75%] flex items-center justify-center flex-col">
                                <h3 className="serverName font-semibold">{server.name}</h3>
                                <div>{server.state.map}</div>
                                <div>{server.state.numplayers} / {server.state.maxplayers}</div>
                                <Progress value={(server.state.numplayers / server.state.maxplayers) * 100}></Progress>
                                <div className="flex gap-2 justify-between mt-2">
                                    <Dialog>
                                        <DialogTrigger>Join</DialogTrigger>
                                        <DialogContent className="h-[500px] h-min-[500px]">
                                        <div className="serverMap rounded-sm" style={{
                                                            backgroundImage: `linear-gradient(to bottom, rgba(24, 25, 26, 0.52), rgba(0, 0, 0, 1)), url(https://rank.pierdolnik.eu/storage/cache/img/maps/730/${server.state.map}.jpg)`,
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: "50% 50%",
                                                            minHeight: "50%",
                                                            minWidth: "100%",
                                                            opacity: "65%",
                                                            zIndex: "-1",
                                                            position: "absolute"
                                                        }}></div>
                                            <DialogHeader>
                                                <DialogTitle>Informations: {server.name}</DialogTitle>
                                                <DialogDescription>{server.state.map}</DialogDescription>
                                                <div className="text-center">{server.state.numplayers} / {server.state.maxplayers}</div>
                                                <Progress value={(server.state.numplayers / server.state.maxplayers) * 100}></Progress>
                                            </DialogHeader>

                                            {server.state.players.length > 0 ? (
                                                <div style={{
                                                    position: "relative",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    overflowY: "auto",
                                                    height: "275px"
                                                }}>
                                                    <div className="grid grid-cols-3 gap-5 font-bold text-center">
                                                        <span>Nickname</span>
                                                        <span>Score</span>
                                                        <span>Time</span>
                                                    </div>
                                                    {server.state.players.map((player, index) => (
                                                        <div key={index} className="serverListPlayers grid grid-cols-3 text-center">
                                                            <span>{player.name}</span>
                                                            <span>{player.raw.score}</span>
                                                            <span>{Math.round(player.raw.time / 60)} mins</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div>No players found</div>
                                            )}

                                            <div className="flex justify-center gap-2 text-center">
                                                <Button>
                                                    <Link href={`steam://run/730//+connect ${server.state.connect}`}>Join</Link>
                                                </Button>
                                                <Button>
                                                    <Link href={`steam://run/730//+connect ${server.state.connect}`}>Copy IP</Link>
                                                </Button>
                                                <Button>
                                                    <Link href={`steam://run/730//+connect ${server.state.connect}`}>Demos</Link>
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-white">Błąd ładowania serwera</p>
                    )}
                </div>
            ))}
        </div>
    );
}
