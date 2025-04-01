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
        const {banId, reason} = await req.json();
        console.log(banId + " | " + reason)
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
        const updateBan = await prisma.$queryRaw`
        UPDATE sa_bans SET sa_bans.reason = ${reason} WHERE id = ${banId}
        `;
        return NextResponse.json(updateBan, {status: 200});
    }
    catch (error) {
        console.log(error)
    }
}