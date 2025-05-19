"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input"
import IconInput from "@/app/(customer)/landing/IconInput"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import RoomTravelerModal from "@/app/(customer)/landing/layanan/RoomTravelerModal"
import { MapPin } from "lucide-react"

export default function HotelForm() {
    const [departureDate, setDepartureDate] = useState(new Date());
    const [returnDate, setReturnDate] = useState(null);

    const [activeTab] = useState("travelHotel");

    const [modalOpen, setModalOpen] = useState(false)
    const [selection, setSelection] = useState({ room: 1, traveler: 1 })

    const handleSave = (data) => {
        setSelection(data)
    }
    return (
        <section
            id="intro"
            className="w-full py-40 relative flex items-center justify-center"
        >
            <div className="space-y-4 bg-white p-6 rounded-xl shadow">
                <IconInput icon={<MapPin />} placeholder="Lokasi, Kota atau Tempat" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full text-left">
                                {departureDate
                                    ? format(departureDate, "dd-MM-Y")
                                    : "Check-in"}
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
                                    : "Check-out"}
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

                <div className="space-y-4">
                    {/* Input fake untuk membuka modal */}
                    {(activeTab === "travelHotel") && (
                        <div
                            className="border rounded px-3 py-2 cursor-pointer"
                            onClick={() => setModalOpen(true)}
                        >
                            {selection.room} Room, {selection.traveler} Travelers
                        </div>
                    )}
                    <RoomTravelerModal
                        isOpen={modalOpen}
                        onClose={() => setModalOpen(false)}
                        onSave={handleSave}
                        defaultValue={selection}
                    />
                </div>
                <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold">Search Hotels</Button>
            </div>
        </section>
    )
}
