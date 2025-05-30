"use client"

import { DataTable } from "@/components/admin/transaction/table/data-table"
import { useTransaction } from "@/hooks/transaction"

export default function TransactionsPage() {
  const { transactions, loading, error } = useTransaction()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Transactions</h1>
      <p className="mt-1 mb-3 text-gray-600">
        Manage and monitor all transaction activities
      </p>
      {error ? (
        <div className="text-red-500 mb-4">Failed to load data.</div>
      ) : (
        <DataTable 
          data={transactions || []} 
          isLoading={loading} 
        />
      )}
    </div>
  )
}