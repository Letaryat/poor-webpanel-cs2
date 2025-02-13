'use client'
import { useEffect, useState } from "react"
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function PlayerServers({ sid, serverid }) {
    const [playerServers, setPlayerServers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPlayerServers() {
            try {
                const databases = await fetch(`/api/dbcount`);
                const dbresult = await databases.json();

                const results = await Promise.all(
                    dbresult.map(async (db) => {
                        const response = await fetch(`/api/searchplayer?player=${sid}&server=${db.id}`);
                        const data = await response.json();

                        if (data.players.length > 0) {
                            return { ...data.players[0], serverid: db.id, serverName: db.name };
                        }
                        return null;
                    })
                );

                setPlayerServers(results.filter(player => player !== null));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchPlayerServers();
    }, [sid]);

    return (
        <div className="relative flex gap-1 mb-2 items-center">
            {loading ? (
                <Skeleton className="p-2 w-[100%] border border-neutral-800  h-[36px]"/>
            ) : playerServers.length > 0 ? (
                playerServers.map((p, i) => (
                    <Link key={i} href={`/zenith/${sid}?server=${p.serverid}`}>
                        <Button variant="secondary" className={
                            p.serverid == serverid ? "bg-blue-500 text-white" : ""
                            }>
                            {p.serverName}
                        </Button>
                    </Link>
                ))
            ) : (
                <div>Gracza nie znaleziono.</div> 
            )}
        </div>
    );
}
