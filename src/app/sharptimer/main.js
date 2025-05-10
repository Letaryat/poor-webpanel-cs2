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

export default function MainSharpTimer() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [type, setType] = useState("global");
    const [totaldata, setTotalData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [map, setMap] = useState("%");
    const [maps, setMaps] = useState([]);

    const [text, setText] = useState("");
    const [players, setPlayers] = useState("");
    const [serach, setUsingSearch] = useState(false);
    const [display, setDisplay] = useState(false);
    const [debounceTimeout, setDebounceTimeout] = useState(null);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const playersPerPage = 20;

    const params = new URLSearchParams(searchParams.toString());

    useEffect(() => {
        const paramsPage = parseInt(params.get("page")) || 1;
        setCurrentPage(paramsPage)
        async function fetchPlayersData(page, map) {
            try {
                setLoading(true);
                const response = await fetch(`/api/sharptimer/records?map=${map}`);
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
            }
            catch (error) {
                console.log("Error fetching maps!");
            }
        }
        fetchMaps(type);
    }, [type])

    async function fetchPlayerRecords() {
        try {
            setData([]);
            setLoading(true);
            const response = await fetch(`/api/sharptimer/records?type=${type}&player=${text}`)
            const data = await response.json();
            setData(data.data);
            setLoading(false);
        }
        catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (text === "") {
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
            fetchPlayerRecords();
            setDisplay(true);
        }, 500)

        setDebounceTimeout(timeout);
        return () => clearTimeout;

    }, [text]);

    return (
        <div className="flex w-full gap-2">
            <div className=" rounded-md w-[500px]">
                <h3 className="text-lg font-semibold">Options</h3>
                <div className="grid grid-cols-3  grid-rows-2 gap-2 justify-between mb-2">
                    <Button className="col-span-3" variant="secondary" onClick={() => {
                        setType("global");
                        setText("");
                    }}>Global</Button>
                    <Button onClick={() => {
                        setType("surf");
                        setText("");
                    }}
                        variant="secondary">Surf</Button>
                    <Button onClick={() => {
                        setType("kz");
                        setText("");
                    }} variant="secondary">KZ</Button>
                    <Button onClick={() => {
                        setType("bhop");
                        setText("");
                    }} variant="secondary">BHOP</Button>
                </div>

                <Select value={map} onValueChange={(e) => setMap(e)}>
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
                {loading == true || data.length < 0 ? (
                    <div>
                        Loading!
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
                            <PlayerRow
                                key={i}
                                sid={p.SteamID}
                                name={p.PlayerName}
                                time={p.FormattedTime}
                                style={p.Style}
                                timesfinished={p.TimesFinished}
                                mapname={p.MapName}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}