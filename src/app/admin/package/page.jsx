"use client";

import { DataTable } from "@/components/admin/package/table/data-table";
import { usePackages } from "@/hooks/usePackages";

export default function PackagePage() {
  const { packages, isLoading, isError } = usePackages();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Package</h1>
      <p className="mt-1 mb-3 text-gray-600">
        Manage and view all travel packages.
      </p>
      {isError ? (
        <div className="text-red-500 mb-4">Failed to load data.</div>
      ) : (
        <DataTable data={packages || []} isLoading={isLoading} />
      )}
    </div>
  );
}
