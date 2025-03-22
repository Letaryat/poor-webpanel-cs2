'use client'
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PlayerListRow } from "@/components/players/playerslist";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import PlayerSearch from "./search";
import { useSearchParams, usePathname, useRouter } from 'next/navigation'



export default function ZenithRanking() {
    const [playersData, setPlayersData] = useState([]);
    const [totalPlayers, setTotalPlayers] = useState(null);
    const [clickedServer, setClickedServer] = useState(0);
    const [loading, setLoading] = useState(true);
    const [numDB, setNumDB] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const playersPerPage = 20;

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const params = new URLSearchParams(searchParams.toString());


    useEffect(() => {
        const paramsServer = params.get("server");
        const paramsPage = parseInt(params.get("page")) || 1;
    
        setClickedServer(paramsServer);
        setCurrentPage(paramsPage);
    
        async function fetchPlayersData(server, page) {
            try {
                setLoading(true);
                const response = await fetch(`/api/playerslist?server=${server}&page=${page}&limit=${playersPerPage}`);
                const data = await response.json();
                const responsedb = await fetch(`/api/dbcount`);
                const datadb = await responsedb.json();
    
                setNumDB(datadb);
                setPlayersData(data.players || []);
                setTotalPlayers(data.total);
                setLoading(false);
            } catch (error) {
                console.log(`Error fetching players data: ${error}`);
                setLoading(false);
            }
        }
        fetchPlayersData(paramsServer || clickedServer, paramsPage);
    
    }, [searchParams]);

    const nextPage = () => {
        const newPage = currentPage + 1;
        setCurrentPage(newPage);
        paramPage(newPage);
    };
    
    const prevPage = () => {
        const newPage = Math.max(currentPage - 1, 1);
        setCurrentPage(newPage);
        paramPage(newPage);
    };

    const totalPages = Math.ceil(totalPlayers / playersPerPage) || 1;
    const startPage = Math.max(1, Math.min(currentPage - 3, totalPages - 6));
    const endPage = Math.min(totalPages, startPage + 6);
    const pagesToShow = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    const paramServer = (value) => {
        params.set('server', value);
        params.delete('page');
        router.push(`${pathname}?${params.toString()}`);
    };

    const paramPage = (value) => {
        params.set("page", value); 
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    console.log(playersData);

    if (loading) {
        return (
            <div className="flex justify-center ">
                <main className="flex flex-col container text-center">
                    {[...Array(playersPerPage)].map((_, i) => (
                        <Skeleton key={i} className="grid grid-cols-4 p-2 border border-neutral-800 mb-2 h-[58px]" />
                    ))}
                </main>
            </div>
        );
    }
    return (
        <div className="flex justify-center">
            <main className="relative flex flex-col text-center container">
                <div className="flex justify-between">
                    <div className="flex gap-2 mb-2">
                        {numDB && numDB.length > 0 ? (
                            numDB.map((db, i) => (
                                <Button variant="secondary" className={`${clickedServer == db.id ? "bg-blue-500 text-white" : ""} `}
                                    key={i}
                                    onClick={() => {
                                        setClickedServer(db.id);
                                        setCurrentPage(1);
                                        paramServer(db.id);
                                    }}
                                >
                                    {db.name}
                                </Button>
                            ))
                        ) : (
                            <p>Loading databases...</p>
                        )}
                    </div>
                    <PlayerSearch serverid={clickedServer} />
                </div>
                <div>
                    <div className="grid grid-cols-8 p-2 border border-neutral-800 mb-2 rounded-md bg-neutral-900 font-bold">
                        <div>Position</div>
                        <div>Nickname</div>
                        <div>Points</div>
                        <div>Rank</div>
                        <div>Kills</div>
                        <div>Deaths</div>
                        <div>KD</div>
                        <div>Time</div>
                    </div>
                    {
                    playersData.length === 0 ? (
                        <div className="flex flex-col border border-red-400 rounded-md p-4">
                            <p>No players on this page!</p>
                        </div>
                    ) :
                    
                    playersData.map((player, i) => (                        
                        <Link href={`/zenith/${player.steam_id}?server=${clickedServer}`} key={i}>
                            <PlayerListRow
                                position={(currentPage - 1) * playersPerPage + i + 1}
                                avatar={`/api/avatar/ifexist/${player.steam_id}`}
                                nickname={player.name}
                                points={player.points}
                                rank={player.rank === "k4.phrases.rank.none" || !player.rank ? "None" : player.rank.split('.')[3] || player.rank || "--"}
                                kills={player.kills}
                                deaths={player.deaths}
                                kd={(player.kills / player.deaths).toFixed(2)}
                                time={player.time}
                            />
                        </Link>

                    ))}
                </div>

                <div className="flex justify-center gap-8 mt-4">
                    <div className="flex gap-1">
                        <button
                            onClick={() => { 
                                setCurrentPage(1)
                                paramPage(1)
                             }}
                            className="px-4 py-2 bg-neutral-900 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={currentPage === 1}
                        >
                            First
                        </button>
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-neutral-900 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                    </div>

                    <div className="flex gap-2">
                        {pagesToShow.map((page) => (
                            <button
                                key={page}
                                onClick={() => {
                                    setCurrentPage(page)
                                    paramPage(page)
                                }
                                }
                                className={`px-3 py-1 rounded ${currentPage === page ? 'bg-blue-500' : 'bg-neutral-800'}`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={nextPage}
                            className="px-4 py-2 bg-neutral-900 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={(currentPage * playersPerPage) >= totalPlayers}
                        >
                            Next
                        </button>
                        <button
                            onClick={() => { 
                                setCurrentPage(totalPages);
                                paramPage(totalPages);
                            }}
                            className="px-4 py-2 bg-neutral-900 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={(currentPage * playersPerPage) >= totalPlayers}
                        >
                            Last
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
