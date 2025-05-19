import Cards from "./cards"
import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"
export default function AdminPanel() {
    return (
        <div className="flex justify-center">
            <main className="relative flex container gap-2 flex-col">
                <div className="flex gap-2">
                    <Link href={'adminpanel/simpleadmin'} className={buttonVariants({ variant: "outline" })}>Simpleadmin panel</Link>
                    <Link href={'adminpanel/simpleadmin'} className={buttonVariants({ variant: "outline" })}>Blog</Link>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <Cards name={"Total Servers"} value={"5"} desc1={"Servers"} desc2={"test2"} />
                    <Cards name={"Total Bans"} value={"1200"} desc1={"Servers"} desc2={"test2"} />
                    <Cards name={"Total Mutes"} value={"700"} desc1={"Servers"} desc2={"test2"} />
                    <Cards name={"Total Players"} value={"1000"} desc1={"Servers"} desc2={"test2"} />
                </div>
            </main>
        </div>
    )
}