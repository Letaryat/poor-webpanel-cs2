'use client'
import { useState } from "react";
import { submitAdmin } from "../actions/addadmin"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button, buttonVariants } from "@/components/ui/button"
import { ShowSaServers } from "../data/showservers"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const CSSGroups =
    [
        "@css/reservation",
        "@css/generic",
        "@css/kick",
        "@css/ban",
        "@css/unban",
        "@css/vip",
        "@css/slay",
        "@css/changemap",
        "@css/cvar",
        "@css/config",
        "@css/chat",
        "@css/vote",
        "@css/password",
        "@css/rcon",
        "@css/cheats",
        "@css/root"
    ]



export default function AddGroup() {
    const [servers, setServers] = useState([]);

    return (
        <div className="border rounded-md p-2">
            <ShowSaServers onLoaded={setServers} />
            <form className="w-[350px] mt-2">
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">Group name</Label>
                        <Input id="name" name="name" placeholder="Kowalsky" type="text" required />
                    </div>
                    <div>
                        <Label>Permissions</Label>
                        <div className="grid grid-cols-2 gap-1">
                            {CSSGroups.map((group, key) => (
                                <div key={key} className="flex justify-between mb-1 bg-zinc-900 p-2 rounded-lg">
                                    <Label htmlFor={group}>{group}</Label>
                                    <Checkbox id={group} name={group} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <RadioGroup>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="all" id="all" />
                                <Label htmlFor="all">All servers</Label>
                            </div>
                            {servers.map(server => (
                                <div key={server.id} className="flex items-center space-x-2">
                                    <RadioGroupItem value={server.id} id={server.id} />
                                    <Label htmlFor={server.id}>{server.hostname}</Label>
                                </div>
                            ))}
                        </RadioGroup>

                    </div>

                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </div>
    )
}