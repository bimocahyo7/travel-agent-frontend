import React, { useState } from "react";
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
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export default function InvoiceModal({ open, onClose, invoiceData }) {
  const [totalHarga, setTotalHarga] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // Cek apakah invoice sudah pernah dikirim
  const invoiceSent = !!(invoiceData?.sent_date || invoiceData?.invoice_number);

  const handleSendInvoice = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      await axios.post("/api/invoices", {
        pengajuan_id: invoiceData?.id,
        total: totalHarga,
      });
      setSuccess("Invoice berhasil dikirim ke customer!");
      setTotalHarga("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal mengirim invoice. Coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invoice Pengajuan</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-2">
          {/* Tampilkan data invoice di sini */}
          <div><b>ID Pengajuan:</b> {invoiceData?.id}</div>
          <div><b>Instansi:</b> {invoiceData?.institution}</div>
          <div><b>Pemohon:</b> {invoiceData?.applicant}</div>
          <div><b>Tujuan:</b> {invoiceData?.destination}</div>
          <div><b>Tanggal Berangkat:</b> {invoiceData?.departure_date}</div>
          <div><b>Tanggal Kembali:</b> {invoiceData?.return_date}</div>
          <div><b>Peserta:</b> {invoiceData?.participants}</div>
          {/* Tambahkan detail lain sesuai kebutuhan */}
          <form onSubmit={e => { e.preventDefault(); setShowConfirm(true); }} className="space-y-2 pt-4">
            <div>
              <label className="block mb-1 font-medium">Total Harga</label>
              <input
                type="number"
                className="border rounded px-2 py-1 w-full"
                value={totalHarga}
                onChange={(e) => setTotalHarga(e.target.value)}
                required
                min={0}
                disabled={invoiceSent}
              />
            </div>
            {invoiceSent && (
              <div className="text-blue-600 text-sm font-semibold">Invoice sudah pernah dikirim dan tidak dapat dikirim ulang.</div>
            )}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button type="submit" disabled={loading || !totalHarga || invoiceSent}>
              {loading ? "Mengirim..." : "Kirim Invoice ke Customer"}
            </Button>
          </form>
          <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Konfirmasi Kirim Invoice</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin mengirim invoice ke customer dengan total harga <b>{totalHarga}</b>?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    onClick={async () => {
                      setShowConfirm(false);
                      await handleSendInvoice(new Event("submit", { cancelable: true }));
                    }}
                    disabled={loading || invoiceSent}
                  >
                    Ya, Kirim Invoice
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
