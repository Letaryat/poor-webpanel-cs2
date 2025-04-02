'use client'
import { useSession } from "next-auth/react";
import { CircleX, UserPen } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import AdminEditPunish from "./editpunish";

export default function AdminPanelAcord({ banId, reason, type}) {
    const admins = JSON.parse(process.env.NEXT_PUBLIC_SIMPLEADMIN_ADMINS || "[]");
    const session = useSession();
    if (!session.data) return;
    if (!admins.includes(session.data.user.steamid)) return;
    return (
        <div className="flex justify-center items-center flex-col">
        <h3>Admin Panel</h3>
        <div className="flex gap-2 items-center">
            <AdminEditPunish banId={banId} usersid={session.data.user.steamid} ogreason={reason} type={type}/>
        </div>
        </div>

    )
}