"use client";

import { useState } from "react";
import { useVehicle } from "@/hooks/vehicle";
import { usePengajuan } from "@/hooks/pengajuan";
import { useAuth } from "@/hooks/auth";
import { useDestinations } from "@/hooks/pengajuan";

function RequestForm() {
  const [form, setForm] = useState({
    institution: "",
    applicant: "",
    email: "",
    destination: "",
    vehicle: "",
    departureDate: "",
    returnDate: "",
    participants: "",
    notes: "",
  });

  const { vehicles, loading, error } = useVehicle();
  const { addPengajuan } = usePengajuan();
  const { user } = useAuth();
  const [success, setSuccess] = useState("");
  const [errorSubmit, setError] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const { destinations, loading: loadingDestinations } = useDestinations();
  const [errorDate, setErrorDate] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Validasi tanggal pulang tidak boleh sebelum tanggal berangkat
    if (
      (name === "departureDate" && form.returnDate) ||
      (name === "returnDate" && form.departureDate)
    ) {
      const departure = name === "departureDate" ? value : form.departureDate;
      const ret = name === "returnDate" ? value : form.returnDate;
      if (departure && ret && ret < departure) {
        setErrorDate("Tanggal pulang tidak boleh lebih awal dari tanggal berangkat.");
      } else {
        setErrorDate("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoadingSubmit(true);
    // Validasi tanggal pulang tidak boleh sebelum tanggal berangkat
    if (form.departureDate && form.returnDate && form.returnDate < form.departureDate) {
      setErrorDate("Tanggal pulang tidak boleh lebih awal dari tanggal berangkat.");
      setLoadingSubmit(false);
      return;
    }
    setErrorDate("");
    // Validasi user login
    if (!user || !user.id) {
      setError("Silakan login terlebih dahulu untuk mengajukan permintaan.");
      setLoadingSubmit(false);
      return;
    }
    // Map form field ke field backend
    const pengajuanData = {
      institution: form.institution,
      applicant: form.applicant,
      email: form.email,
      destination_id: form.destination,
      vehicle_id: form.vehicle,
      departure_date: form.departureDate,
      return_date: form.returnDate,
      participants: form.participants,
      notes: form.notes,
      ...(user && user.id ? { user_id: user.id } : {}),
    };
    const result = await addPengajuan(pengajuanData);
    if (result) {
      setSuccess("Pengajuan berhasil dikirim!");
      setForm({
        institution: "",
        applicant: "",
        email: "",
        destination: "",
        vehicle: "",
        departureDate: "",
        returnDate: "",
        participants: "",
        notes: "",
      });
    } else {
      setError("Gagal mengirim pengajuan. Silakan coba lagi.");
    }
    setLoadingSubmit(false);
  };

  return (
    <section className="bg-[#EEF7FF] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-[#205781] mb-6 text-center">
            Form Pengajuan Permintaan Perjalanan Dinas
          </h2>
          {success && <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">{success}</div>}
          {errorSubmit && <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">{errorSubmit}</div>}
          {errorDate && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">{errorDate}</div>
          )}
          <form onSubmit={handleSubmit} className="md:flex gap-8 space-y-4 md:space-y-0">
            {/* Left Side */}
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Institusi</label>
                <input type="text" name="institution" value={form.institution} onChange={handleChange} className="block w-full border border-gray-300 rounded-lg py-2 px-3" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pemohon</label>
                <input type="text" name="applicant" value={form.applicant} onChange={handleChange} className="block w-full border border-gray-300 rounded-lg py-2 px-3" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Pemohon</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="block w-full border border-gray-300 rounded-lg py-2 px-3" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tujuan Perjalanan</label>
                <select
                  name="destination"
                  value={form.destination}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-lg py-2 px-3"
                  required
                  disabled={loadingDestinations}
                >
                  <option value="" disabled>Pilih Tujuan</option>
                  {Array.isArray(destinations) && destinations.map((dest) => (
                    <option key={dest.id} value={dest.id}>{dest.location}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Right Side */}
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kendaraan</label>
                <select
                  name="vehicle"
                  value={form.vehicle}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-lg py-2 px-3"
                  required
                >
                  <option value="" disabled>Pilih Kendaraan</option>
                  {Array.isArray(vehicles) && vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>{vehicle.type}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Berangkat</label>
                  <input type="date" name="departureDate" value={form.departureDate} onChange={handleChange} className="block w-full border border-gray-300 rounded-lg py-2 px-3" required />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pulang</label>
                  <input type="date" name="returnDate" value={form.returnDate} onChange={handleChange} className="block w-full border border-gray-300 rounded-lg py-2 px-3" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Peserta</label>
                <input type="number" name="participants" value={form.participants} onChange={handleChange} className="block w-full border border-gray-300 rounded-lg py-2 px-3" min="1" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan Tambahan</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} className="block w-full border border-gray-300 rounded-lg py-2 px-3" rows="3" />
              </div>
              <button type="submit" className={`w-full bg-[#F0A04B] hover:bg-amber-600 text-white py-2 px-4 rounded-lg font-semibold transition duration-300 mt-4${loadingSubmit ? " opacity-50 cursor-not-allowed" : ""}`} disabled={loadingSubmit}>
                Ajukan Permintaan
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default RequestForm;
