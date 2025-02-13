'use client'
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PlayerListRow } from "@/components/players/playerslist";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import PlayerSearch from "./search";

export default function ZenithRanking() {
    const [playersData, setPlayersData] = useState([]);
    const [totalPlayers, setTotalPlayers] = useState(null);
    const [clickedServer, setClickedServer] = useState(0);
    const [loading, setLoading] = useState(true);
    const [numDB, setNumDB] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const playersPerPage = 10;


    useEffect(() => {
        async function fetchPlayersData() {
            try {
                setLoading(true);
                const response = await fetch(`/api/playerslist?server=${clickedServer}&page=${currentPage}&limit=${playersPerPage}`);
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
        fetchPlayersData();
    }, [clickedServer,currentPage]);

    const nextPage = () => setCurrentPage((prev) => prev + 1);
    const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    const totalPages = Math.ceil(totalPlayers / playersPerPage) || 1;
    const startPage = Math.max(1, currentPage - 3);
    const endPage = Math.min(totalPages, currentPage + 3);
    const pagesToShow = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    console.log(playersData);

    if (loading) {
        return (
            <div className="grid justify-center items-center">
                <main className="flex flex-col w-[960px] text-center">
                    {[...Array(playersPerPage)].map((_, i) => (
                        <Skeleton key={i} className="grid grid-cols-4 p-2 border border-neutral-800 mb-2 h-[42px]" />
                    ))}
                </main>
            </div>
        );
    }

    return (
        <div className="grid justify-center items-center">
            <main className="flex flex-col w-[960px]  text-center">
                <div className="flex justify-between">
                    <div className="flex gap-2 mb-2">
                    {numDB && numDB.length > 0 ? (
                        numDB.map((db, i) => (
                            <Button variant="secondary" className={`${clickedServer == db.id ? "bg-blue-500 text-white" : ""} `}
                            key={i}
                            onClick={() => {
                                setClickedServer(db.id);
                                setCurrentPage(1);
                            }}
                            >
                                {db.name}
                            </Button>
                        ))
                    ) : (
                        <p>Loading databases...</p>
                    )}
                    </div>
                    <PlayerSearch serverid={clickedServer}/>
                </div>
                <div className="h-[670px]">
                    <div className="grid grid-cols-4 p-2 border border-neutral-800 mb-2 rounded-md bg-neutral-900">
                        <div>Position</div>
                        <div>Nickname</div>
                        <div>Points</div>
                        <div>Rank</div>
                    </div>
                    {playersData.map((player, i) => (
                        <Link href={`/zenith/${player.steam_id}?server=${clickedServer}`} key={i}>
                            <PlayerListRow
                                position={(currentPage - 1) * playersPerPage + i + 1}
                                avatar={player.avatar}
                                nickname={player.name}
                                points={player.points}
                                rank={player.rank.split('.')[3]}
                            />
                        </Link>
                    ))}
                </div>

                <div className="flex justify-between mt-4">
                <div className="flex gap-1">
                <button
                        onClick={() => {setCurrentPage(1)}}
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
                                onClick={() => setCurrentPage(page)}
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
                        onClick={() => {setCurrentPage(totalPages)}}
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
