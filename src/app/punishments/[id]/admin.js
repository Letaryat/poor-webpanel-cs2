'use client'
import { useEffect, useState } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function IfAdmin({ sid }) {
    const [test, setTest] = useState([]);
    const [flag, setFlag] = useState(null);
    useEffect(() => {
        async function adminFetch() {
            try {
                const response = await fetch(`/api/simpleadmin/systeminfo`);
                const data = await response.json();
                const admin = data.admins.find(admin => admin.player_steamid === sid);

                setTest(admin);
                setFlag(admin.Flag)

            }
            catch (error) {
                console.log(error);
            }
        }
        adminFetch();
    }, [sid])

    console.log(flag);
    /*
                    {test ? "jestem" : "nie ma"}
                
                {test?.Flag?.split("/")[1]} | {test.BANS} | {test.MUTES}
    */
    if (test === undefined || test === null) {
        return;
    }
    return (
        <div className="flex justify-center items-center flex-col mt-[-10px]">
            <div className=" border border-zinc-700 uppercase p-1 pl-4 pr-4 bg-secondary rounded-lg flex items-center justify-center mb-1">
                {test?.Flag?.split("/")[1]}
            </div>
            <div className="grid grid-cols-2 gap-1">
                <div className=" p-1 pl-4 pr-4 bg-secondary rounded-lg flex justify-center text-center">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>{test.BANS}</TooltipTrigger>
                            <TooltipContent>
                                <p>Gave bans</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <div className="p-1 pl-4 pr-4 bg-secondary rounded-lg flex justify-center text-center">
                <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>{test.MUTES}</TooltipTrigger>
                            <TooltipContent>
                                <p>Gave mutes</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </div>
    )
}