"use client";

import DataTable from "@/components/customer/destination/page";
import { useBooking } from "@/hooks/booking";

export default function DestinationPage() {
  const { destinations, isLoading, isError } = useBooking();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Destinations</h1>
      <p className="mt-1 mb-3 text-gray-600">
        Jelajahi dan booking destinasi wisata favoritmu!
      </p>
      {isError ? (
        <div className="text-red-500 mb-4">Gagal memuat data.</div>
      ) : (
        <DataTable data={destinations || []} isLoading={isLoading} />
      )}
    </div>
  );
}