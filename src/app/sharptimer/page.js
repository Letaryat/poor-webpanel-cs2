import Image from "next/image"
import MainSharpTimer from "./main"
export default function SharpTimerPage() {
    return (
        <div className="flex justify-center">
            <main className="relative flex container gap-2 flex-col">
                <div className="rounded-md bg-red-50 w-full h-52 flex justify-center items-center relative">
                    <div className="rounded-md" style={
                    {
                        backgroundImage: `linear-gradient(to bottom, rgba(24, 25, 26, 0.52), rgba(0, 0, 0, 0.73)), url(/pictures/surf.png)`,
                        backgroundSize: 'cover',
                        backgroundPosition: "50% 20%",
                        width: "100%",
                        height:"100%",
                        opacity: "100%",
                        zIndex: "0",
                        position: "absolute"
                    }
                }>
                    </div>
                    <h1 className="font-bold text-3xl z-20">Sharptimer Statistics</h1>
                </div>
                <MainSharpTimer/>
            </main>
        </div>
    )
}