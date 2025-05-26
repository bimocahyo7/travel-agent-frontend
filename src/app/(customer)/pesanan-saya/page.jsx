"use client";

import { useState } from "react";
import { useBooking } from "@/hooks/booking";
import { useBookingdes } from "@/hooks/bookingdes";

export default function PesananSayaPage() {
    const [activeTab, setActiveTab] = useState("package");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    const { bookings, loading: loadingPackage } = useBooking();
    const { bookingdes, loading: loadingDestination } = useBookingdes();

    // Handler untuk payment
    const handlePayment = (type, bookingId) => {
        alert(`Fitur payment untuk booking ${type} dengan ID ${bookingId} belum tersedia.`);
    };

    // Filter dan pagination untuk package
    const filteredBookings = (bookings || []).filter(
        (booking) =>
            booking.package?.name?.toLowerCase().includes(search.toLowerCase()) ||
            booking.status?.toLowerCase().includes(search.toLowerCase())
    );
    const totalPagesPackage = Math.ceil(filteredBookings.length / itemsPerPage);
    const paginatedBookings = filteredBookings.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    // Filter dan pagination untuk destination
    const filteredBookingdes = (bookingdes || []).filter(
        (booking) =>
            booking.destination?.name?.toLowerCase().includes(search.toLowerCase()) ||
            booking.status?.toLowerCase().includes(search.toLowerCase())
    );
    const totalPagesDestination = Math.ceil(filteredBookingdes.length / itemsPerPage);
    const paginatedBookingdes = filteredBookingdes.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    // Reset page ke 1 jika tab atau search berubah
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setPage(1);
    };
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6 text-center">Pesanan Saya</h1>
            <div className="flex justify-center mb-6">
                <button
                    className={`px-4 py-2 rounded-l-full border ${activeTab === "package" ? "bg-cyan-700 text-white" : "bg-gray-100 text-gray-700"}`}
                    onClick={() => handleTabChange("package")}
                >
                    Booking Package
                </button>
                <button
                    className={`px-4 py-2 rounded-r-full border ${activeTab === "destination" ? "bg-cyan-700 text-white" : "bg-gray-100 text-gray-700"}`}
                    onClick={() => handleTabChange("destination")}
                >
                    Booking Destination
                </button>
            </div>

            <div className="mb-4 flex justify-end">
                <input
                    type="text"
                    placeholder="Cari nama atau status..."
                    value={search}
                    onChange={handleSearchChange}
                    className="border px-3 py-2 rounded w-64"
                />
            </div>

            {activeTab === "package" && (
                <div>
                    <h2 className="text-lg font-semibold mb-2">Daftar Booking Package</h2>
                    {loadingPackage ? (
                        <p>Loading...</p>
                    ) : paginatedBookings.length > 0 ? (
                        <>
                            <ul className="space-y-4">
                                {paginatedBookings.map((booking) => (
                                    <li key={booking.id} className="p-4 border rounded shadow">
                                        <div>Paket: <b>{booking.package?.name}</b></div>
                                        <div>Tanggal: {booking.booking_date}</div>
                                        <div>Status: <span className="capitalize">{booking.status}</span></div>
                                        <div>Total: Rp {Number(booking.total_price).toLocaleString()}</div>
                                        {booking.status === "confirmed" && (
                                            <button
                                                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                                onClick={() => handlePayment("package", booking.id)}
                                            >
                                                Payment
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            {/* Pagination */}
                            <div className="flex justify-center items-center gap-2 mt-6">
                                <button
                                    className="px-3 py-1 border rounded disabled:opacity-50"
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                >
                                    Prev
                                </button>
                                <span>
                                    Page {page} of {totalPagesPackage}
                                </span>
                                <button
                                    className="px-3 py-1 border rounded disabled:opacity-50"
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === totalPagesPackage || totalPagesPackage === 0}
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    ) : (
                        <p>Tidak ada booking package.</p>
                    )}
                </div>
            )}

            {activeTab === "destination" && (
                <div>
                    <h2 className="text-lg font-semibold mb-2">Daftar Booking Destination</h2>
                    {loadingDestination ? (
                        <p>Loading...</p>
                    ) : paginatedBookingdes.length > 0 ? (
                        <>
                            <ul className="space-y-4">
                                {paginatedBookingdes.map((booking) => (
                                    <li key={booking.id} className="p-4 border rounded shadow">
                                        <div>Destinasi: <b>{booking.destination?.name}</b></div>
                                        <div>Kendaraan: {booking.vehicle?.name}</div>
                                        <div>Tanggal: {booking.booking_date}</div>
                                        <div>Penumpang: {booking.jumlah_penumpang}</div>
                                        <div>Status: <span className="capitalize">{booking.status}</span></div>
                                        <div>Total: Rp {Number(booking.total_price).toLocaleString()}</div>
                                        {booking.status === "confirmed" && (
                                            <button
                                                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                                onClick={() => handlePayment("destination", booking.id)}
                                            >
                                                Payment
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            {/* Pagination */}
                            <div className="flex justify-center items-center gap-2 mt-6">
                                <button
                                    className="px-3 py-1 border rounded disabled:opacity-50"
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                >
                                    Prev
                                </button>
                                <span>
                                    Page {page} of {totalPagesDestination}
                                </span>
                                <button
                                    className="px-3 py-1 border rounded disabled:opacity-50"
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === totalPagesDestination || totalPagesDestination === 0}
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    ) : (
                        <p>Tidak ada booking destination.</p>
                    )}
                </div>
            )}
        </div>
    );
}