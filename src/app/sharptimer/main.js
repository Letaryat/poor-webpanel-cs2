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
export default function MainSharpTimer() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [type, setType] = useState("global");
    const [totaldata, setTotalData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [map, setMap] = useState("%");
    const [maps, setMaps] = useState([]);

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
        async function fetchMaps(type)
        {
            try{
                const response = await fetch(`/api/sharptimer/maps?type=${type}`);
                const data = await response.json();
                setMaps(data.data);
                setMap(data.data[0].MapName);
            }
            catch(error)
            {
                console.log("Error fetching maps!");
            }
        }
        fetchMaps(type);
    }, [type])

    return (
        <div className="flex w-full gap-2">
            <div className=" rounded-md w-[500px]">
                <h3 className="text-lg font-semibold">Options</h3>
                <div className="grid grid-cols-3  grid-rows-2 gap-2 justify-between mb-2">
                    <Button className="col-span-3" variant="secondary" onClick={() => {
                        setType("global");
                    }}>Global</Button>
                    <Button onClick={() => {
                        setType("surf");
                    }}
                        variant="secondary">Surf</Button>
                    <Button onClick={() => {
                        setType("kz");
                    }} variant="secondary">KZ</Button>
                    <Button onClick={() => {
                        setType("bhop");
                    }} variant="secondary">BHOP</Button>
                </div>

                <Select value={map} onValueChange={(e) => setMap(e)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                        {maps.length < 0 ? (
                            <div>Loading maps!</div>
                        ) : (
                            maps.map((m,i) => (
                                <SelectItem key={i} value={m.MapName}>{m.MapName}</SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>
            </div>
            <div className="rounded-md w-full">
                {loading == true || data.length < 0 ? (
                    <div>
                        Loading!
                    </div>
                ) : (
                    <div>
                        <div className="grid grid-cols-4 p-2 border mb-1 rounded-md font-bold text-center">
                            <div className="">Name</div>
                            <div>Time</div>
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
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}