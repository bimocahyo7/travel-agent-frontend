import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";

export default function PaymentSection({ pengajuan, invoice }) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProof, setPaymentProof] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("transfer_bank");
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [barcode, setBarcode] = useState(null);
  const [loadingBarcode, setLoadingBarcode] = useState(false);

  const paymentMethods = [
    { value: "transfer_bank", label: "Transfer Bank" },
    { value: "cash", label: "Cash" },
    { value: "credit_card", label: "Credit Card" },
    { value: "debit_card", label: "Debit Card" },
    { value: "e_wallet", label: "E-Wallet" },
  ];

  useEffect(() => {
    const loadBarcode = async () => {
      if (pengajuan.status === "menunggu_pembayaran") {
        setLoadingBarcode(true);
        try {
          const res = await axios.get(
            `/api/paymentsub/barcode/${pengajuan.id}`,
          );
          if (res.data?.barcode) {
            setBarcode(res.data.barcode);
          }
        } catch (err) {
          console.error("Failed to load barcode:", err);
        } finally {
          setLoadingBarcode(false);
        }
      }
    };

    loadBarcode();
  }, [pengajuan.id, pengajuan.status]);

  const handleFileChange = (e) => {
    setPaymentProof(e.target.files[0]);
  };

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
    <div>
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <Button
          onClick={() => setShowPaymentModal(true)}
          disabled={paymentSubmitted}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow text-sm font-medium ${
            paymentSubmitted
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          {paymentSubmitted ? "Pembayaran Terkirim" : "Bayar"}
        </Button>

        <DialogContent className="max-w-sm mx-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-lg">
              Pembayaran
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-2 p-3">
            <CreditCard className="w-6 h-6 text-blue-600" />
            <p className="text-sm text-gray-700 text-center">
              Silakan lakukan pembayaran untuk melanjutkan proses.
            </p>

            {/* Barcode Section */}
            {loadingBarcode ? (
              <div className="text-sm text-center py-1">
                Memuat kode pembayaran...
              </div>
            ) : barcode ? (
              <div className="flex flex-col items-center my-2">
                <img
                  src={`data:image/png;base64,${barcode}`}
                  alt="Payment QR Code"
                  className="max-w-[150px] mb-1"
                />
                <p className="text-xs text-gray-600">
                  Scan QR Code untuk melakukan pembayaran
                </p>
              </div>
            ) : null}

            {/* Form pembayaran */}
            <div className="w-full space-y-2">
              <div>
                <label className="block text-xs font-medium mb-1">
                  Metode Pembayaran
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full text-sm border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                >
                  {paymentMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">
                  Upload Bukti Pembayaran
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="block w-full text-xs file:mr-2 file:py-1 file:px-2 file:text-xs file:rounded file:border-0 file:font-medium file:bg-blue-50 file:text-blue-700"
                />
                {paymentProof && (
                  <div className="text-xs text-green-700 mt-1">
                    File: {paymentProof.name}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-3">
            <Button
              onClick={handleUpload}
              disabled={uploading || !paymentProof || paymentSubmitted}
              className={`w-full py-1.5 text-sm ${
                paymentSubmitted
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white font-medium`}
            >
              {uploading
                ? "Uploading..."
                : paymentSubmitted
                  ? "Pembayaran Terkirim"
                  : "Bayar Sekarang"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {paymentSubmitted && (
        <div className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded-md flex items-center mt-2">
          <svg
            className="w-3 h-3 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Menunggu verifikasi pembayaran oleh admin
        </div>
      )}
    </div>
  );
}
