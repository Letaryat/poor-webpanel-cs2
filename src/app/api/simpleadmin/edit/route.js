import { getServerSession } from "next-auth/next";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { formatDateToMySQL } from "@/app/sharptimer/[id]/playeroptions";

const admins = JSON.parse(process.env.NEXT_PUBLIC_SIMPLEADMIN_ADMINS || "[]");
export async function POST(req) {

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
        console.log(banId + " | " + reason + " | " + end + " | " + status + " | " + type + " | " + steamid + " | " + session + " | ") 
        const parsedEnd = new Date(end);

        let newEnd = formatDateToMySQL(end);

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
                UPDATE sa_bans SET sa_bans.reason = ${reason}, sa_bans.ends = ${newEnd}, sa_bans.status = ${status} WHERE id = ${banId};
                `;
            const existingUnban = await prisma.$queryRaw`
                SELECT id FROM sa_unbans WHERE ban_id = ${banId} LIMIT 1;
            `;

            if (existingUnban.length === 0) {
                test = await prisma.$queryRaw`
                    INSERT INTO sa_unbans (ban_id, admin_id, reason, date)
                    VALUES (${banId}, (SELECT id FROM sa_admins WHERE player_steamid = ${steamid} LIMIT 1), ${ubreason}, NOW());
                `;
            }
            }
            else{
                updateBan = await prisma.$queryRaw`
                UPDATE sa_bans SET sa_bans.reason = ${reason}, sa_bans.ends = ${newEnd}, sa_bans.status = ${status} WHERE id = ${banId}`;
            }
        }
        else if(type === "mutes")
        {
            if(status === "UNBANNED"){
                updateBan = await prisma.$queryRaw`
                UPDATE sa_mutes SET sa_mutes.reason = ${reason}, sa_mutes.ends = ${newEnd}, sa_mutes.status = ${status} WHERE id = ${banId};
                `;
            const existingUnmute = await prisma.$queryRaw`
                SELECT id FROM sa_unmutes WHERE mute_id = ${banId} LIMIT 1;
            `;

            if (existingUnmute.length === 0) {
                test = await prisma.$queryRaw`
                    INSERT INTO sa_unmutes (mute_id, admin_id, reason, date)
                    VALUES (${banId}, (SELECT id FROM sa_admins WHERE player_steamid = ${steamid} LIMIT 1), ${ubreason}, NOW());
                `;
            }

            }
            else{
                updateBan = await prisma.$queryRaw`
                UPDATE sa_mutes SET sa_mutes.reason = ${reason}, sa_mutes.ends = ${newEnd}, sa_mutes.status = ${status} WHERE id = ${banId}`;
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