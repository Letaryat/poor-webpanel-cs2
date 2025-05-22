'use client'
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
export default function SaAdmins() {
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        async function getAdmins() {
            try {
                const response = await fetch(`/api/simpleadmin/systeminfo`);
                const data = await response.json();
                setAdmins(data.admins);
            }
            catch (exception) {
                console.log(exception);
            }
        }
        getAdmins();
    }, [])

    console.log(admins);
    return (
        <div className="ml-4 flex flex-col w-[100%] relative">
            <li className="grid grid-cols-5">
                <span>Admin Name</span>
                <span>Permissions</span>
                <span>Bans</span>
                <span>Mutes</span>
                <span>Options</span>
            </li>
            <div className="relative block h-[720px] overflow-auto">
                {admins.map((admin, key) => (
                    <li className="grid grid-cols-5 mt-2 bg-zinc-900 p-2 rounded-lg justify-center items-center" key={key}>
                        <span>
                            <Link href={`https://steamcommunity.com/profiles/${admin.player_steamid}`} className="flex items-center gap-2 hover:text-blue-400">
                                <Avatar >
                                    <AvatarImage src={`/api/avatar/ifexist/${admin.player_steamid}`} />
                                    <AvatarFallback>{admin.player_name}</AvatarFallback>
                                </Avatar>
                                {admin.player_name}
                            </Link>

                        </span>
                        <span>{admin.flag ? admin.flag : "null"}</span>
                        <span>{admin.BANS} </span>
                        <span>{admin.MUTES}</span>
                        <div className="flex gap-2">
                            <Button>Delete</Button>
                            <Button>Edit</Button>
                        </div>
                    </li>
                ))}
                
            </div>


        </div>
    )
}