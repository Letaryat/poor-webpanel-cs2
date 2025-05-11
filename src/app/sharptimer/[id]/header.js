import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
export default function SharptimerPlayerHeader() {
    return (
        <div className="ProfileHeader relative rounded-md grid-cols-2 grid gap-2" style={{
            width: "100%",
        }}>
            <div className="flex items-center p-2">
                <Image className="rounded-full" src='/avatars/1.jpg' width={120} height={120} alt="pfp" unoptimized />
                <div className="flex flex-col ml-3">
                    <h1 className="font-bold text-2xl">Nickname</h1>
                    <p>Last online: kiedys</p>
                </div>
            </div>
            <div className="relative flex justify-center items-center">
                <div className="rounded-xl" style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(24, 25, 26, 0.52), rgba(0, 0, 0, 0.73)), url(https://images.steamusercontent.com/ugc/172668946117599393/E53B608C5302A3AD42F3C6B7C9CDF271EB9A734E/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false)`,
                    backgroundSize: 'cover',
                    backgroundPosition: "50% 50%",
                    width: "100%",
                    height: "100%",
                    opacity: "65%",
                    zIndex: "-1",
                    position: "absolute"
                }}>
                </div>
                <div className="flex flex-col items-center ">
                    <h2 className="text-lg font-bold uppercase">Favourite map</h2>
                    <h1 className="uppercase text-xl font-bold">SURF_KITSUNE</h1>
                </div>
            </div>
        </div>
    )
}