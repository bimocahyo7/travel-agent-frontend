"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDestination } from "@/hooks/destination";
import { useBookingdes } from "@/hooks/bookingdes";
import { useVehicle } from "@/hooks/vehicle";
import { useAuth } from "@/hooks/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PaymentModal from "@/components/customer/payment/PaymentModal";

export default function BookingDestinationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { destinations } = useDestination();
  const { vehicles } = useVehicle();
  const { addBookingdes, loading, success, error } = useBookingdes();

  const [selectedDestination, setSelectedDestination] = useState(null);
  const [passengerCount, setPassengerCount] = useState(1);
  const [bookingDate, setBookingDate] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const [message, setMessage] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const destinationId = localStorage.getItem("selectedDestinationId");

    if (!destinationId) {
      router.push("/");
      return;
    }

    const dest = destinations?.find((d) => d.id === parseInt(destinationId));
    if (dest) {
      setSelectedDestination(dest);
      if (dest.price) {
        setCustomPrice(dest.price.toString());
      }
    }
  }, [destinations, router]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedDestination || !vehicleId || !bookingDate || !user) return;

    const selectedVehicle = vehicles?.find((v) => v.id === parseInt(vehicleId));
    if (!selectedVehicle) {
      alert("Kendaraan tidak ditemukan");
      return;
    }

    const total = getTotalPrice();
    const bookingDetails = {
      customerName: user.name,
      destination: selectedDestination.name,
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
      destination_id: selectedDestination.id,
      vehicle_id: vehicleId,
      booking_date: bookingDate,
      jumlah_penumpang: parseInt(passengerCount),
      total_price: getTotalPrice(),
    };

    const success = await addBookingdes(bookingData);
    if (success) {
      localStorage.clear();
      router.push("/pesanan-saya/booking-destination");
    }
  };

  const getTotalPrice = () => {
    if (customPrice) {
      return parseFloat(customPrice) * passengerCount;
    }
    return 0;
  };

  if (!selectedDestination) {
    return <p className="p-4">Memuat data destinasi...</p>;
  }

  return (
    <section className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-cyan-700">
        Checkout Pemesanan Destinasi
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
          <h3 className="text-lg font-semibold mb-2">Destinasi yang Dipilih</h3>
          <p>
            <strong>Nama Destinasi:</strong> {selectedDestination.name}
          </p>
          <p>
            <strong>Lokasi:</strong> {selectedDestination.location}
          </p>
          {selectedDestination.description && (
            <p>
              <strong>Deskripsi:</strong> {selectedDestination.description}
            </p>
          )}
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
            {getTotalPrice().toLocaleString("id-ID")}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Harga dapat dinegosiasikan sesuai dengan layanan yang dibutuhkan
          </p>
        </div>

        <Button
          type="submit"
          disabled={loading || !customPrice}
          className="w-full bg-emerald-600 hover:bg-emerald-500 cursor-pointer"
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
