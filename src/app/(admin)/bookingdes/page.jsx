"use client";

import { useEffect } from "react";
import Header from "@/app/(admin)/Header";
import { useBookingdes } from "@/hooks/bookingdes";

export default function AdminBookingPage() {
  const { bookingdes, loading, error, success, updateBookingdes, clearMessages } = useBookingdes();
  const statusOptions = ["pending", "cancelled", "confirmed", "completed"];


  const formatPrice = (price) => {
    if (!price) return "-";
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleStatusUpdate = async (booking, newStatus) => {
    const updatedData = {
      user_id: booking.user_id,
      destination_id: booking.destination_id,
      vehicle_id: booking.vehicle_id,
      booking_date: booking.booking_date,
      jumlah_penumpang: booking.jumlah_penumpang,
      total_price: booking.total_price,
      status: newStatus
    };

    const success = await updateBookingdes(booking.id, updatedData);
    if (success) {
      window.location.reload();
    }
  };

  useEffect(() => {
    return () => clearMessages();
  }, []);

  return (
    <div className="ml-64 p-6 space-y-6">
      <Header title="Booking Management" />

      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm sm:rounded-lg">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Data Booking Customer</h1>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passengers</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {!bookingdes || bookingdes.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                          No booking data available.
                        </td>
                      </tr>
                    ) : (
                      bookingdes.map((booking, idx) => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{idx + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{booking.user?.name || "Unknown User"}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{booking.destination?.name || "Unknown Destination"}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{booking.vehicle ? `${booking.vehicle.name} (${booking.vehicle.type})` : "Unknown Vehicle"}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{new Date(booking.booking_date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{booking.jumlah_penumpang}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{formatPrice(booking.total_price)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={booking.status}
                              onChange={(e) => handleStatusUpdate(booking, e.target.value)}
                              className={`block w-full rounded-md shadow-sm sm:text-sm
                                ${booking.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                                  booking.status === 'confirmed' ? 'bg-blue-50 text-blue-700' :
                                    booking.status === 'completed' ? 'bg-green-50 text-green-700' :
                                      'bg-red-50 text-red-700'} 
                                border-gray-300 focus:border-blue-500 focus:ring-blue-500`}
                            >
                              {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
