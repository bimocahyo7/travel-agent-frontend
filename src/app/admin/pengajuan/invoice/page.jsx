"use client";

import { DataTable } from "@/components/admin/invoice/table/data-table";
import { useInvoices } from "@/hooks/invoice";

export default function InvoicePage() {
  const { invoices, loading: isLoading, error } = useInvoices();
  const isError = !!error;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Invoice</h1>
      <p className="mt-1 mb-3 text-gray-600">
        Manage and view all travel invoice pengajuan dinas.
      </p>
      {isError ? (
        <div className="text-red-500 mb-4">Failed to load data.</div>
      ) : (
        <DataTable data={invoices || []} isLoading={isLoading} />
      )}
    </div>
  );
}
