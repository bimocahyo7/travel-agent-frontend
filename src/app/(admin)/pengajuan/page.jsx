"use client";

import { useEffect, useState } from "react";
import Header from "@/app/(admin)/Header";
import { usePengajuan, useDestinations, useVehicles } from "@/hooks/pengajuan";
import { useAuth } from "@/hooks/auth";
import InvoiceModal from "@/components/pengajuan/InvoiceModal";

export default function AdminPengajuanPage() {
  const {
    pengajuans,
    loading,
    error,
    success,
    deletePengajuan,
    clearMessages,
    updatePengajuan,
  } = usePengajuan();

  const { destinations = [] } = useDestinations() || {};
  const { vehicles = [] } = useVehicles() || {};

  const [users, setUsers] = useState([]);
  const { getUsers } = useAuth();

  // Status options
  const statusOptions = [
    "menunggu_konfirmasi",
    "menunggu_persetujuan",
    "disetujui",
    "dalam_perjalanan",
    "menunggu_pembayaran",
    "lunas",
    "ditolak"
  ];

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedPengajuan, setSelectedPengajuan] = useState(null);
  const [invoiceData, setInvoiceData] = useState({
    amount: "",
    due_date: "",
    notes: ""
  });

  // Handler untuk update status
  const handleStatusChange = async (pengajuan, newStatus) => {
    if (pengajuan.status === newStatus) return;
    if (newStatus === "menunggu_persetujuan") {
      setSelectedPengajuan(pengajuan);
      setShowInvoiceModal(true);
    } else {
      await updatePengajuan(pengajuan.id, { ...pengajuan, status: newStatus });
    }
  };

  const getDestinationName = (id) => {
    if (!Array.isArray(destinations)) return id;
    const dest = destinations.find((d) => String(d.id) === String(id));
    return dest ? dest.location : id;
  };

  const getVehicleName = (id) => {
    if (!Array.isArray(vehicles)) return id;
    const veh = vehicles.find((v) => v.id === id);
    return veh ? veh.name : id;
  };

  const getUserName = (id) => {
    if (!Array.isArray(users)) return id;
    const user = users.find((u) => u.id === id);
    return user ? user.name : id;
  };


  // Clear messages when component unmounts
  useEffect(() => {
    return () => clearMessages();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setUsers([]);
      }
    };
    fetchUsers();
  }, [getUsers]);

  return (
    <div className="ml-64 p-6 space-y-6">
      <Header title="Pengajuan Management" />

      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm sm:rounded-lg">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Data Pengajuan Customer</h1>
            </div>

            {/* Show error message if any */}
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Show success message if any */}
            {success && (
              <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institusi</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pemohon</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Kendaraan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Berangkat</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Pulang</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Peserta</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {!Array.isArray(pengajuans) || pengajuans.length === 0 ? (
                      <tr>
                        <td colSpan={12} className="px-6 py-4 text-center text-gray-500">
                          No pengajuan data available.
                        </td>
                      </tr>
                    ) : (
                      pengajuans.map((pengajuan, idx) => (
                        <tr key={pengajuan.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{idx + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{getUserName(pengajuan.user_id)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{pengajuan.institution}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{pengajuan.applicant}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{pengajuan.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getDestinationName(pengajuan.destination_id)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{getVehicleName(pengajuan.vehicle_id)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{pengajuan.departure_date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{pengajuan.return_date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{pengajuan.participants}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{pengajuan.notes || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              className="border rounded px-2 py-1 text-sm"
                              value={pengajuan.status || "Pending"}
                              onChange={e => handleStatusChange(pengajuan, e.target.value)}
                            >
                              {statusOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => deletePengajuan(pengajuan.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <InvoiceModal
        open={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        invoiceData={invoiceData}
        setInvoiceData={setInvoiceData}
        pengajuan={selectedPengajuan}
        onSubmit={async () => {
          await updatePengajuan(selectedPengajuan.id, {
            ...selectedPengajuan,
            status: "menunggu_persetujuan",
            invoice: invoiceData
          });
          setShowInvoiceModal(false);
          setInvoiceData({ amount: "", due_date: "", notes: "" });
        }}
      />
    </div>
  );
}
