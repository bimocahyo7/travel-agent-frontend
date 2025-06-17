"use client";

import { DataTable } from "@/components/admin/pengajuan/table/data-table";
import { usePengajuan } from "@/hooks/pengajuan";

export default function PengajuanPage() {
  const { pengajuans, loading, error } = usePengajuan();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Pengajuan</h1>
      <p className="mt-1 mb-3 text-gray-600">
      Manage and view all travel submission
      </p>
      {error ? (
        <div className="text-red-500 mb-4">Failed to load data.</div>
      ) : (
        <DataTable data={pengajuans || []} isLoading={loading} />
      )}
    </div>
  );
}
