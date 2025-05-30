import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, CreditCard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function InvoiceCustomer({ invoice, pengajuan, onNextStep, disabled }) {
  if (!invoice) return null;

  // Contoh logika: button disable jika invoice.total kurang dari 1
  const isButtonDisabled = !invoice.total || invoice.total < 1;

  // State untuk handle disable setelah klik
  const [clicked, setClicked] = useState(false);

  // State untuk modal pembayaran
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // State untuk file bukti pembayaran
  const [paymentProof, setPaymentProof] = useState(null);

  // Button aktif jika status menunggu_persetujuan
  const isButtonActive = pengajuan.status === "menunggu_persetujuan" && !clicked;

  // Handler klik button
  const handleClick = () => {
    setClicked(true);
    if (onNextStep) onNextStep();
  };

  // Handler untuk tombol bayar
  const handlePayClick = () => {
    setShowPaymentModal(true);
  };

  // Handler untuk menutup modal
  const handleCloseModal = () => {
    setShowPaymentModal(false);
  };

  // Handler untuk file upload
  const handleFileChange = (e) => {
    setPaymentProof(e.target.files[0]);
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-lg mx-right animate-fade-in">
      {/* Header dengan ikon */}
      <div className="flex items-center gap-3 mb-4 border-b pb-2">
        <FileText className="text-green-600 w-7 h-7" />
        <span className="font-extrabold text-2xl text-gray-800">Invoice</span>
      </div>
      {/* Info Pengajuan */}
      {pengajuan && (
        <div className="mb-4 text-sm text-gray-700 grid grid-cols-2 gap-x-4 gap-y-1">
          <div><b>ID Pengajuan:</b> <span className="text-gray-900">{pengajuan.id}</span></div>
          <div><b>Instansi:</b> <span className="text-gray-900">{pengajuan.institution}</span></div>
          <div><b>Pemohon:</b> <span className="text-gray-900">{pengajuan.applicant}</span></div>
          <div><b>Tujuan:</b> <span className="text-gray-900">{pengajuan.destination}</span></div>
          <div><b>Tanggal Berangkat:</b> <span className="text-gray-900">{pengajuan.departure_date}</span></div>
          <div><b>Tanggal Kembali:</b> <span className="text-gray-900">{pengajuan.return_date}</span></div>
          <div className="col-span-2"><b>Peserta:</b> <span className="text-gray-900">{pengajuan.participants}</span></div>
        </div>
      )}
      {/* Divider */}
      <div className="border-b mb-3" />
      <div className="mb-2 text-xs text-gray-500 flex items-center gap-2">
        <span>Invoice dikirim:</span> <span className="font-semibold text-gray-700">{invoice.sent_date}</span>
      </div>
      {/* Tabel Invoice */}
      <div className="overflow-x-auto">
        <table className="w-full mb-4 border rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-green-50">
              <th className="text-left px-3 py-2 font-semibold text-green-700">Item</th>
              <th className="text-right px-3 py-2 font-semibold text-green-700">Harga</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items && invoice.items.map((item, idx) => (
              <tr key={idx} className="hover:bg-green-50 transition">
                <td className="px-3 py-2">{item.name}</td>
                <td className="text-right px-3 py-2">Rp {item.price.toLocaleString("id-ID")}</td>
              </tr>
            ))}
            <tr className="font-bold bg-green-100 text-green-800 text-lg">
              <td className="px-3 py-2">Total</td>
              <td className="text-right px-3 py-2">Rp {invoice.total?.toLocaleString("id-ID")}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Tombol Aksi */}
      <div className="flex gap-2 justify-end mt-4">
        <Button
          onClick={handleClick}
          disabled={!isButtonActive}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg shadow transition-all duration-200 text-base font-semibold ${isButtonActive ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-400 text-white cursor-not-allowed"}`}
        >
          <CheckCircle2 className="w-5 h-5" />
          {!isButtonActive ? "Setuju & Lanjutkan" : "Setuju & Lanjutkan"}
        </Button>
        {/* Tombol Bayar muncul jika status menunggu_pembayaran */}
        {pengajuan.status === "menunggu_pembayaran" && (
          <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
            <Button
              onClick={handlePayClick}
              className="flex items-center gap-2 px-5 py-2 rounded-lg shadow bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold"
            >
              <CreditCard className="w-5 h-5" />
              Bayar
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Pembayaran</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-3">
                <CreditCard className="w-10 h-10 text-blue-600" />
                <p className="text-gray-700 mb-4 text-center">Silakan lakukan pembayaran untuk melanjutkan proses.</p>
                {/* Placeholder form/informasi pembayaran */}
                <div className="w-full mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Total Tagihan:</span>
                    <span className="font-bold text-green-700">Rp {invoice.total?.toLocaleString("id-ID")}</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Masukkan nomor rekening / metode pembayaran"
                    className="w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  {/* Upload bukti pembayaran */}
                  <div className="mt-3">
                    <label className="block font-semibold mb-1">Upload Bukti Pembayaran</label>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {paymentProof && (
                      <div className="text-xs text-green-700 mt-1">File: {paymentProof.name}</div>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">Bayar Sekarang</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
