"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/auth";
import { useVehicle } from "@/hooks/vehicle";
import { useRouter } from "next/navigation";
import AddVehicleModal from "@/components/vehicle/AddVehicleModal";
import EditVehicleModal from "@/components/vehicle/EditVehicleModal";
import DeleteVehicleModal from "@/components/vehicle/DeleteVehicleModal";

export default function VehiclePage() {
  const router = useRouter();
  const { user } = useAuth({ middleware: 'auth' });
  const { vehicles, loading, error, success, addVehicle, updateVehicle, deleteVehicle, clearMessages } = useVehicle();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState({});
  const VEHICLE_TYPES = ["MPV","Minibus","Van / Microbus","SUV","Bus Pariwisata"];

  const [formData, setFormData] = useState({
    name: "",
    type: VEHICLE_TYPES[0],
    capacity: "",
    license_plate: "",
    status: "available",
    description: ""
  });

  const STATUSES = ["available", "unavailable", "maintenance"];

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddVehicle = async (e) => {
    e && e.preventDefault();
    const data = { ...formData, capacity: parseInt(formData.capacity, 10) };
    const success = await addVehicle(data);
    if (success) {
      setShowAddModal(false);
      resetForm();
    }
  };

  const handleEditVehicle = async (e) => {
    e && e.preventDefault();
    const data = { ...formData, capacity: parseInt(formData.capacity, 10) };
    const success = await updateVehicle(currentVehicle.id, data);
    if (success) {
      setShowEditModal(false);
      resetForm();
    }
  };

  const handleDeleteVehicle = async () => {
    const success = await deleteVehicle(currentVehicle.id);
    if (success) {
      setShowDeleteModal(false);
    }
  };

  const openEditModal = (vehicle) => {
    setCurrentVehicle(vehicle);
    setFormData({
      name: vehicle.name,
      type: vehicle.type,
      capacity: vehicle.capacity,
      license_plate: vehicle.license_plate,
      status: vehicle.status,
      description: vehicle.description || ""
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (vehicle) => {
    setCurrentVehicle(vehicle);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: VEHICLE_TYPES[0],
      capacity: "",
      license_plate: "",
      status: "available",
      description: ""
    });
  };

  return (
    <div className="ml-64 p-6 space-y-6">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6 bg-white border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Data Kendaraan</h1>
              {/* <div>
                <span className="mr-3">Welcome, {user?.name}</span>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded"
                  onClick={() => router.push('/logout')}
                >
                  Logout
                </button>
              </div> */}
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded flex justify-between items-center">
                <span>{error}</span>
                <button onClick={clearMessages} className="ml-4 text-red-500">x</button>
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded flex justify-between items-center">
                <span>{success}</span>
                <button onClick={clearMessages} className="ml-4 text-green-500">x</button>
              </div>
            )}
            <button
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => { setShowAddModal(true); resetForm(); }}
            >
              Tambah Vehicle
            </button>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-2">#</th>
                    <th className="border px-4 py-2">Nama Kendaraan</th>
                    <th className="border px-4 py-2">Jenis Kendaraan</th>
                    <th className="border px-4 py-2">Kapasitas</th>
                    <th className="border px-4 py-2">Plat Kendaraan</th>
                    <th className="border px-4 py-2">Status</th>
                    <th className="border px-4 py-2">Deskripsi</th>
                    <th className="border px-4 py-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles && vehicles.length > 0 ? (
                    vehicles.map((vehicle, index) => (
                      <tr key={vehicle.id}>
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">{vehicle.name}</td>
                        <td className="border px-4 py-2">{vehicle.type}</td>
                        <td className="border px-4 py-2">{vehicle.capacity}</td>
                        <td className="border px-4 py-2">{vehicle.license_plate}</td>
                        <td className="border px-4 py-2">{vehicle.status}</td>
                        <td className="border px-4 py-2">{vehicle.description}</td>
                        <td className="border px-4 py-2">
                          <button
                            className="px-3 py-1 bg-yellow-500 text-white rounded mr-2"
                            onClick={() => openEditModal(vehicle)}
                          >
                            Edit
                          </button>
                          <button
                            className="px-3 py-1 bg-red-500 text-white rounded"
                            onClick={() => openDeleteModal(vehicle)}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">No vehicles found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <AddVehicleModal
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleAddVehicle}
          onClose={() => setShowAddModal(false)}
          loading={loading}
          vehicleTypes={VEHICLE_TYPES}
          statuses={STATUSES}
        />
      )}

      {/* Edit Vehicle Modal */}
      {showEditModal && (
        <EditVehicleModal
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleEditVehicle}
          onClose={() => setShowEditModal(false)}
          loading={loading}
          vehicleTypes={VEHICLE_TYPES}
          statuses={STATUSES}
        />
      )}

      {/* Delete Vehicle Modal */}
      {showDeleteModal && (
        <DeleteVehicleModal
          formData={currentVehicle}
          onSubmit={handleDeleteVehicle}
          onClose={() => setShowDeleteModal(false)}
          loading={loading}
        />
      )}
    </div>
  );
}
