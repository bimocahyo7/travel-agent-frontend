"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePackages } from "@/hooks/package";
import { useBooking } from "@/hooks/booking";
import { useVehicle } from "@/hooks/vehicle";
import { useAuth } from "@/hooks/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PaymentModal from "@/components/PaymentModal";

export default function BookingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { packages } = usePackages();
  const { vehicles } = useVehicle();
  const { addBooking, loading, success, error } = useBooking();

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [passengerCount, setPassengerCount] = useState(1);
  const [bookingDate, setBookingDate] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [message, setMessage] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const packageId = localStorage.getItem("selectedPackageId");

    if (!packageId) {
      router.push("/");
      return;
    }

    const pkg = packages?.find((p) => p.id === parseInt(packageId));
    if (pkg) {
      setSelectedPackage(pkg);
    }
  }, [packages, router]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedPackage || !vehicleId || !bookingDate || !user) return;

    const selectedVehicle = vehicles?.find((v) => v.id === parseInt(vehicleId));
    if (!selectedVehicle) {
      alert("Kendaraan tidak ditemukan");
      return;
    }

    const total = selectedPackage.price * passengerCount;
    const bookingDetails = {
      customerName: user.name,
      destination: selectedPackage.destination?.location ?? "Tidak tersedia",
      date: bookingDate,
      passengers: passengerCount,
      total: total,
      vehicle: {
        name: selectedVehicle.name,
        type: selectedVehicle.type,
      },
    };

    setBookingData(bookingDetails);
    setShowPaymentModal(true);
  };

  const handleConfirmBooking = async (bookingDetails) => {
    const bookingData = {
      user_id: user.id,
      package_id: selectedPackage.id,
      vehicle_id: vehicleId,
      booking_date: bookingDate,
      jumlah_penumpang: parseInt(passengerCount),
      total_price: selectedPackage.price * passengerCount,
    };

    const success = await addBooking(bookingData);
    if (success) {
      router.push("/pesanan-saya/booking-package");
    }
  };

  if (!selectedPackage) {
    return <p className="p-4">Memuat data paket...</p>;
  }

  return (
    <section className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-cyan-700">
        Checkout Pemesanan
      </h2>

      <form onSubmit={handleBooking} className="space-y-4">
        {user && (
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-2">Data Pengguna</h3>
            <p>
              <strong>Nama:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Paket yang Dipilih</h3>
          <p>
            <strong>Nama Paket:</strong> {selectedPackage.name}
          </p>
          <p>
            <strong>Tujuan:</strong>{" "}
            {selectedPackage.destination?.location ?? "Tidak tersedia"}
          </p>
          <p>
            <strong>Harga per orang:</strong> Rp{" "}
            {selectedPackage.price.toLocaleString("id-ID")}
          </p>
        </div>

        <div>
          <label className="block text-sm mb-1">Jumlah Penumpang</label>
          <Input
            type="number"
            min="1"
            value={passengerCount}
            onChange={(e) => setPassengerCount(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Tanggal Booking</label>
          <Input
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            min={today}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Pilih Kendaraan</label>
          <select
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">-- Pilih Kendaraan --</option>
            {Array.isArray(vehicles) &&
              vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.name} - {vehicle.type}
                </option>
              ))}
          </select>
        </div>

        <div className="bg-gray-100 rounded p-4">
          <p>
            <strong>Total Harga:</strong> Rp{" "}
            {(selectedPackage.price * passengerCount).toLocaleString("id-ID")}
          </p>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-500"
        >
          {loading ? "Memproses..." : "Pesan Sekarang"}
        </Button>

        {message && (
          <p className="text-center text-sm text-blue-600">{message}</p>
        )}
        {error && <p className="text-center text-sm text-red-600">{error}</p>}
      </form>

      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          bookingDetails={bookingData}
          onConfirm={handleConfirmBooking}
        />
      )}
    </section>
  );
}
