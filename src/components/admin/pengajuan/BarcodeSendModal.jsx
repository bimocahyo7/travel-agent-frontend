import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";

export default function BarcodeSendModal({ open, onClose, pengajuanId, onSuccess }) {
  const [totalHarga, setTotalHarga] = useState("");
  const [barcode, setBarcode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && pengajuanId) {
      setLoadingInvoice(true);
      axios
        .get(`/api/invoice/by-pengajuan/${pengajuanId}`)
        .then((res) => {
          if (res.data && (res.data.total_harga || res.data.total)) {
            setTotalHarga(res.data.total_harga || res.data.total);
          } else {
            setTotalHarga("");
            setError("Invoice ditemukan, tapi data total pembayaran tidak tersedia. Cek struktur response backend.");
          }
        })
        .catch((err) => {
          setTotalHarga("");
          if (err.response && err.response.status === 404) {
            setError("Invoice belum dibuat untuk pengajuan ini. Silakan kirim invoice terlebih dahulu.");
          } else if (err.response) {
            setError(`Gagal mengambil data invoice. [${err.response.status}] ${err.response.data?.message || ""}`);
          } else {
            setError("Tidak dapat mengambil data invoice. (Network/Server error)");
          }
        })
        .finally(() => setLoadingInvoice(false));
      setBarcode(null);
    }
  }, [open, pengajuanId]);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/paymentsub/generate-barcode", {
        pengajuan_id: pengajuanId,
        value: totalHarga,
      });
      setBarcode(res.data.barcode_base64);
      if (onSuccess) onSuccess(res.data);
    } catch {
      setError("Gagal generate barcode");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Barcode Pembayaran</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-2">
          {loadingInvoice ? (
            <div>Memuat data invoice...</div>
          ) : totalHarga ? (
            <>
              <div>
                <b>Total Pembayaran:</b> Rp{Number(totalHarga).toLocaleString("id-ID")}
              </div>
              <Button onClick={handleGenerate} disabled={loading || !totalHarga || barcode} className="my-2">
                {loading ? "Generating..." : "Generate Barcode"}
              </Button>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              {barcode && (
                <div className="flex flex-col items-center">
                  <img src={`data:image/png;base64,${barcode}`} alt="Barcode" className="my-4 max-w-xs" />
                  <div className="text-green-600 text-sm">Barcode berhasil dibuat!</div>
                </div>
              )}
            </>
          ) : (
            <div className="text-red-600 text-sm">{error || "Tidak dapat mengambil data invoice."}</div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Tutup</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
