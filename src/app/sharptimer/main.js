'use client'
import { useEffect, useState } from "react"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { PlayerRow } from "./playerrow"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import STPagination from "./pagination"
import { Skeleton } from "@/components/ui/skeleton";

export default function MainSharpTimer() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [dataSearch, setDataSearch] = useState([]);
    const [type, setType] = useState("global");
    const [totaldata, setTotalData] = useState(null);
    //const [currentPage, setCurrentPage] = useState(1);
    const [map, setMap] = useState("%");
    const [maps, setMaps] = useState([]);
    const [mapExist, setMapExist] = useState({});
    //Search:
    const [text, setText] = useState("");
    const [serach, setUsingSearch] = useState(false);
    const [display, setDisplay] = useState(false);
    const [debounceTimeout, setDebounceTimeout] = useState(null);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const playersPerPage = 10;

    const params = new URLSearchParams(searchParams.toString());

    //Fetching data:
    useEffect(() => {
        const paramsPage = parseInt(params.get("page")) || 1;
        //setCurrentPage(paramsPage)
        async function fetchPlayersData(page, map) {
            try {
                setLoading(true);
                const response = await fetch(`/api/sharptimer/records?map=${map}&page=${paramsPage}`);
                const data = await response.json();
                setData(data.data);
                setTotalData(data.total);
                setLoading(false);
            } catch (error) {
                console.log(`Error fetching players data: ${error}`);
                setLoading(false);
            }
        }
        fetchPlayersData(paramsPage, map);
        console.log(map);
    }, [searchParams, map]);

    useEffect(() => {
        async function fetchMaps(type) {
            try {
                const response = await fetch(`/api/sharptimer/maps?type=${type}`);
                const data = await response.json();
                setMaps(data.data);
                setMap(data.data[0].MapName);
                setMapExist({
                    surf: data.surf,
                    bhop: data.bhop,
                    kz: data.kz,
                    other: data.other,
                })
            }
            catch (error) {
                console.log("Error fetching maps!");
            }
        }
        fetchMaps(type);
    }, [type])

    //Searchbar:

    async function fetchPlayerRecords() {
        try {
            setLoading(true);
            const response = await fetch(`/api/sharptimer/records?type=${type}&player=${text}`)
            const data = await response.json();
            setDataSearch(data.data);
            setLoading(false);
        }
        catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (text === "") {
            setDataSearch([]);
            setDisplay(false);
            setUsingSearch(false);
            return;
        }
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
        const timeout = setTimeout(() => {
            restartPage();
            setUsingSearch(true);
            fetchPlayerRecords();
            setDisplay(true);
        }, 500)

        setDebounceTimeout(timeout);
        return () => clearTimeout;

    }, [text]);

    const restartPage = () => {
        params.set("page", 1);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }

    const changeType = (type) => {
        setType(type);
        setText("");
        restartPage();
    }


    return (
        <div className="flex w-full gap-2">
            <div className=" rounded-md w-[500px] max-w-[500px]">
                <div className="grid grid-cols-3  grid-rows-2 gap-2 justify-between mb-2">
                    <Button className={`col-span-3 ${type === "global" ? "bg-blue-500" : ""}`} variant="secondary" onClick={() => {
                        changeType("global");
                    }}>Global</Button>
                    {
                        mapExist.surf ? (
                            <Button className={`${type === "surf" ? "bg-blue-500" : ""}`} onClick={() => {
                                changeType("surf");
                            }}
                                variant="secondary">Surf</Button>
                        ) : ""
                    }
                    {
                        mapExist.bhop ? (
                            <Button className={`${type === "bhop" ? "bg-blue-500" : ""}`} onClick={() => {
                                changeType("bhop");
                            }}
                                variant="secondary">Bhop</Button>
                        ) : ""
                    }
                    {
                        mapExist.kz ? (
                            <Button className={`${type === "kz" ? "bg-blue-500" : ""}`} onClick={() => {
                                changeType("kz");
                            }}
                                variant="secondary">Kz</Button>
                        ) : ""
                    }

                </div>

                <Select value={map} onValueChange={(e) => {
                    setMap(e);
                    restartPage();
                }}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="%">Any</SelectItem>
                        {maps.length < 0 ? (
                            <div>Loading maps!</div>
                        ) : (
                            maps.map((m, i) => (
                                <SelectItem key={i} value={m.MapName}>{m.MapName}</SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>

                <Input
                    className="mt-2"
                    placeholder="Search via Nickname or SteamID64"
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value)
                    }} />
            </div>
            <div className="rounded-md w-full">
                {loading == true ? (
                    <div>
                        <div className="flex justify-center ">
                            <main className="flex flex-col container text-center">
                                {[...Array(playersPerPage)].map((_, i) => (
                                    <Skeleton key={i} className="grid grid-cols-4 p-2 border border-neutral-800 mb-2 h-[58px]" />
                                ))}
                            </main>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="grid grid-cols-5 p-2 border mb-1 rounded-md font-bold text-center">
                            <div className="">Name</div>
                            <div>Time</div>
                            <div>Map</div>
                            <div>Style</div>
                            <div>Times finished</div>
                        </div>
                        {data.map((p, i) => (
                            <div key={i} className={`w-full ${display === true ? "hidden" : "block"}`}>
                                <PlayerRow
                                    key={i}
                                    sid={p.SteamID}
                                    name={p.PlayerName}
                                    time={p.FormattedTime}
                                    style={p.Style}
                                    timesfinished={p.TimesFinished}
                                    mapname={p.MapName}
                                />
                            </div>

                        ))}
                        {dataSearch.map((p, i) => (
                            <div key={i}>
                                <PlayerRow className={`w-full ${display === true ? "hidden" : "block"}`}
                                    key={i}
                                    sid={p.SteamID}
                                    name={p.PlayerName}
                                    time={p.FormattedTime}
                                    style={p.Style}
                                    timesfinished={p.TimesFinished}
                                    mapname={p.MapName}
                                />
                            </div>
                        ))}
                    </div>
                )}
                <STPagination
                    totaldata={totaldata}
                />
            </div>
        </div>
    )
}