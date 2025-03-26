import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// type: ban / mute / warn (depending on the page)
// admin: what admin UwU

export function AdminList({ type, admin }) {
    return (
        <Select>
            <SelectTrigger className="w-[100%]">
                <SelectValue placeholder="Admins" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
            </SelectContent>
        </Select>
    )
}

export default function ServerRadio({ type, admin }) {
    return (
        <div className="mt-2 mb-2 grid gap-1">
            <RadioGroup className="gap-1" defaultValue="option-one">
                <div className="flex items-center space-x-1 p-3 border rounded-sm">
                    <RadioGroupItem value="option-one" id="option-one" />
                    <Label htmlFor="option-one">Server 1 </Label>
                </div>
                <div className="flex items-center space-x-1 p-3 border rounded-sm">
                    <RadioGroupItem value="option-2" id="option-2" />
                    <Label htmlFor="option-2">Server 2 </Label>
                </div>
                <div className="flex items-center space-x-1 p-3 border rounded-sm">
                    <RadioGroupItem value="option-3" id="option-3" />
                    <Label htmlFor="option-3">Server 3 </Label>
                </div>
            </RadioGroup>
        </div>


    )
}