"use client";

import { usePaymentsub } from "@/hooks/paymentsub";
import { DataTable } from "@/components/admin/paymentsub/table/data-table";
import { columns } from "@/components/admin/paymentsub/table/columns";

export default function PaymentsubPage() {
  const { payments, loading, error } = usePaymentsub();

  if (error) {
    return (
      <div className="text-red-500 mb-4 p-4 border border-red-300 rounded">
        {error.message || "Failed to load payment data."}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Payment Submissions</h1>
      <p className="mt-1 mb-3 text-gray-600">
        Manage and monitor all payment activities
      </p>
      <DataTable
        columns={columns}
        data={payments || []}
        loading={loading}
      />
    </div>
  );
}