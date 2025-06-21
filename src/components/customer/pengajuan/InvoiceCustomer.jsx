import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText } from "lucide-react";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";
import PaymentSection from "./PaymentSection";

export default function InvoiceCustomer({
  invoice,
  pengajuan,
  onNextStep,
  disabled,
}) {
  if (!invoice) return null;

  const [clicked, setClicked] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProof, setPaymentProof] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("transfer_bank");
  // Tambahkan state untuk tracking status pembayaran
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);

  const paymentMethods = [
    { value: "transfer_bank", label: "Transfer Bank" },
    { value: "cash", label: "Cash" },
    { value: "credit_card", label: "Credit Card" },
    { value: "debit_card", label: "Debit Card" },
    { value: "e_wallet", label: "E-Wallet" },
  ];

  // Contoh logika: button disable jika invoice.total kurang dari 1
  const isButtonDisabled = !invoice.total || invoice.total < 1;

  // Button aktif jika status menunggu_persetujuan
  const isButtonActive =
    pengajuan.status === "menunggu_persetujuan" && !clicked;

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

  // Handler untuk upload bukti pembayaran
  const handleUpload = async () => {
    if (!paymentProof) {
      toast.error("Silakan pilih file untuk diupload.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("pengajuan_id", pengajuan.id);
    formData.append("amount_paid", invoice.total);
    formData.append("method", paymentMethod);
    formData.append("path_file", paymentProof);

    try {
      await axios.post("/api/paymentsub", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Bukti pembayaran berhasil diupload!");
      setPaymentSubmitted(true);
      setShowPaymentModal(false);
    } catch (error) {
      toast.error("Gagal upload bukti pembayaran.");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl mx-auto animate-fade-in">
      {/* Header dengan ikon */}
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <FileText className="text-green-600 w-8 h-8" />
        <span className="font-extrabold text-2xl text-gray-800">Invoice</span>
      </div>

      {/* Info Pengajuan dengan Card Design */}
      {pengajuan && (
        <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-3 text-lg">
            Informasi Pengajuan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="ID Pengajuan" value={pengajuan.id} />
            <InfoItem label="Instansi" value={pengajuan.institution} />
            <InfoItem label="Pemohon" value={pengajuan.applicant} />
            <InfoItem label="Tujuan" value={pengajuan.destination} />
            <InfoItem
              label="Tanggal Berangkat"
              value={new Date(pengajuan.departure_date).toLocaleDateString(
                "id-ID",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}
            />
            <InfoItem
              label="Tanggal Kembali"
              value={new Date(pengajuan.return_date).toLocaleDateString(
                "id-ID",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}
            />
            <div className="md:col-span-2">
              <InfoItem label="Peserta" value={pengajuan.participants} />
            </div>
          </div>
        </div>
      )}

      {/* Tanggal Invoice */}
      <div className="mb-4 p-3 bg-green-50 rounded-lg text-sm text-green-700 flex items-center gap-2">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span>Invoice dikirim: </span>
        <span className="font-semibold">{invoice.sent_date}</span>
      </div>

      {/* Tabel Invoice */}
      <div className="overflow-x-auto">
        <table className="w-full mb-4 border rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-green-50">
              <th className="text-left px-3 py-2 font-semibold text-green-700">
                Item
              </th>
              <th className="text-right px-3 py-2 font-semibold text-green-700">
                Harga
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items &&
              invoice.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-green-50 transition">
                  <td className="px-3 py-2">{item.name}</td>
                  <td className="text-right px-3 py-2">
                    Rp {item.price.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            <tr className="font-bold bg-green-100 text-green-800 text-lg">
              <td className="px-3 py-2">Total</td>
              <td className="text-right px-3 py-2">
                Rp {invoice.total?.toLocaleString("id-ID")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Tombol Aksi */}
      <div className="flex gap-2 justify-end mt-4">
        <Button
          onClick={handleClick}
          disabled={!isButtonActive}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg shadow transition-all duration-200 text-base font-semibold ${
            isButtonActive
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-400 text-white cursor-not-allowed"
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          {!isButtonActive ? "Setuju & Lanjutkan" : "Setuju & Lanjutkan"}
        </Button>

        {/* Render PaymentSection jika status menunggu_pembayaran */}
        {pengajuan.status === "menunggu_pembayaran" && (
          <PaymentSection pengajuan={pengajuan} invoice={invoice} />
        )}
      </div>
    </div>
  );
}

// Komponen untuk Item Informasi
const InfoItem = ({ label, value }) => (
  <div className="flex flex-col space-y-1">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <span className="text-base text-gray-900 font-semibold">{value}</span>
  </div>
);
