import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
export default function PlayerSearch( { serverid } ) {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [players, setPlayers] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); 
    const [debounceTimeout, setDebounceTimeout] = useState(null); 

    useEffect(() => {
        if (text === "") {
            setPlayers([]);
            return;
        }

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const timeout = setTimeout(() => {
            fetchPlayers();
        }, 500); 

        setDebounceTimeout(timeout);

        return () => clearTimeout(timeout);
    }, [text]);

    const fetchPlayers = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch(`/api/searchplayer?player=${text}&server=${serverid}`);
            const data = await response.json();
            if (data.players === "Brak graczy") {
                setPlayers([]);
            } else {
                setPlayers(data.players || []);
                console.log("Server ID:", serverid);
            }
        } catch (error) {
            console.log(`${error}`);
            setError("Blad");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger> <div className="bg-blue-500 flex justify-center items-center max-h-[36px] p-2 rounded-md"> <Search style={{translateX: "180deg"}}/> Search</div> </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Search for a player using nickname or steamid64</DialogTitle>
                        <DialogDescription>
                            <Input
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </DialogDescription>
                    </DialogHeader>
                    <div className="h-[150px] overflow-auto">
                        {loading && <div>Loading</div>}
                        {error && <div>Error</div>}
                        {players.map((player) => (
                            <Link key={player.steam_id} href={`/zenith/${player.steam_id}?server=${serverid}`} className="flex border border-neutral-900 p-2 rounded-md mb-1 gap-2 items-center">
                                <Avatar>
                                    <AvatarImage src={player.avatar === "null" ? "" : player.avatar} />
                                    <AvatarFallback>{player.name}</AvatarFallback>
                                </Avatar>
                                {player.name}
                            </Link>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}