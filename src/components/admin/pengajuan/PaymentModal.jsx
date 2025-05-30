import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PaymentModal({ open, onClose, pengajuanId }) {
  const [barcode, setBarcode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      axios
        .get(`/api/paymentsub/barcode/${pengajuanId}`)
        .then(res => setBarcode(res.data.barcode))
        .catch(() => setBarcode(null))
        .finally(() => setLoading(false));
    }
  }, [open, pengajuanId]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("pengajuan_id", pengajuanId);
    formData.append("amount_paid", 0); // Atur sesuai kebutuhan
    formData.append("method", "transfer_bank"); // Atur sesuai kebutuhan
    formData.append("path_file", file);

    try {
      await axios.post("/api/paymentsub", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Bukti pembayaran berhasil diupload!");
      onClose();
    } catch {
      alert("Gagal upload bukti pembayaran");
    }
    setUploading(false);
  };

  if (!open) return null;
  return (
    <div className="modal">
      <h2>Pembayaran</h2>
      {loading && <p>Loading barcode...</p>}
      {!loading && barcode && (
        <img src={`data:image/png;base64,${barcode}`} alt="Barcode Pembayaran" />
      )}
      {!loading && !barcode && <p>Barcode tidak ditemukan.</p>}
      <div>
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button onClick={handleUpload} disabled={uploading || !file}>
          {uploading ? "Uploading..." : "Upload Bukti Pembayaran"}
        </button>
      </div>
      <button onClick={onClose}>Tutup</button>
    </div>
  );
}
