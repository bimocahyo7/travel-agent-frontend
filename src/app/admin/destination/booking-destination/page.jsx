"use client";

import { useBookingdes } from "@/hooks/bookingdes";
import { DataTable } from "@/components/admin/bookingdes/table/data-table";
import { columns } from "@/components/admin/bookingdes/table/columns";

export default function BookingdesPage() {
  const { bookingdes, loading, error } = useBookingdes();

  console.log("BookingdesPage render:", { bookingdes, loading, error });

  if (error) {
    return (
      <div className="text-red-500 mb-4 p-4 border border-red-300 rounded">
        {error.message || "Failed to load data."}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Booking Destination</h1>
      <p className="mt-1 mb-3 text-gray-600">
        Manage and monitor all destination booking activities
      </p>
      <DataTable 
        columns={columns} 
        data={bookingdes || []} 
        loading={loading} 
      />
    </div>
  );
}