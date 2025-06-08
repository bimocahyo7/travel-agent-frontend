import { Dialog } from "@headlessui/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function RoomTravelerModal({ isOpen, onClose, onSave, defaultValue, showRoom = true, }) {
    const [room, setRoom] = useState(defaultValue.room || 1)
    const [traveler, setTraveler] = useState(defaultValue.traveler || 1)

    const handleSave = () => {
        const data = { traveler }
        if (showRoom) data.room = room
        onSave(data)
        onClose()
    }

    const increment = (type) => {
        if (type === "room" && room < 4) setRoom(room + 1)
        if (type === "traveler" && traveler < 4) setTraveler(traveler + 1)
    }

    const decrement = (type) => {
        if (type === "room" && room > 1) setRoom(room - 1)
        if (type === "traveler" && traveler > 1) setTraveler(traveler - 1)
    }

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white p-6 rounded-lg w-full max-w-sm space-y-4 shadow">
                    <Dialog.Title className="text-lg font-semibold">Room & Traveler</Dialog.Title>

                    {showRoom && (
                        <div className="flex justify-between items-center">
                            <span>Room</span>
                            <div className="flex items-center gap-2">
                                <Button size="sm" onClick={() => decrement("room")}>-</Button>
                                <span>{room}</span>
                                <Button size="sm" onClick={() => increment("room")}>+</Button>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center">
                        <span>Traveler</span>
                        <div className="flex items-center gap-2">
                            <Button size="sm" onClick={() => decrement("traveler")}>-</Button>
                            <span>{traveler}</span>
                            <Button size="sm" onClick={() => increment("traveler")}>+</Button>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSave}>Save</Button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    )
}
