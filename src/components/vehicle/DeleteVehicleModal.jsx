import React from "react";

export default function DeleteVehicleModal({
  formData = {},
  onSubmit,
  onClose,
  loading = false,
}) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Delete Vehicle</h2>
        <p className="mb-4">
          Are you sure you want to delete the vehicle
          {formData.name ? ` "${formData.name}"` : ""}? This action cannot be undone.
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
            disabled={loading}
          >
            Batal
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-red-500 text-white rounded"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
} 