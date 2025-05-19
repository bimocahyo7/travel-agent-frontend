"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import IconInput from "@/components/landing/IconInput"
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import RoomTravelerModal from "@/components/layanan/RoomTravelerModal"
import { format } from "date-fns";
import { MapPin } from "lucide-react"

export default function PackageForm() {
    const [isAvailable, setIsAvailable] = useState(false);
    const [searchResultModalOpen, setSearchResultModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        origin: "",
        destination: "",
        passengerCount: 1,
    });


    const [departureDate, setDepartureDate] = useState(new Date());
    const [returnDate, setReturnDate] = useState(null);
    const [activeTab, setActiveTab] = useState("travelHotel");

    const [modalOpen, setModalOpen] = useState(false)
    const [selection, setSelection] = useState({ room: 1, traveler: 1 })

    const handleSave = (data) => {
        setSelection(data)
    }

    const router = useRouter();

    const handleOrderNow = () => {
        router.push("/login");
    };

    return (
        <section
            id="intro"
            className="w-full py-10 px-4"
        >
            <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center text-cyan-700">
                    Pilih Paket Tiket Perjalanan
                </h2>

                {/* Tabs */}
                <div className="flex justify-center gap-2 mb-6">
                    <button
                        className={`px-4 py-2 rounded ${activeTab === "travelHotel"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200"
                            }`}
                        onClick={() => setActiveTab("travelHotel")}
                    >
                        Travel + Hotel
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${activeTab === "travelCar"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200"
                            }`}
                        onClick={() => setActiveTab("travelCar")}
                    >
                        Travel + Car
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${activeTab === "hotelCar"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200"
                            }`}
                        onClick={() => setActiveTab("hotelCar")}
                    >
                        Hotel + Car
                    </button>
                </div>

                {/* Form */}
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.target;
                        const data = {
                            origin: form.origin.value,
                            destination: form.destination.value,
                            passengerCount: form.passenger_count.value,
                            departureDate: departureDate,
                            returnDate: returnDate,
                            room: selection.room,
                            traveler: selection.traveler,
                            type: activeTab,
                        };
                        setFormData(data);

                        // Simulasi pengecekan tiket tersedia (random true/false)
                        const available = Math.random() > 0.3; // 70% kemungkinan tersedia
                        setIsAvailable(available);

                        setSearchResultModalOpen(true);
                    }}
                >
                    <IconInput icon={<MapPin />} placeholder="Kota Asal" name="origin" />
                    <IconInput icon={<MapPin />} placeholder="Kota Tujuan" name="destination" />

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full text-left">
                                {departureDate
                                    ? format(departureDate, "dd-MM-Y")
                                    : "Pilih Tanggal Berangkat"}
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

                    {/* Tanggal pulang hanya ditampilkan jika tab-nya "travelHotel" atau "travelCar" */}
                    {(activeTab === "travelHotel" || activeTab === "travelCar") && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full text-left">
                                    {returnDate
                                        ? format(returnDate, "dd-MM-Y")
                                        : "Pilih Tanggal Pulang (opsional)"}
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
                    )}

                    <Input
                        placeholder="Jumlah Penumpang"
                        type="number"
                        min="1"
                        name="passenger_count"
                    />
                    <div className="space-y-4">
                        {/* Input fake untuk membuka modal */}
                        {(activeTab === "travelHotel" || activeTab === "hotelCar") && (
                            <div
                                className="border rounded px-3 py-2 cursor-pointer"
                                onClick={() => setModalOpen(true)}
                            >
                                {selection.room} Room, {selection.traveler} Travelers
                            </div>
                        )}
                        {(activeTab === "travelCar") && (
                            <div
                                className="border rounded px-3 py-2 cursor-pointer"
                                onClick={() => setModalOpen(true)}
                            >
                                {selection.traveler} Traveler
                            </div>
                        )}

                        <RoomTravelerModal
                            isOpen={modalOpen}
                            onClose={() => setModalOpen(false)}
                            onSave={handleSave}
                            defaultValue={selection}
                            showRoom={activeTab !== "travelCar"} // <--- hanya tampil jika bukan travelCar
                        />
                    </div>
                    {searchResultModalOpen && (
                        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
                            <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-lg relative">
                                <h3 className="text-lg font-bold text-cyan-700 mb-4">Ringkasan Pencarian</h3>
                                <ul className="space-y-2 text-sm">
                                    <li><strong>Kota Asal:</strong> {formData.origin}</li>
                                    <li><strong>Kota Tujuan:</strong> {formData.destination}</li>
                                    <li><strong>Tanggal Berangkat:</strong> {format(formData.departureDate, "dd-MM-yyyy")}</li>
                                    {formData.returnDate && (
                                        <li><strong>Tanggal Pulang:</strong> {format(formData.returnDate, "dd-MM-yyyy")}</li>
                                    )}
                                    <li><strong>Jumlah Penumpang:</strong> {formData.passengerCount}</li>
                                    {(formData.type !== "travelCar") && <li><strong>Room:</strong> {formData.room}</li>}
                                    <li><strong>Traveler:</strong> {formData.traveler}</li>
                                    <li><strong>Paket:</strong> {formData.type}</li>
                                </ul>

                                <div className="mt-4 space-y-4">
                                    {isAvailable ? (
                                        <>
                                            <p className="text-green-600 font-semibold">✅ Tiket tersedia!</p>
                                            <Button
                                                onClick={handleOrderNow}
                                                className="w-full bg-emerald-600 hover:bg-emerald-500"
                                            >
                                                Pesan Sekarang
                                            </Button>

                                        </>
                                    ) : (
                                        <p className="text-red-600 font-semibold">❌ Tiket tidak ditemukan</p>
                                    )}
                                </div>

                                <button
                                    className="absolute top-2 right-3 text-gray-500 hover:text-red-500"
                                    onClick={() => setSearchResultModalOpen(false)}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="md:col-span-2">
                        <Button
                            type="submit"
                            className="w-full bg-cyan-700 hover:bg-cyan-600"
                        >
                            Cari Tiket
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    );
}
