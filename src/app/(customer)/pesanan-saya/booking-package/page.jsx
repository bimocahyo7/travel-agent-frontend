"use client";

import DataTable from "@/components/customer/package/page";
import { useBookingdes } from "@/hooks/bookingdes";

export default function PackagePage() {
  const { packages, isLoading, isError } = useBookingdes();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Packages</h1>
      <p className="mt-1 mb-3 text-gray-600">
        Jelajahi dan booking package!
      </p>
      {isError ? (
        <div className="text-red-500 mb-4">Gagal memuat data.</div>
      ) : (
        <DataTable data={packages || []} isLoading={isLoading} />
      )}
    </div>
  );
}