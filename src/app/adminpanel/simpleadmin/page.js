import Satabs from "./tabs"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
export default function SimpleAdminPanel() {
    return (
        <div className="flex justify-center">

            <main className="relative flex container gap-2 flex-col">
                <div>
                    <Link href={'/adminpanel'} className={buttonVariants({ variant: "outline" })}>Back</Link>
                </div>
                <Satabs />
            </main>
        </div>
    )
}