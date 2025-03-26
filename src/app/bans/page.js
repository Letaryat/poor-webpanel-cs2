'use client'
import { useEffect, useState } from "react"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { BanCard } from "@/components/bans/bancard";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import "./styles.css";
import { Input } from "@/components/ui/input";
import ServerRadio from "@/components/bans/serverradio";
import { AdminList } from "@/components/bans/serverradio";
import PunishSearch from "./search";
import { Server } from "lucide-react";
export default function BansPage() {
    const [bans, setBans] = useState([]);
    const [allbans, setAllBans] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [text, setText] = useState("");
    const [players, setPlayers] = useState([]);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [display, setDisplay] = useState(false);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const params = new URLSearchParams(searchParams.toString());

    useEffect(() => {
        const paramsPage = Number(params.get("page")) || 1;

        setCurrentPage(paramsPage);

        async function fetchBans(page) {
            try {
                const response = await fetch(`/api/simpleadmin/bans?page=${page}`)
                const data = await response.json();
                setAllBans(data.total)
                setBans(data.bans || []);
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchBans(paramsPage)
    }, [searchParams])

    useEffect(() => {
        if (currentPage) {
            paramPage(currentPage);
        }
    }, [currentPage]);

    const nextPage = () => {
        setCurrentPage(currentPage + 1);
        paramPage(currentPage + 1);
    }

    const prevPage = () => {
        const newPage = Math.max(currentPage - 1, 1);
        setCurrentPage(newPage);
        paramPage(newPage);
    }

    const paramPage = (value) => {
        params.set("page", value);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const totalPages = Math.ceil(allbans / 10) || 1;
    const startPage = Math.max(1, Math.min(currentPage - 3, totalPages - 6));
    const endPage = Math.min(totalPages, startPage + 6);
    const pagesToShow = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    useEffect(() => {
        if (text === "") {
            setPlayers([]);
            setDisplay(false);
            return;
        }
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
        const timeout = setTimeout(() => {
            fetchPlayers();
            setDisplay(true);
        }, 500)

        setDebounceTimeout(timeout);
        return () => clearTimeout;

    }, [text]);

    const fetchPlayers = async () => {
        try {
            const response = await fetch(`/api/simpleadmin/search?player=${text}&type=bans`);
            const data = await response.json();
            if (data.players === "Brak") {
                setPlayers([]);
            }
            else {
                setPlayers(data.players || []);
            }
        }
        catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="flex justify-center">
            <main className="relative flex container gap-2 flex-col">
                <div className="flex relative gap-2">
                    <div className="basis-1/4 p-2 ">
                        <div className="sticky top-0">
                            <div>
                                <h2 className="font-semibold text-base">Search using name or SteamID64</h2>
                                <Input
                                    value={text}
                                    onChange={(e) => {
                                        setText(e.target.value)

                                    }} />
                            </div>
                            <div className="mt-2">
                                <AdminList />
                                <ServerRadio />
                            </div>
                        </div>
                    </div>
                    <div className=" col-span-2 basis-3/4 text-center ">
                        <Accordion type="single" collapsible className={`w-full ${display === true ? "block" : "hidden"}`}>
                            {players.map((bans, i) => (
                                <div key={i}>
                                    <BanCard
                                        id={bans.id}
                                        pname={bans.player_name}
                                        psid={bans.player_steamid}
                                        asid={bans.admin_steamid}
                                        aname={bans.admin_name}
                                        reason={bans.reason}
                                        duration={bans.duration}
                                        end={bans.ends}
                                        created={bans.created}
                                        serverid={bans.server_id}
                                        unbanid={bans.unban_id}
                                        status={bans.status}
                                    />
                                </div>
                            ))}
                        </Accordion>
                        <Accordion type="single" collapsible className={`w-full ${display === true ? "hidden" : "block"}`}>
                            {bans.map((bans, i) => (
                                <div key={i}>
                                    <BanCard
                                        id={bans.id}
                                        pname={bans.player_name}
                                        psid={bans.player_steamid}
                                        asid={bans.admin_steamid}
                                        aname={bans.admin_name}
                                        reason={bans.reason}
                                        duration={bans.duration}
                                        end={bans.ends}
                                        created={bans.created}
                                        serverid={bans.server_id}
                                        unbanid={bans.unban_id}
                                        status={bans.status}
                                    />
                                </div>
                            ))}
                        </Accordion>
                    </div>
                </div>

                <div className={`flex justify-center gap-8 mt-4 ${display === true ? "hidden" : "block"}`}>
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
                                className={`px-3 py-1 rounded ${Number(currentPage) === page ? 'bg-blue-500' : 'bg-neutral-800'}`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={nextPage}
                            className="px-4 py-2 bg-neutral-900 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={(currentPage * 10) >= allbans}
                        >
                            Next
                        </button>
                        <button
                            onClick={() => {
                                setCurrentPage(totalPages);
                                paramPage(totalPages);
                            }}
                            className="px-4 py-2 bg-neutral-900 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={(currentPage * 10) >= allbans}
                        >
                            Last
                        </button>
                    </div>
                </div>

            </main>

        </div>


    )
}