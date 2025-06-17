"use client";

import { useState } from "react";
import { useBookingdes } from "@/hooks/bookingdes";

export default function BookingDestinationPage() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    const { bookingdes, loading } = useBookingdes();

    // Filter dan pagination
    const filteredBookingdes = (bookingdes || []).filter(
        (booking) =>
            booking.destination?.name?.toLowerCase().includes(search.toLowerCase()) ||
            booking.status?.toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.ceil(filteredBookingdes.length / itemsPerPage);
    const paginatedBookingdes = filteredBookingdes.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    // Handler untuk payment
    const handlePayment = (bookingId) => {
        alert(`Fitur payment untuk booking destination dengan ID ${bookingId} belum tersedia.`);
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6 text-center">Daftar Booking Destination</h1>

            <div className="mb-4 flex justify-end">
                <input
                    type="text"
                    placeholder="Cari nama atau status..."
                    value={search}
                    onChange={e => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="border px-3 py-2 rounded w-64"
                />
            </div>

            {loading ? (
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
                                        onClick={() => handlePayment(booking.id)}
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
                            Page {page} of {totalPages}
                        </span>
                        <button
                            className="px-3 py-1 border rounded disabled:opacity-50"
                            onClick={() => setPage(page + 1)}
                            disabled={page === totalPages || totalPages === 0}
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <p>Tidak ada booking destination.</p>
            )}
        </div>
    );
}