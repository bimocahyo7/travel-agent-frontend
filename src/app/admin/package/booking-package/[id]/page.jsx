"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useBooking } from "@/hooks/booking";
import { generateCustomPDF } from "@/components/admin/payment/CustomPDFGenerator";

export default function BookingDetailPage() {
  const params = useParams();
  const { getBooking } = useBooking();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const data = await getBooking(params.id);
        console.log("Fetched booking data:", data);
        setBooking(data);
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [params.id, getBooking]);

  const handleGeneratePDF = async () => {
    try {
      console.log("Generating PDF for booking:", booking);
      const pdfDataUrl = await generateCustomPDF(booking);
      // Buka PDF di tab baru
      window.open(pdfDataUrl);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Gagal membuat PDF. Silakan coba lagi.");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!booking) return <div className="p-6">Booking not found</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Detail Booking</h1>
        <button
          onClick={handleGeneratePDF}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586L7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
          </svg>
          Generate PDF
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Informasi Booking</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-2"><strong>No Invoice:</strong> {booking.noInvoice || '-'}</p>
            <p className="mb-2"><strong>Nama Paket:</strong> {booking.package?.name || '-'}</p>
            <p className="mb-2"><strong>Tanggal Acara:</strong> {booking.tglAcara || '-'}</p>
            <p className="mb-2"><strong>Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {booking.status || '-'}
              </span>
            </p>
          </div>
          <div>
            <p className="mb-2"><strong>Total Harga:</strong> Rp {new Intl.NumberFormat('id-ID').format(booking.total_harga || 0)}</p>
            <p className="mb-2"><strong>Jumlah Penumpang:</strong> {booking.jumlah_penumpang || '-'}</p>
            <p className="mb-2"><strong>Metode Pembayaran:</strong> {booking.payment?.payment_method || '-'}</p>
            <p className="mb-2"><strong>Status Pembayaran:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                booking.payment?.status === 'paid' ? 'bg-green-100 text-green-800' :
                booking.payment?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                booking.payment?.status === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {booking.payment?.status || '-'}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Informasi Pemesan</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-2"><strong>Nama:</strong> {booking.user?.name || booking.kepada || '-'}</p>
            <p className="mb-2"><strong>Email:</strong> {booking.user?.email || '-'}</p>
          </div>
          <div>
            <p className="mb-2"><strong>Dibuat:</strong> {new Date(booking.created_at).toLocaleString('id-ID')}</p>
            <p className="mb-2"><strong>Diperbarui:</strong> {new Date(booking.updated_at).toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>

      {booking.vehicle && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Informasi Kendaraan</h2>
          <p className="mb-2"><strong>Kendaraan:</strong> {booking.vehicle.name || '-'}</p>
        </div>
      )}
    </div>
  );
} 