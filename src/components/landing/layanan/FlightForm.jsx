"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPin } from "lucide-react";
import RoomTravelerModal from "@/components/landing/layanan/RoomTravelerModal";

export default function FlightForm() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selection, setSelection] = useState({ traveler: 1 }); // bisa diubah sesuai kebutuhan modal

  const handleSave = (data) => {
    setSelection(data);
  };

  return (
    <div className="w-full py-40 px-4">
      <div className="space-y-4 bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6 text-center text-cyan-700">
          Tiket Penerbangan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            icon={<MapPin />}
            placeholder="From (e.g. MLG - Malang, Indonesia)"
          />
          <Input icon={<MapPin />} placeholder="To where?" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input type="date" icon={<CalendarIcon />} placeholder="Depart" />
          <Input type="date" icon={<CalendarIcon />} placeholder="Return" />
        </div>

        {/* Fake input untuk buka modal */}
        <div
          className="border rounded px-3 py-2 cursor-pointer text-gray-500"
          onClick={() => setModalOpen(true)}
        >
          {selection.traveler} Traveler{selection.traveler > 1 ? "s" : ""}
        </div>

        {/* Modal */}
        <RoomTravelerModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          defaultValue={selection}
          showRoom={false}
        />

        <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold">
          Search Flights
        </Button>
      </div>
    </div>
  );
}
