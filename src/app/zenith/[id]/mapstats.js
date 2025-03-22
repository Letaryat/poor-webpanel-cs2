import { PrismaClient } from "@prisma/client";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const databases = JSON.parse(process.env.ZENITH_DATABASE || "{}");
export async function FavMap({ id, sid }) {
    const prisma = new PrismaClient({
        datasources: {
            db: { url: databases[sid["server"]]["url"] }
        }
    })
    const mapStats = await prisma.zenith_map_stats.findMany({
        where: {
            steam_id: id,
        },
        orderBy: {
            rounds_overall: "desc",
        },
    });

    prisma.$disconnect();

    if (!mapStats || mapStats.length === 0) {
        return <div>No data</div>;
    }
    return (
        <div className="col-span-2 row-span-2 col-start-4 row-start-3 relative overflow-hidden border border-neutral-800 bg-neutral-900 rounded-md">
        <div className="ProfileBackgroundImage rounded-md"
            style={{
                backgroundImage: `linear-gradient(to bottom, rgba(24, 25, 26, 0.52), rgba(0, 0, 0, 0.73)), url(https://rank.pierdolnik.eu/storage/cache/img/maps/730/${mapStats[0].map_name}.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: "50% 50%",
                width: "100%",
                height: "100%",
                opacity: "50%",
                zIndex: "0",
                position: "absolute"
            }}
        ></div>
        <div className="z-10 relative mt-2 mb-2">
            <h4 className="text-sm font-medium uppercase  text-center ">Favourite player map</h4>
            <h2 className="text-xl font-bold uppercase  text-center ">{mapStats[0].map_name}</h2>
            <ul className="ml-2 mr-2 PlayerMapStats">
                <li className="border-b p-1">
                    <div className="flex gap-2">
                        <h4 className="font-semibold">MVP:</h4>
                        <p>{mapStats[0].mvp}</p>
                    </div>
                </li>
                <li className="border-b p-1">
                    <div className="flex gap-2">
                        <h4 className="font-semibold">Games won:</h4>
                        <p>{mapStats[0].game_win}</p>
                    </div>
                </li>
                <li className="border-b p-1">
                    <div className="flex gap-2">
                        <h4 className="font-semibold">Games lost:</h4>
                        <p>{mapStats[0].game_lose}</p>
                    </div>
                </li>
                <li className="border-b p-1">
                    <div className="flex gap-2">
                        <h4 className="font-semibold">Rounds:</h4>
                        <p>{mapStats[0].rounds_overall}</p>
                    </div>
                </li>
                <li className="border-b p-1">
                    <div className="flex gap-2">
                        <h4 className="font-semibold">Rounds won:</h4>
                        <p>{mapStats[0].round_win}</p>
                    </div>
                </li>
                <li className="border-b p-1">
                    <div className="flex gap-2">
                        <h4 className="font-semibold">Rounds Lost:</h4>
                        <p>{mapStats[0].round_lose}</p>
                    </div>
                </li>
            </ul>
        </div>

    </div>
    )
}


export async function MapStats({ id, sid }) {
    const prisma = new PrismaClient({
        datasources: {
            db: { url: databases[sid["server"]]["url"] }
        }
    })
    const mapStats = await prisma.zenith_map_stats.findMany({
        where: {
            steam_id: id,
        },
        orderBy: {
            rounds_overall: "desc",
        },
    });

    prisma.$disconnect();

    if (!mapStats || mapStats.length === 0) {
        return <div>No data</div>;
    }
    return(
        <div className="col-span-2 col-start-4 row-start-5 row-span-2 relative overflow-auto border border-neutral-800 bg-neutral-900 p-2 rounded-md">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead >Map name</TableHead>
                    <TableHead >MVP</TableHead>
                    <TableHead>Rounds won</TableHead>
                    <TableHead>Round lost</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {mapStats.map((map) => (
                    <TableRow className="rounded-md p-2" key={map.map_name} style={{
                                        backgroundImage: `linear-gradient(to bottom, rgba(24, 25, 26, 0.52), rgba(0, 0, 0, 0.73)), linear-gradient(to top, rgba(24, 25, 26, 0.52), rgba(0, 0, 0, 0.73)), url(https://rank.pierdolnik.eu/storage/cache/img/maps/730/${map.map_name}.jpg)`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: "50% 50%",
                                        width: "100%",
                                        height: "100%",
                                        borderRadius: "100px",

                    }}>
                        <TableCell className="font-semibold">{map.map_name}</TableCell>
                        <TableCell>{map.mvp}</TableCell>
                        <TableCell>{map.round_win}</TableCell>
                        <TableCell>{map.round_lose}</TableCell>
                    </TableRow>
                ))}

            </TableBody>
        </Table>

    </div>
    )
}