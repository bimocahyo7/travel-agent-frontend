"use client";

import { DataTable } from "@/components/admin/review/table/data-table";
import { useReview } from "@/hooks/useReview";

export default function ReviewPage() {
  const { reviews, loading: isLoading, error } = useReview();
  const isError = !!error;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Review</h1>
      <p className="mt-1 mb-3 text-gray-600">Manage and view all review</p>
      {isError ? (
        <div className="text-red-500 mb-4">Failed to load data.</div>
      ) : (
        <DataTable data={reviews || []} isLoading={isLoading} />
      )}
    </div>
  );
}
