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
import STPagination from "@/components/pagination";
import { server } from "typescript";

export default function BansPage() {
    const [loading, setLoading] = useState(true);
    const [bans, setBans] = useState([]);
    const [type, setType] = useState("bans");
    const [allbans, setAllBans] = useState(null);
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

    const paramType = (value) => {
        params.set("type", value);
        params.set('page', 1);
        setType(value);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const paramServer = (value) => {
        params.set("server", value);
        params.set('page', 1);
        setChosenServer(value);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
        if(usingSearch)
        {
            const paramsPage = Number(params.get("page")) || 1;
            const paramsType = params.get("type") || "bans";
            fetchBans(paramsPage, paramsType, value, "search");
            setDisplay(true);
        }
    };

    //Fetch:
    async function fetchBans(paramsPage, type, serverChoose, h,) {
        try {
            setLoading(true);
            //const response = await fetch(`/api/simpleadmin/bans?page=${paramsPage}&type=${type}`)
            const response = await fetch(`/api/simpleadmin/search?player=${text}&type=${type}&admin=${adminsChoose}&server=${serverChoose}&page=${paramsPage}`)
            const data = await response.json();
            if (h === "search") {
                setPlayers(data.players || [])
            }
            else {
                setAllBans(data.total)
                setBans(data.players || []);
            }

            setLoading(false);
        }
        catch (error) {
            console.log(error);
        }
    }

    //Fetching data
    useEffect(() => {
        console.log("test");
        const paramsPage = Number(params.get("page")) || 1;
        const paramsServer = Number(params.get("server")) || -1;
        const paramsType = params.get("type") || "bans";
        if (usingSearch) { return; }
        fetchBans(paramsPage, paramsType, paramsServer)

    }, [searchParams, type, adminsChoose])

    //Fetching Servers
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

    //Search
    useEffect(() => {

        const paramsPage = Number(params.get("page")) || 1;
        const paramsServer = Number(params.get("server")) || -1;
        const paramsType = params.get("type") || "bans";

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
            fetchBans(paramsPage, paramsType,paramsServer, "search");
            setDisplay(true);
        }, 500)

        setDebounceTimeout(timeout);
        return () => clearTimeout;

    }, [text]);


    return (
        <div className="flex justify-center">
            <main className="relative flex container gap-2 flex-col">
                <div className="flex flex-col md:flex-row relative gap-2">
                    <div className="basis-1/4 ">
                        <div className="sticky top-2">
                            <div className="grid grid-cols-2 gap-2 justify-center items-center">
                                <Button variant="secondary" className={`${type === "bans" ? "bg-blue-500" : ""}`} onClick={(e) => {
                                    paramType("bans");
                                }}>Bans</Button>
                                <Button variant="secondary" className={`${type === "mutes" ? "bg-blue-500" : ""}`} onClick={(e) => {
                                    paramType("mutes");
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
                                        paramServer(value);
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

                {usingSearch ? "" : (
                    <STPagination
                        totaldata={allbans}
                    />
                )

                }



            </main>

        </div>


    )
}