"use client";

import { DataTable } from "@/components/admin/vehicle/table/data-table";
import { useVehicle } from "@/hooks/vehicle";

export default function VehiclePage() {
  const { vehicles, loading: isLoading, error } = useVehicle();
  const isError = !!error;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Vehicle</h1>
      <p className="mt-1 mb-3 text-gray-600">
        Manage and view all vehicles
      </p>
      {isError ? (
        <div className="text-red-500 mb-4">Failed to load data.</div>
      ) : (
        <DataTable data={vehicles || []} isLoading={isLoading} />
      )}
    </div>
  );
}
