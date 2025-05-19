import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
export default function AddAdmin() {
    return (
        <div className="flex justify-center ">
            <form className="w-[350px] mt-2">
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">SteamID64</Label>
                        <Input id="name" placeholder="Name of your project" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Name of your project" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">Flags / groups</Label>
                        <Input id="name" placeholder="@css/admin | #css/admin" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">Immunity</Label>
                        <Input id="name" placeholder="0-100" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">Duration</Label>
                        <Input id="name" placeholder="0" />
                    </div>
                    <div className="flex items-center gap-2 ">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Grant permissions for all servers?
                        </Label>
                    </div>
                </div>
            </form>
        </div>

    )
}