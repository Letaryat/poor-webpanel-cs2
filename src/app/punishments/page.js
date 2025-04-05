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
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Skeleton } from "@/components/ui/skeleton";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";

export default function BansPage() {
    const [loading, setLoading] = useState(true);
    const [bans, setBans] = useState([]);
    const [type, setType] = useState("bans");
    const [allbans, setAllBans] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [text, setText] = useState("");
    const [players, setPlayers] = useState([]);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [display, setDisplay] = useState(false);
    const [usingSearch, setUsingSearch] = useState(false);

    const [admins, setAdmins] = useState([]);
    const [serversSA, setServersSA] = useState([]);

    const [adminsChoose, setChosenAdmin] = useState("-1");
    const [serverChoose, setChosenServer] = useState("-1");

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const playersPerPage = 20;

    const params = new URLSearchParams(searchParams.toString());


    useEffect(() => {
        const paramsPage = Number(params.get("page")) || 1;
        setCurrentPage(paramsPage);
        if (usingSearch) { return; }
        async function fetchBans(page) {
            try {
                setLoading(true);
                const response = await fetch(`/api/simpleadmin/bans?page=${page}&type=${type}`)
                const data = await response.json();
                setAllBans(data.total)
                setBans(data.bans || []);
                setLoading(false);
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchBans(paramsPage)

    }, [type, searchParams])

    useEffect(() => {
        async function fetchServerInfo() {
            try {
                setLoading(true);
                const response = await fetch(`/api/simpleadmin/systeminfo/`);
                const data = await response.json();
                setAdmins(data.admins)
                setServersSA(data.servers);
                setLoading(false);
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchServerInfo();
    }, [])

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

    const paramServer = (value, type1) => {
        setLoading(true);
        params.set('page', value);
        params.set("type", type1);
        setType(type1);
        setText("");
        setChosenAdmin("-1");
        setChosenServer("-1");
        router.push(`${pathname}?${params.toString()}`);
        setLoading(false);
    };

    const totalPages = Math.ceil(allbans / 10) || 1;
    const startPage = Math.max(1, Math.min(currentPage - 3, totalPages - 6));
    const endPage = Math.min(totalPages, startPage + 6);
    const pagesToShow = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    useEffect(() => {
        if (text === "" && adminsChoose == "-1" && serverChoose == "-1") {
            setPlayers([]);
            setDisplay(false);
            setUsingSearch(false);
            return;
        }
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
        const timeout = setTimeout(() => {
            params.set("page", 1);
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
            setUsingSearch(true);
            fetchPlayers();
            setDisplay(true);
        }, 0)

        setDebounceTimeout(timeout);
        return () => clearTimeout;

    }, [text, adminsChoose, serverChoose, currentPage]);

    const fetchPlayers = async () => {
        const paramsPage = Number(params.get("page")) || 1;
        try {
            setAllBans(null);
            setLoading(true);
            const response = await fetch(`/api/simpleadmin/search?player=${text}&type=${type}&admin=${adminsChoose}&server=${serverChoose}&page=${paramsPage}`);
            const data = await response.json();
            if (data.players === "Brak") {
                setPlayers([]);
            }
            else {
                setPlayers(data.players || []);
                setAllBans(data.total);
            }
            setLoading(false);
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex justify-center">
            <main className="relative flex container gap-2 flex-col">
                <div className="flex relative gap-2">
                    <div className="basis-1/4 ">
                        <div className="sticky top-2">
                            <div className="grid grid-cols-2 gap-2 justify-center items-center">
                                <Button variant="secondary" className={`${type === "bans" ? "bg-blue-500" : ""}`} onClick={(e) => {
                                    setChosenServer(1)
                                    paramServer(1, "bans");
                                }}>Bans</Button>
                                <Button variant="secondary" className={`${type === "mutes" ? "bg-blue-500" : ""}`} onClick={(e) => {
                                    setChosenServer(1)
                                    paramServer(1, "mutes");
                                    console.log(currentPage);
                                }}>Mutes</Button>
                            </div>
                            <div>
                                <Input
                                    className="mt-2"
                                    placeholder="Search via Nickname or SteamID64"
                                    value={text}
                                    onChange={(e) => {
                                        setText(e.target.value)
                                    }} />
                            </div>
                            <div className="mt-2">
                                <div className="p-1 w-[100%] rounded-md bg-secondary mb-2 text-center">
                                    <h3 className="text-base ">Admin</h3>
                                </div>
                                <Select defaultValue={adminsChoose} onValueChange={(value) => {
                                    setChosenAdmin(value);
                                }}>
                                    <SelectTrigger className="w-[100%]">
                                        <SelectValue placeholder="Admins" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="-1">None</SelectItem>
                                        {admins.map((a, i) => (
                                            <SelectItem key={i} value={a.player_steamid}>{a.player_name} </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <div className="p-1 w-[100%] rounded-md bg-secondary mb-2 text-center mt-2">
                                    <h3 className="text-base font-semibold">Server</h3>
                                </div>

                                <div className="mt-2 mb-2 grid gap-1">
                                    <RadioGroup className="gap-1" value={serverChoose} onValueChange={(value) => {
                                        setChosenServer(value);
                                    }}>
                                        <div className="flex items-center space-x-1 p-3 border rounded-md bg-zinc-900">
                                            <RadioGroupItem value="-1" id="any" />
                                            <Label htmlFor="any">Any</Label>
                                        </div>
                                        {serversSA.map((s, i) => (
                                            <div key={i} className="flex items-center space-x-1 p-3 border rounded-md bg-zinc-900">
                                                <RadioGroupItem value={s.id} id={`server-${s.id}`} />
                                                <Label htmlFor={`server-${s.id}`}>{s.hostname}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=" col-span-2 basis-3/4 text-center ">
                        {loading ? (
                            <div className="flex justify-center ">
                                <main className="flex flex-col container text-center">
                                    {[...Array(playersPerPage)].map((_, i) => (
                                        <Skeleton key={i} className="grid grid-cols-4 p-2 border border-neutral-800 mb-2 h-[58px]" />
                                    ))}
                                </main>
                            </div>
                        ) : (
                            <div>
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
                                                end={bans.ends ? new Date(bans.ends).toLocaleString() : "Unknown"}
                                                created={bans.created ? new Date(bans.created).toLocaleString() : "Unknown"}
                                                serverid={bans.server_id}
                                                unbanid={bans.unban_id}
                                                status={bans.status}
                                                ubreason={bans.reasonub}
                                                aubsid={bans.adminUB}
                                                aubname={bans.adminnameUB}
                                                type={type}
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
                                                end={bans.ends ? new Date(bans.ends).toLocaleString() : "Unknown"}
                                                created={bans.created ? new Date(bans.created).toLocaleString() : "Unknown"}
                                                serverid={bans.server_id}
                                                unbanid={bans.unban_id}
                                                status={bans.status}
                                                ubreason={bans.reasonub}
                                                aubsid={bans.adminUB}
                                                aubname={bans.adminnameUB}
                                                type={type}
                                            />
                                        </div>
                                    ))}
                                </Accordion>
                            </div>
                        )}

                    </div>
                </div>

                <div className={`flex justify-center gap-8 mt-4 `}>
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