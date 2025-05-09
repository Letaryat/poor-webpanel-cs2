import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
export default function MainSharpTimer() {
    return (
        <div className="flex w-full gap-2">

            <div className=" rounded-md w-[500px]">
                <h3 className="text-lg font-semibold">Options</h3>
                <div className="grid grid-cols-3 gap-2 justify-between mb-2">
                    <Button variant="secondary">Surf</Button>
                    <Button variant="secondary">KZ</Button>
                    <Button variant="secondary">BHOP</Button>
                </div>

                <Select>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Map" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">Surf_kitsune</SelectItem>
                        <SelectItem value="dark">Surf_utopia</SelectItem>
                        <SelectItem value="system">Surf_nowasupermapamoja</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="bg-green-500 rounded-md w-full">
                Rows
            </div>
        </div>
    )
}