import { submitAdmin } from "../actions/addadmin"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button, buttonVariants } from "@/components/ui/button"
export default function AddAdmin() {
    return (
        <div className="border rounded-md p-2">
            <form action={submitAdmin} className="w-[350px] mt-2">
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="steamid">SteamID64</Label>
                        <Input id="steamid" name="steamid" placeholder="765" required/>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" placeholder="Kowalsky" type="text"  required />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="permission">Flags / groups</Label>
                        <Input id="permission" name="permission" placeholder="@css/admin | #css/admin" type="text"  required />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="immunity">Immunity</Label>
                        <Input id="immunity" name="immunity" placeholder="0-100" type="number" min="0" max="100"  required />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="duration">Duration</Label>
                        <Input id="duration" name="duration" placeholder="0" type="number" required />
                    </div>
                    <div className="flex items-center gap-2 ">
                        <Checkbox id="allservers" name="allservers" />
                        <Label htmlFor="allservers"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Grant permissions for all servers?
                        </Label>
                    </div>
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </div>

    )
}