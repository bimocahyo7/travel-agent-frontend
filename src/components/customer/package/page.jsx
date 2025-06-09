"use client";

import { useState } from "react";
import { useBooking } from "@/hooks/booking";

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.getFullYear().toString() +
           (date.getMonth() + 1).toString().padStart(2, '0') +
           date.getDate().toString().padStart(2, '0') +
           date.getHours().toString().padStart(2, '0') +
           date.getMinutes().toString().padStart(2, '0');
};

export default function BookingPackagePage() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;
    const [showInvoice, setShowInvoice] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const { bookings, loading } = useBooking();

    // Filter dan pagination
    const filteredBookings = (bookings || []).filter(
        (booking) =>
            booking.package?.name?.toLowerCase().includes(search.toLowerCase()) ||
            booking.status?.toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const paginatedBookings = filteredBookings.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    // Handler untuk payment
    const handlePayment = (bookingId) => {
        alert(`Fitur payment untuk booking package dengan ID ${bookingId} belum tersedia.`);
    };

    // Handler untuk menampilkan invoice
    const handleShowInvoice = (booking) => {
        setSelectedBooking(booking);
        setShowInvoice(true);
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Daftar Booking Package</h1>

            <div className="mb-6 flex justify-end">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Cari package atau status..."
                        value={search}
                        onChange={e => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="border-2 border-gray-200 px-4 py-2 rounded-lg w-72 focus:outline-none focus:border-blue-500 shadow-sm"
                    />
                    <svg className="w-5 h-5 absolute right-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : paginatedBookings.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {paginatedBookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-2 border-gray-200">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">{booking.package?.name}</h3>
                                            <p className="text-sm text-gray-600 mt-1">Pemesan: {booking.user?.name}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize
                                            ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800 border border-green-300' : 
                                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : 
                                              'bg-gray-100 text-gray-800 border border-gray-300'}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <div className="space-y-2 text-gray-600">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>{booking.booking_date}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <span>{Math.floor(booking.jumlah_penumpang)} Penumpang</span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Rp {Number(booking.total_price).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    {booking.status === "confirmed" && (
                                        <button
                                            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                            onClick={() => handleShowInvoice(booking)}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Lihat Invoice
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <button
                            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                        >
                            ← Previous
                        </button>
                        <span className="text-gray-600">
                            Halaman {page} dari {totalPages}
                        </span>
                        <button
                            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                            onClick={() => setPage(page + 1)}
                            disabled={page === totalPages || totalPages === 0}
                        >
                            Next →
                        </button>
                    </div>
                </>
            ) : (
                <div className="text-center py-12 text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="mt-4 text-lg">Tidak ada booking package.</p>
                </div>
            )}

            {showInvoice && selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-8 rounded-lg max-w-2xl w-full shadow-xl relative overflow-hidden">
                        {/* Add Watermark with border and right angle */}
                        {selectedBooking.status === "confirmed" && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-6xl font-bold select-none" 
                                     style={{ 
                                         fontSize: '120px',
                                         color: 'rgba(134, 239, 172, 0.15)',
                                         transform: 'rotate(-45deg) translateY(-50%)',
                                         position: 'absolute',
                                         top: '50%',
                                         width: '100%',
                                         textAlign: 'center',
                                         WebkitTextStroke: '2px rgba(134, 239, 172, 0.3)',
                                         letterSpacing: '10px'
                                     }}>
                                    LUNAS
                                </div>
                            </div>
                        )}
                        
                        {/* Header */}
                        <div className="flex justify-between items-start mb-8 relative">
                            <div>
                                <h1 className="text-2xl font-bold text-blue-600">TRAVELNESIA</h1>
                                <p className="text-sm text-gray-500">Your Trusted Travel Partner</p>
                                <p className="text-sm text-gray-500">Email: info@travelnesia.com</p>
                                <p className="text-sm text-gray-500">Phone: (021) 1234-5678</p>
                            </div>
                            <div className="text-right">
                                <h2 className="text-xl font-semibold text-gray-800">INVOICE</h2>
                                <p className="text-sm text-gray-500">
                                    INV/{formatDate(selectedBooking.booking_date)}/{selectedBooking.id}
                                </p>
                                <p className="text-sm text-gray-500">Date: {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="mb-6">
                            <h3 className="text-gray-600 font-semibold mb-2">Customer Details:</h3>
                            <p className="font-medium text-gray-800">{selectedBooking.user?.name}</p>
                        </div>

                        {/* Booking Details */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <h3 className="text-gray-600 font-semibold mb-4">Booking Details:</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Package</p>
                                    <p className="font-semibold text-gray-800">{selectedBooking.package?.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Date</p>
                                    <p className="font-semibold text-gray-800">{selectedBooking.booking_date}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Passengers</p>
                                    <p className="font-semibold text-gray-800">{Math.floor(selectedBooking.jumlah_penumpang)} person(s)</p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-blue-50 p-4 rounded-lg mb-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-600">Payment Status</p>
                                    <p className="font-semibold text-green-600 capitalize">{selectedBooking.status}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Amount</p>
                                    <p className="text-xl font-bold text-blue-600">
                                        Rp {Number(selectedBooking.total_price).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center text-sm text-gray-500 mb-6">
                            <p>Thank you for choosing Travelnesia</p>
                        </div>

                        <button
                            className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4"
                            onClick={() => {
                                setShowInvoice(false);
                                setSelectedBooking(null);
                            }}
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}