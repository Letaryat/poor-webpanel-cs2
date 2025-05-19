import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import FetchSteamPlayerInfo from "@/app/api/steamprofile/route";
import {SharpTimerPlayerOptions, GetFavMap} from "./playeroptions";
import { UnixToTime } from "@/lib/playerfunctions";
import Image from "next/image"
export default async function SharptimerPlayerHeader({id}) {
    let playerData;
    let playerOptions;
    let favMap;
    try{
        playerData = await FetchSteamPlayerInfo(id);
        playerOptions = await SharpTimerPlayerOptions(id);
        favMap = await GetFavMap(id);
        console.log(favMap);
    }
    catch(error)
    {
        console.log(error);
    }
    
    return (
        <div className="ProfileHeader relative rounded-md lg:grid lg:grid-cols-2  gap-2" style={{
            width: "100%",
        }}>
            <div className="flex items-center p-2">
                <Image className="rounded-full" src={playerData.avatarfull} width={120} height={120} alt="pfp" unoptimized />
                <div className="flex flex-col ml-3">
                    <h1 className="font-bold text-2xl">{playerData.personaname}</h1>
                    <p>{UnixToTime(playerOptions[0].LastConnected)}</p>
                    <p>{playerOptions[0].GlobalPoints} points</p>
                </div>
            </div>
            <div className="relative flex justify-center items-center">
                <div className="rounded-xl" style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(24, 25, 26, 0.52), rgba(0, 0, 0, 0.73)), url(https://raw.githubusercontent.com/Letaryat/poor-sharptimermappics/refs/heads/main/pics/${favMap[0].MapName}.jpg)`,
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
                    <h2 className="text-md font-bold uppercase">Favourite map</h2>
                    <h1 className="text-xl font-bold uppercase">{favMap[0].MapName}</h1>
                    <p>Finished: {favMap[0].TimesFinished} times</p>
                    <p>{favMap[0].FormattedTime}</p>
                </div>
            </div>
        </div>
    )
}