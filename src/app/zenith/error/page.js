import { AlertCircle, ArrowRight, ArrowLeft } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"

export default function NoPlayerError() {
    return (
        <div className="flex justify-center">
            <main className="container flex justify-center flex-col">
                <div className="flex gap-2 justify-center items-center">
                    <AlertCircle className="text-red-500" size={64} />
                    <div>
                        <h1 className="text-3xl">Player not found!</h1>

                    </div>
                </div>
                <div className="flex gap-2 justify-center items-center mt-4">
                    <Button >

                        <Link className="flex items-center" href="/zenith">
                        <ArrowLeft />
                        Back to the ranking</Link>
                    </Button>
                    <Button >
                        <Link className="flex items-center" href="/">
                            Back to the main page</Link>
                        <ArrowRight />
                    </Button>

                </div>

            </main>
        </div>
    )
}