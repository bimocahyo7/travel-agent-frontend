"use client";

import { useBooking } from "@/hooks/booking";
import { DataTable } from "@/components/admin/booking/table/data-table";
import { columns } from "@/components/admin/booking/table/columns";

export default function BookingPage() {
  const { bookings, loading, error } = useBooking();

  console.log("BookingPage render:", { bookings, loading, error }); // Debug log

  if (error) {
    return (
      <div className="text-red-500 mb-4 p-4 border border-red-300 rounded">
        {error.message || "Failed to load data."}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Bookings</h1>
      <p className="mt-1 mb-3 text-gray-600">
        Manage and monitor all booking activities
      </p>
      <DataTable
        columns={columns}
        data={bookings || []}
        loading={loading}
      />
    </div>
  );
}