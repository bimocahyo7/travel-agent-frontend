"use client";

import { DataTable } from "@/components/admin/package/payment/table/data-table";
import { usePayments } from "@/hooks/payment";

export default function PaymentPage() {
  const { payments, isLoading, isError } = usePayments();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Pembayaran</h1>
      <p className="mt-1 mb-3 text-gray-600">
        Kelola dan lihat semua transaksi pembayaran.
      </p>
      {isError ? (
        <div className="text-red-500 mb-4">Gagal memuat data.</div>
      ) : (
        <DataTable data={payments || []} isLoading={isLoading} />
      )}
    </div>
  );
}
