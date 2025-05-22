"use client";

import { DataTable } from "@/components/admin/destination/table/data-table";
import { useDestinations } from "@/hooks/useDestinations";

export default function DestinationPage() {
  const { destinations, isLoading, isError } = useDestinations();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Destination</h1>
      <p className="mt-1 mb-3 text-gray-600">
        Manage and view all travel destinations
      </p>
      {isError ? (
        <div className="text-red-500 mb-4">Failed to load data.</div>
      ) : (
        <DataTable data={destinations || []} isLoading={isLoading} />
      )}
    </div>
  );
}
