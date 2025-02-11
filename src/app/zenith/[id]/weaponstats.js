import { PrismaClient } from "@prisma/client";
import Image from "next/image";
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

export async function WeaponFavStats({ id, sid }) {
    const prisma = new PrismaClient({
        datasources: {
            db: { url: databases[sid["server"]]["url"] }
        }
    })
    
    const weaponStats = await prisma.zenith_weapon_stats.findMany({
        where: {
            steam_id: id,
        },
        orderBy: {
            kills: "desc",
        },
    });
    prisma.$disconnect();

    if (!weaponStats || weaponStats.length === 0) {
        return (
            <div className="col-span-3 row-span-2 col-start-1 row-start-2 relative overflow-hidden border border-neutral-800 bg-neutral-900 p-2 rounded-md flex flex-col justify-center items-center">
                <h2 className="font-normal text-xl mb-2">Favourite weapon</h2>
                <div>No data.</div>
            </div>
        );
    }
    return (
        <div className="col-span-3 row-span-2 col-start-1 row-start-2 relative overflow-hidden border border-neutral-800 bg-neutral-900 p-2 rounded-md flex flex-col justify-center items-center">
            <h2 className="font-normal text-xl mb-2">Favourite weapon</h2>
            <div className="grid grid-cols-2 justify-center items-center gap-4">
                <div className="flex flex-col justify-center items-center">
                    <h3 className="font-semibold text-2xl uppercase">{weaponStats[0].weapon}</h3>
                    <Image className="rounded-xl" src={"/weapons/ak47.webp"} width={200} height={200} alt="pfp" />
                </div>
                <div>
                    <ul>
                        <li>Kills: {weaponStats[0].kills}</li>
                        <li>Shots: {weaponStats[0].shots}</li>
                        <li>HS: {weaponStats[0].headshots}</li>
                        <li>Chest:{weaponStats[0].chest_hits}</li>
                        <li>Stomach: {weaponStats[0].stomach_hits}</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export async function WeaponStats({ id, sid}) {

    const prisma = new PrismaClient({
        datasources: {
            db: { url: databases[sid["server"]]["url"] }
        }
    })
    
    const weaponStats = await prisma.zenith_weapon_stats.findMany({
        where: {
            steam_id: id,
        },
        orderBy: {
            kills: "desc",
        },
    });

    prisma.$disconnect();
    if (!weaponStats || weaponStats.length === 0) {
        return (
            <div className="flex flex-col col-span-3 row-span-3 col-start-1 row-start-4 relative overflow-auto border border-neutral-800 bg-neutral-900 p-2 rounded-md justify-center items-center">
                                <h2 className="font-normal text-xl mb-2">Weapon statistics</h2>
                                <div>No data.</div>
            </div>
        );
    }

    return (
        <div className="col-span-3 row-span-3 col-start-1 row-start-4 relative overflow-auto border border-neutral-800 bg-neutral-900 p-2 rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[200px] ">Weapon</TableHead>
                        <TableHead>Shots</TableHead>
                        <TableHead>Hits</TableHead>
                        <TableHead>Accuracy</TableHead>
                        <TableHead >Headshots</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {weaponStats.map((i) => (
                        <TableRow key={i.weapon}>
                            <TableCell className="w-[200px] font-bold uppercase">
                                {i.weapon}
                            </TableCell>
                            <TableCell>
                                {i.shots}
                            </TableCell>
                            <TableCell>
                                {i.hits}
                            </TableCell>
                            <TableCell>
                                {Math.round((i.hits / i.shots) * 100)}
                            </TableCell>
                            <TableCell>
                                {i.headshots}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </div>
    )
}