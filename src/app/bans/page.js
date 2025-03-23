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
export default function BansPage() {
    const [bans, setBans] = useState([]);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const params = new URLSearchParams(searchParams.toString());

    useEffect(() => {
        async function fetchBans(page) {
            try {
                const response = await fetch(`/api/simpleadmin/bans?page=${page}`)
                const data = await response.json();
                setBans(data.bans || []);
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchBans(1)
    }, [searchParams])



    return (
        <div className="flex justify-center">
            <main className="relative flex container gap-2">
                <div className="basis-1/4 p-2">
                    <div>
                        <h2 className="font-semibold text-base">Search using name or SteamID64</h2>
                        <Input/>
                    </div>

                </div>
                <div className=" col-span-2 basis-3/4 text-center ">
                    <Accordion type="single" collapsible className="w-full ">
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
                                end={bans.ends}
                                created={bans.created}
                                serverid={bans.server_id}
                                unbanid={bans.unban_id}
                                status={bans.status}
                                />
                            </div>
                        ))}
                    </Accordion>
                </div>
            </main>
        </div>


    )
}