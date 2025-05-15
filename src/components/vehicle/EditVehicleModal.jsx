import React from "react";

export default function EditVehicleModal({
  formData = {},
  onChange,
  onSubmit,
  onClose,
  loading = false,
  vehicleTypes = [],
  statuses = [],
}) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Vehicle</h2>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name || ""}
            onChange={onChange}
            className="block w-full border p-2 mb-2"
            required
          />
          <select
            name="type"
            value={formData.type || vehicleTypes[0]}
            onChange={onChange}
            className="block w-full border p-2 mb-2"
            required
          >
            {vehicleTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={formData.capacity || ""}
            onChange={onChange}
            className="block w-full border p-2 mb-2"
            required
          />
          <input
            type="text"
            name="license_plate"
            placeholder="License Plate"
            value={formData.license_plate || ""}
            onChange={onChange}
            className="block w-full border p-2 mb-2"
            required
          />
          <select
            name="status"
            value={formData.status || statuses[0]}
            onChange={onChange}
            className="block w-full border p-2 mb-2"
            required
          >
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description || ""}
            onChange={onChange}
            className="block w-full border p-2 mb-2"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded"
            disabled={loading}
          >
            {loading ? "Updating..." : "Simpan"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded"
          >
            Batal
          </button>
        </form>
      </div>
    </div>
  );
}
