"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input"
import IconInput from "@/app/(customer)/landing/IconInput"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { MapPin } from "lucide-react"

export default function CarForm() {
    const [departureDate, setDepartureDate] = useState(new Date());
    const [returnDate, setReturnDate] = useState(null);
    return (
        <section
            id="intro"
            className="w-full py-40 relative flex items-center justify-center"
        >
            <div className="space-y-4 bg-white p-6 rounded-xl shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <IconInput icon={<MapPin />} placeholder="Pick-up Location" />
                    <IconInput icon={<MapPin />} placeholder="Drop-off Location" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full text-left">
                                {departureDate
                                    ? format(departureDate, "dd-MM-Y")
                                    : "Pick-up Date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <Calendar
                                mode="single"
                                selected={departureDate}
                                onSelect={setDepartureDate}
                            />
                        </PopoverContent>
                    </Popover>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full text-left">
                                {returnDate
                                    ? format(returnDate, "dd-MM-Y")
                                    : "Drop-off Date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <Calendar
                                mode="single"
                                selected={returnDate}
                                onSelect={setReturnDate}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold">Search Cars</Button>
            </div>
        </section>
    )
}
