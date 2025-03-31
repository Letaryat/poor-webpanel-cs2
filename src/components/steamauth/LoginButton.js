'use client'
import { signIn, signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function SteamButtons() {
    const session = useSession();
    return (
        <div>
            {session.data != null ? (
                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger className='flex gap-2 justify-center items-center'>  
                            <Image className='rounded-full' src={`${session?.data?.user?.image}`} width={35} height={35} alt='profilepicture' unoptimized/> {session?.data?.user?.name}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Skins</DropdownMenuItem>
                            <DropdownMenuItem>Admin panel</DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem><button onClick={() => signOut()}>Logout</button></DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            ) : (
                <button onClick={() => signIn("steam")}>Login</button>
            )}


        </div>
    )
}