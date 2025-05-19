'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function AdminEditPunish({ banId, ogreason, usersid, type, ogEnd }) {
    const [reason, setReason] = useState("");
    const [ubreason, setUBReason] = useState("");
    const [date, setDate] = useState(null);
    const [status, setStatus] = useState("ACTIVE")
    const [isOpen, setIsOpen] = useState(false);
    const admins = JSON.parse(process.env.NEXT_PUBLIC_SIMPLEADMIN_ADMINS || "[]");

    const router = useRouter();

    if (!admins.includes(usersid)) return;
const handleSubmit = async () => {
    try {
        const formattedDate = date ? format(date, "yyyy-MM-dd HH:mm:ss") : ogEnd;
        const res = await fetch(`/api/simpleadmin/edit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                banId: banId,
                reason,
                end: formattedDate,
                status,
                type,
                ubreason
            }),
        });

        if (!res.ok) {
            throw new Error("Failed to update punishment");
        }

        window.location.reload();
    } catch (error) {
        console.error(error);
    }
};



    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const handleDateSelect = (selectedDate) => {
        if (selectedDate) {
            setDate(new Date(selectedDate));
        }
    };

    const handleTimeChange = (type, value) => {
        if (!(date instanceof Date)) return;
        const newDate = new Date(date);
        if (type === "hour") {
            newDate.setHours((parseInt(value) % 12) + (newDate.getHours() >= 12 ? 12 : 0));
        } else if (type === "minute") {
            newDate.setMinutes(parseInt(value));
        } else if (type === "ampm") {
            const currentHours = newDate.getHours();
            newDate.setHours(value === "PM" ? (currentHours % 12) + 12 : currentHours % 12);
        }
        setDate(newDate);
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Edit punishment</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit punishment</DialogTitle>
                        <DialogDescription>
                            Change ban
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-2">
                        <div>
                            <Label>
                                Reason:
                            </Label>
                            <Input type="text" placeholder="Reason" onChange={(e) => setReason(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <Label>
                                Ends:
                            </Label>
                            <Popover open={isOpen} onOpenChange={setIsOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "MM/dd/yyyy hh:mm aa") : <span>MM/DD/YYYY hh:mm aa</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <div className="sm:flex">
                                        <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
                                        <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                                            <ScrollArea className="w-64 sm:w-auto">
                                                <div className="flex sm:flex-col p-2">
                                                    {hours.reverse().map((hour) => (
                                                        <Button
                                                            key={hour}
                                                            size="icon"
                                                            variant={date instanceof Date && date.getHours() % 12 === hour % 12 ? "default" : "ghost"}
                                                            className="sm:w-full shrink-0 aspect-square"
                                                            onClick={() => handleTimeChange("hour", hour.toString())}
                                                        >
                                                            {hour}
                                                        </Button>
                                                    ))}
                                                </div>
                                                <ScrollBar orientation="horizontal" className="sm:hidden" />
                                            </ScrollArea>
                                            <ScrollArea className="w-64 sm:w-auto">
                                                <div className="flex sm:flex-col p-2">
                                                    {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                                                        <Button
                                                            key={minute}
                                                            size="icon"
                                                            variant={date instanceof Date && date.getMinutes() === minute ? "default" : "ghost"}
                                                            className="sm:w-full shrink-0 aspect-square"
                                                            onClick={() => handleTimeChange("minute", minute.toString())}
                                                        >
                                                            {minute}
                                                        </Button>
                                                    ))}
                                                </div>
                                                <ScrollBar orientation="horizontal" className="sm:hidden" />
                                            </ScrollArea>
                                            <ScrollArea>
                                                <div className="flex sm:flex-col p-2">
                                                    {["AM", "PM"].map((ampm) => (
                                                        <Button
                                                            key={ampm}
                                                            size="icon"
                                                            variant={
                                                                date instanceof Date &&
                                                                    ((ampm === "AM" && date.getHours() < 12) || (ampm === "PM" && date.getHours() >= 12))
                                                                    ? "default"
                                                                    : "ghost"
                                                            }
                                                            className="sm:w-full shrink-0 aspect-square"
                                                            onClick={() => handleTimeChange("ampm", ampm)}
                                                        >
                                                            {ampm}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div>
                            <Label>
                                Ban Status
                            </Label>
                            <RadioGroup className="grid grid-cols-3" defaultValue={status} onClick={(e) => setStatus(e.target.value)}>
                                <div className="bg-red-400 bg-opacity-20 text-xs font-base text-red-400 p-2 rounded-2xl flex justify-center gap-2 items-center">
                                    <RadioGroupItem value="ACTIVE" id="active" />
                                    <Label htmlFor="active">Active</Label>
                                </div>
                                <div className="bg-green-400 bg-opacity-20 text-xs font-base text-green-400 p-2 rounded-2xl flex justify-center gap-2 items-center">
                                    <RadioGroupItem value="EXPIRED" id="expired" />
                                    <Label htmlFor="expired">Expired</Label>
                                </div>
                                <div className="bg-blue-400 bg-opacity-20 text-xs font-base text-blue-400 p-2 rounded-2xl flex justify-center gap-2 items-center">
                                    <RadioGroupItem value={type === "bans" ? "UNBANNED" : "UNMUTED"} id="unbanned" />
                                    <Label htmlFor="unbanned">Unbanned</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {status === "UNBANNED" || status === "UNMUTED" ? (
                            <div className={`anim-fade`}>
                                <Label>
                                    Unban Reason
                                </Label>
                                <Input type="text" placeholder="Unban reason" onChange={(e) => setUBReason(e.target.value)} />
                            </div>
                        ) : ""}
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={handleSubmit}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}