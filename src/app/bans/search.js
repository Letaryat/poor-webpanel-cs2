import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"

export default function PunishSearch() {
    const [text, setText] = useState("");
    const [players, setPlayers] = useState([]);
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
        <Input
            value={text}
            onChange={(e) => {
                setText(e.target.value)
            }} />
    )
}