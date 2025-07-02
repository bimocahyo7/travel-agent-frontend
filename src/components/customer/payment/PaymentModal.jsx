import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Check, CreditCard, Wallet, QrCode } from "lucide-react";

const MethodIcon = ({ method }) => {
  switch (method) {
    case "qr":
      return <QrCode className="w-5 h-5" />;
    case "bank":
      return <CreditCard className="w-5 h-5" />;
    case "ewallet":
      return <Wallet className="w-5 h-5" />;
    default:
      return null;
  }
};

export default function PaymentModal({
  isOpen,
  onClose,
  bookingDetails,
  onConfirm,
}) {
  const [paymentCode, setPaymentCode] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("qr");
  const [paymentProof, setPaymentProof] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle, uploading, success, error

  const paymentMethods = {
    qr: {
      name: "QR Code",
      instructions: [
        "Scan QR Code di samping menggunakan aplikasi e-wallet atau m-banking Anda",
        "Pastikan detail pembayaran sudah sesuai",
        "Lakukan pembayaran sesuai nominal yang tertera",
        "Simpan bukti pembayaran",
      ],
    },
    bank: {
      name: "Transfer Bank",
      accounts: [
        { bank: "BCA", number: "1234567890", name: "an : PT Travel Agent" },
        { bank: "Mandiri", number: "0987654321", name: "an : PT Travel Agent" },
      ],
      instructions: [
        "Pilih bank tujuan transfer",
        "Transfer sesuai nominal yang tertera",
        "Simpan bukti transfer",
        "Tunggu tim kami mengonfirmasi pembayaran Anda",
      ],
    },
    ewallet: {
      name: "E-Wallet",
      accounts: [
        { type: "GoPay", number: "081234567890", name: "an : PT Travel Agent" },
        { type: "OVO", number: "081234567890", name: "an : PT Travel Agent" },
      ],
      instructions: [
        "Pilih e-wallet yang diinginkan",
        "Transfer sesuai nominal yang tertera",
        "Simpan bukti pembayaran",
        "Tunggu tim kami mengonfirmasi pembayaran Anda",
      ],
    },
  };

  useEffect(() => {
    if (isOpen) {
      const uniqueCode = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setPaymentCode(uniqueCode);
    }
  }, [isOpen]);

  if (!bookingDetails) return null;

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadStatus("uploading");
      // Simulate upload process
      setTimeout(() => {
        setPaymentProof(file);
        setUploadStatus("success");
      }, 1500);
    }
  };

  const handleConfirmPayment = () => {
    if (!paymentProof) return;

    onConfirm(bookingDetails);
    alert(
      "Pesanan berhasil dibuat! Tunggu tim kami untuk mengkonfirmasi pesanan anda",
    ); // Simple notification

    // Redirect after notification
    window.location.href = "http://localhost:3000/pesanan-saya";
  };

  const renderUploadSection = () => (
    <div className="mt-6 p-4 border-2 border-dashed rounded-lg bg-gray-50">
      <div className="text-center">
        {uploadStatus === "success" ? (
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <Check className="w-5 h-5" />
            <span>Bukti pembayaran berhasil diunggah</span>
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-8 w-8 text-gray-400" />
            <div className="mt-2">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-600">
                  Upload bukti pembayaran
                </span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <span className="mt-1 block text-xs text-gray-500">
                  PNG, JPG, JPEG up to 2MB
                </span>
              </label>
            </div>
          </>
        )}
      </div>
      {paymentProof && (
        <div className="mt-4 p-2 bg-white rounded border flex items-center justify-between">
          <span className="text-sm truncate">{paymentProof.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPaymentProof(null);
              setUploadStatus("idle");
            }}
          >
            Hapus
          </Button>
        </div>
      )}
    </div>
  );

  const renderPaymentMethod = () => {
    const commonClasses =
      "bg-white p-6 rounded-lg shadow-sm border transition-all hover:shadow-md";

    switch (selectedMethod) {
      case "qr":
        return (
          <div className={commonClasses}>
            <div className="flex flex-col items-center justify-center">
              <div className="mb-4 p-4 bg-white rounded-lg shadow-inner">
                <QRCodeCanvas value={paymentCode} size={200} />
              </div>
              <p className="text-center mb-4">
                <span className="text-sm text-gray-600">Kode Pembayaran:</span>
                <br />
                <span className="font-mono font-bold text-lg">
                  {paymentCode}
                </span>
              </p>
              {renderUploadSection()}
            </div>
          </div>
        );
      case "bank":
        return (
          <div className={commonClasses}>
            <div className="space-y-4">
              {paymentMethods.bank.accounts.map((account, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-blue-800">{account.bank}</p>
                    <p className="text-xs px-2 py-1 bg-blue-200 rounded-full text-blue-800">
                      {account.name}
                    </p>
                  </div>
                  <p className="font-mono text-lg mt-2">{account.number}</p>
                </div>
              ))}
              {renderUploadSection()}
            </div>
          </div>
        );
      case "ewallet":
        return (
          <div className={commonClasses}>
            <div className="space-y-4">
              {paymentMethods.ewallet.accounts.map((account, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-purple-800">{account.type}</p>
                    <p className="text-xs px-2 py-1 bg-purple-200 rounded-full text-purple-800">
                      {account.name}
                    </p>
                  </div>
                  <p className="font-mono text-lg mt-2">{account.number}</p>
                </div>
              ))}
              {renderUploadSection()}
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl w-[95vw] h-[95vh] max-w-7xl flex flex-col shadow-2xl overflow-auto">
          {/* Header */}
          <div className="p-6 border-b bg-white/80 backdrop-blur-md">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Detail Pembayaran
            </h3>

            <div className="mt-4 flex flex-wrap gap-3">
              {Object.entries(paymentMethods).map(([key, method]) => (
                <Button
                  key={key}
                  variant={selectedMethod === key ? "default" : "outline"}
                  onClick={() => setSelectedMethod(key)}
                  className={`flex items-center space-x-2 ${
                    selectedMethod === key
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                  }`}
                >
                  <MethodIcon method={key} />
                  <span>{method.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Column - Payment Details */}
              <div className="backdrop-blur-md bg-white/50 p-4 rounded-xl shadow-lg flex flex-col">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-green-700">Nama Pemesan</span>
                    <span className="font-semibold">
                      {bookingDetails.customerName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm text-yellow-700">Kendaraan</span>
                    <span className="font-semibold">
                      {bookingDetails.vehicle.name} -{" "}
                      {bookingDetails.vehicle.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-blue-700">Destinasi</span>
                    <span className="font-semibold">
                      {bookingDetails.destination}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm text-purple-700">Tanggal</span>
                    <span className="font-semibold">{bookingDetails.date}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                    <span className="text-sm text-pink-700">
                      Jumlah Penumpang
                    </span>
                    <span className="font-semibold">
                      {bookingDetails.passengers}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
                    <span className="text-sm">Total Pembayaran</span>
                    <span className="font-bold text-lg">
                      Rp {bookingDetails.total.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <div className="mt-4 bg-white/80 rounded-lg p-4 flex-1">
                  <p className="font-semibold mb-2 text-gray-700">
                    Instruksi Pembayaran:
                  </p>
                  <ol className="space-y-2">
                    {paymentMethods[selectedMethod].instructions.map(
                      (instruction, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-xs">
                            {index + 1}
                          </span>
                          <span className="text-sm text-gray-600">
                            {instruction}
                          </span>
                        </li>
                      ),
                    )}
                  </ol>
                </div>
              </div>

              {/* Right Column - Payment Method */}
              <div className="h-full flex flex-col">
                {renderPaymentMethod()}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-white/80 backdrop-blur-md flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
            >
              Tutup
            </Button>
            <Button
              onClick={handleConfirmPayment}
              disabled={!paymentProof}
              className={`px-6 ${
                paymentProof
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Konfirmasi Pesanan
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
