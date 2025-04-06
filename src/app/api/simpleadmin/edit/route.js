import { getServerSession } from "next-auth/next";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const admins = JSON.parse(process.env.NEXT_PUBLIC_SIMPLEADMIN_ADMINS || "[]");
export async function POST(req) {
    // Pobierz sesję zalogowanego użytkownika
    const session = await getServerSession(auth);
    const steamid = session?.user?.email.split("@")[0];
    if (!session || !steamid) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!admins.includes(steamid)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    try {
        const {banId, reason, end, status, type, ubreason} = await req.json();
        var newEnd = new Date(end).toLocaleString();

        console.log(banId + " | " + reason + " | " + newEnd + " | " + status + " | " + type + " | " + steamid + " | " + session) 
        if(!banId)
        {
            return NextResponse.json({ error: "Missing data"}, {status: 400});
        }
        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: process.env.SIMPLEADMIN_DATABASE
                },
            },
        });

        var updateBan;
        var test;
        if(type === "bans")
        {
            if(status === "UNBANNED"){
                updateBan = await prisma.$queryRaw`
                UPDATE sa_bans SET sa_bans.reason = ${reason}, sa_bans.ends = ${end}, sa_bans.status = ${status} WHERE id = ${banId};
                `;
                test = await prisma.$queryRaw`
                INSERT INTO sa_unbans (ban_id, admin_id, reason, date) VALUES (${banId}, (SELECT id FROM sa_admins WHERE player_steamid = ${steamid} LIMIT 1), ${ubreason}, NOW());
                `

            }
            else{
                updateBan = await prisma.$queryRaw`
                UPDATE sa_bans SET sa_bans.reason = ${reason}, sa_bans.ends = ${end}, sa_bans.status = ${status} WHERE id = ${banId}`;
            }
        }
        else if(type === "mutes")
        {
            if(status === "UNBANNED"){
                updateBan = await prisma.$queryRaw`
                UPDATE sa_mutes SET sa_mutes.reason = ${reason}, sa_mutes.ends = ${end}, sa_mutes.status = ${status} WHERE id = ${banId};
                `;
                test = await prisma.$queryRaw`
                INSERT INTO sa_unmutes (mute_id, admin_id, reason, date) VALUES (${banId}, (SELECT id FROM sa_admins WHERE player_steamid = ${steamid} LIMIT 1), ${ubreason}, NOW());
                `

            }
            else{
                updateBan = await prisma.$queryRaw`
                UPDATE sa_mutes SET sa_mutes.reason = ${reason}, sa_mutes.ends = ${end}, sa_mutes.status = ${status} WHERE id = ${banId}`;
            }
        }
        //const updateBan = await prisma.$queryRaw`
        //UPDATE sa_bans SET sa_bans.reason = ${reason}, sa_bans.ends = ${end}, sa_bans.status = ${status} WHERE id = ${banId}
        //`;
        return NextResponse.json({updateBan, test}, {status: 200});
    }
    catch (error) {
        console.log(error)
    }
}