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
                <button className='p-1 pl-2 pr-2 bg-blue-500 rounded-md bg-opacity-30 border hover:bg-opacity-100 transition-all ease-in-out' onClick={() => signIn("steam")}>Login via steam</button>
            )}


        </div>
    )
}