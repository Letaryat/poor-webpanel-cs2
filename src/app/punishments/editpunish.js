'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button"
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export default function AdminEditPunish({ banId, ogreason, usersid }) {
    const [reason, setReason] = useState("");
    const [date, setDate] = useState(Date);
    const admins = JSON.parse(process.env.NEXT_PUBLIC_SIMPLEADMIN_ADMINS || "[]");
    if (!admins.includes(usersid)) return;
    const handleSubmit = async () => {
        try {
            const res = await fetch(`/api/simpleadmin/edit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    banId: banId,
                    reason,
                }),
            });
            if (!res.ok) {
                throw new Error("Failed to update punishment");
            }
        }
        catch (error) {
            console.log(error);
        }
    }
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
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={
                                            ("w-[280px] justify-start text-left font-normal",
                                            !date && "text-muted-foreground")}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={handleSubmit}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}