"use client";

import { useState } from "react";
import { useVehicle } from "@/hooks/vehicle";

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: handle form submission (API call, etc)
    console.log(form);
  };

  return (
    <section className="bg-[#EEF7FF] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-[#205781] mb-6 text-center">
            Form Pengajuan Permintaan Perjalanan Dinas
          </h2>
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
                <input type="text" name="destination" value={form.destination} onChange={handleChange} className="block w-full border border-gray-300 rounded-lg py-2 px-3" required />
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
              <button type="submit" className="w-full bg-[#F0A04B] hover:bg-amber-600 text-white py-2 px-4 rounded-lg font-semibold transition duration-300 mt-4">
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
