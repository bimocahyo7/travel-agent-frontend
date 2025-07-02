"use client";

import { useState } from "react";
import { z } from "zod";
import { useVehicle } from "@/hooks/vehicle";
import { usePengajuan } from "@/hooks/pengajuan";
import { useAuth } from "@/hooks/auth";
import { useDestinations } from "@/hooks/pengajuan";
import { requestFormSchema } from "@/lib/schemas/pengajuan";

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
  const [errors, setErrors] = useState({});

  // Format today date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorSubmit) setError("");
    if (success) setSuccess("");
  };

  const validateForm = (data) => {
    try {
      requestFormSchema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = {};
        error.errors.forEach((err) => {
          formattedErrors[err.path[0]] = err.message;
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoadingSubmit(true);

    // Validate form
    if (!validateForm(form)) {
      setLoadingSubmit(false);
      return;
    }

    // Validate user login
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
          {success && (
            <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}
          {errorSubmit && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorSubmit}
            </div>
          )}
          {errorDate && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorDate}
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="md:flex gap-8 space-y-4 md:space-y-0"
          >
            {/* Left Side */}
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Institusi
                </label>
                <input
                  type="text"
                  name="institution"
                  value={form.institution}
                  onChange={handleChange}
                  className={`block w-full border ${
                    errors.institution ? "border-red-500" : "border-gray-300"
                  } rounded-lg py-2 px-3`}
                  required
                />
                {errors.institution && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.institution}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Pemohon
                </label>
                <input
                  type="text"
                  name="applicant"
                  value={form.applicant}
                  onChange={handleChange}
                  className={`block w-full border ${
                    errors.applicant ? "border-red-500" : "border-gray-300"
                  } rounded-lg py-2 px-3`}
                  required
                />
                {errors.applicant && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.applicant}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Pemohon
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`block w-full border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-lg py-2 px-3`}
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tujuan Perjalanan
                </label>
                <select
                  name="destination"
                  value={form.destination}
                  onChange={handleChange}
                  className={`block w-full border ${
                    errors.destination ? "border-red-500" : "border-gray-300"
                  } rounded-lg py-2 px-3`}
                  required
                  disabled={loadingDestinations}
                >
                  <option value="" disabled>
                    Pilih Tujuan
                  </option>
                  {Array.isArray(destinations) &&
                    destinations.map((dest) => (
                      <option key={dest.id} value={dest.id}>
                        {dest.location}
                      </option>
                    ))}
                </select>
                {errors.destination && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.destination}
                  </p>
                )}
              </div>
            </div>
            {/* Right Side */}
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Kendaraan
                </label>
                <select
                  name="vehicle"
                  value={form.vehicle}
                  onChange={handleChange}
                  className={`block w-full border ${
                    errors.vehicle ? "border-red-500" : "border-gray-300"
                  } rounded-lg py-2 px-3`}
                  required
                >
                  <option value="" disabled>
                    Pilih Kendaraan
                  </option>
                  {Array.isArray(vehicles) &&
                    vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.name}
                      </option>
                    ))}
                </select>
                {errors.vehicle && (
                  <p className="mt-1 text-sm text-red-500">{errors.vehicle}</p>
                )}
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Berangkat
                  </label>
                  <input
                    type="date"
                    name="departureDate"
                    value={form.departureDate}
                    onChange={handleChange}
                    min={today}
                    className={`block w-full border ${
                      errors.departureDate
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg py-2 px-3`}
                    required
                  />
                  {errors.departureDate && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.departureDate}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Pulang
                  </label>
                  <input
                    type="date"
                    name="returnDate"
                    value={form.returnDate}
                    onChange={handleChange}
                    min={form.departureDate || today}
                    className={`block w-full border ${
                      errors.returnDate ? "border-red-500" : "border-gray-300"
                    } rounded-lg py-2 px-3`}
                    required
                  />
                  {errors.returnDate && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.returnDate}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah Peserta
                </label>
                <input
                  type="number"
                  name="participants"
                  value={form.participants}
                  onChange={handleChange}
                  className={`block w-full border ${
                    errors.participants ? "border-red-500" : "border-gray-300"
                  } rounded-lg py-2 px-3`}
                  min="1"
                  required
                />
                {errors.participants && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.participants}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keterangan Tambahan
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-lg py-2 px-3"
                  rows="3"
                />
              </div>
              <button
                type="submit"
                className={`w-full bg-[#F0A04B] cursor-pointer hover:bg-amber-600 text-white py-2 px-4 rounded-lg font-semibold transition duration-300 mt-4${
                  loadingSubmit ? " opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loadingSubmit}
              >
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
