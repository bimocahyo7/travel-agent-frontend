import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MapPin } from "lucide-react"

export default function FlightForm() {
    return (
        <div className="w-full py-40 px-4">
            <div className="space-y-4 bg-white p-6 rounded-xl shadow">
                <h2 className="text-2xl font-bold mb-6 text-center text-cyan-700">
                    Tiket Penerbangan
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input icon={<MapPin />} placeholder="From (e.g. MLG - Malang, Indonesia)" />
                    <Input icon={<MapPin />} placeholder="To where?" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input type="date" icon={<CalendarIcon />} placeholder="Depart" />
                    <Input type="date" icon={<CalendarIcon />} placeholder="Return" />
                </div>
                <Input placeholder="1 Traveler / Coach" />
                <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold">Search Flights</Button>
            </div>
        </div>
    )
}
