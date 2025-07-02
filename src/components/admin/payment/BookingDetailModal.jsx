import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PDFPreviewModal from "./PDFPreviewModal";
import { generateCustomPDF } from "./CustomPDFGenerator";
import { useBooking } from "@/hooks/booking";

export default function BookingDetailModal({ bookingId, open, onClose }) {
  const { getBooking } = useBooking();
  const [booking, setBooking] = useState(null);
  const [pdfDataUrl, setPdfDataUrl] = React.useState(null);
  const [openPreview, setOpenPreview] = React.useState(false);

  console.log("bookingId di modal:", bookingId);

  useEffect(() => {
    if (open && bookingId) {
      getBooking(bookingId).then(data => {
        console.log("HASIL GET BOOKING:", data);
        setBooking(data);
      });
    } else if (!open) {
      setBooking(null);
    }
  }, [open, bookingId]);

  const handlePreviewPDF = async () => {
    setPdfDataUrl(null);
    try {
      console.log("DATA BOOKING UNTUK PDF:", booking);
      const pdfUrl = await generateCustomPDF(booking);
      setPdfDataUrl(pdfUrl);
      setOpenPreview(true);
    } catch (e) {
      alert("Gagal generate PDF");
    }
  };

  const handleDownloadPDF = () => {
    if (!pdfDataUrl) return;
    const link = document.createElement("a");
    link.href = pdfDataUrl;
    link.download = "laporan-pembayaran.pdf";
    link.click();
  };

  function getPatentCode(payment) {
    if (!payment) return "-";
    const id = payment.id || "-";
    const date = payment.payment_date || payment.createdAt;
    if (!date || !id) return "-";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return `${year}${month}/${id}`;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="min-w-[350px] max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Pemesanan</DialogTitle>
          </DialogHeader>
          {booking ? (
            <div className="py-2">
              <table className="w-full border border-slate-200 rounded text-sm">
                <tbody>
                  <tr>
                    <td className="font-medium py-1 px-2 w-1/3 border-b border-slate-100">Booking ID</td>
                    <td className="py-1 px-2 border-b border-slate-100">{getPatentCode(booking.payment)}</td>
                  </tr>
                  <tr>
                    <td className="font-medium py-1 px-2 border-b border-slate-100">Tanggal Booking</td>
                    <td className="py-1 px-2 border-b border-slate-100">
                      {booking.booking_date
                        ? new Date(booking.booking_date).toLocaleString("id-ID")
                        : booking.createdAt
                        ? new Date(booking.createdAt).toLocaleString("id-ID")
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium py-1 px-2 border-b border-slate-100">User</td>
                    <td className="py-1 px-2 border-b border-slate-100">{booking.user?.name}</td>
                  </tr>
                  <tr>
                    <td className="font-medium py-1 px-2 border-b border-slate-100">Tanggal Transaksi</td>
                    <td className="py-1 px-2 border-b border-slate-100">
                      {booking.payment?.payment_date
                        ? new Date(booking.payment.payment_date).toLocaleString("id-ID")
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium py-1 px-2 border-b border-slate-100">Status</td>
                    <td className="py-1 px-2 border-b border-slate-100">{booking.status}</td>
                  </tr>
                  <tr>
                    <td className="font-medium py-1 px-2 border-b border-slate-100">Transaction Status</td>
                    <td className="py-1 px-2 border-b border-slate-100">{booking.payment?.transaction?.status}</td>
                  </tr>
                  <tr>
                    <td className="font-medium py-1 px-2 border-b border-slate-100">Paket</td>
                    <td className="py-1 px-2 border-b border-slate-100">{booking.package?.name}</td>
                  </tr>
                  <tr>
                    <td className="font-medium py-1 px-2 border-b border-slate-100">Kendaraan</td>
                    <td className="py-1 px-2 border-b border-slate-100">{booking.vehicle?.name}</td>
                  </tr>
                  <tr>
                    <td className="font-medium py-1 px-2 border-b border-slate-100">Metode Pembayaran</td>
                    <td className="py-1 px-2 border-b border-slate-100">{booking.payment?.payment_method}</td>
                  </tr>
                  <tr>
                    <td className="font-medium py-1 px-2 border-b border-slate-100">Total Harga</td>
                    <td className="py-1 px-2 border-b border-slate-100">
                      {booking.payment?.amount
                        ? new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(booking.payment.amount)
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium py-1 px-2 border-b border-slate-100">Jumlah Penumpang</td>
                    <td className="py-1 px-2 border-b border-slate-100">{booking.jumlah_penumpang ?? '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500">Loading...</div>
          )}
          <div className="flex justify-end pt-2 gap-2">
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>
            <Button onClick={handlePreviewPDF} variant="default" disabled={!booking}>
              Preview PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <PDFPreviewModal
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        pdfDataUrl={pdfDataUrl}
        onDownload={handleDownloadPDF}
      />
    </>
  );
} 