import React from "react";
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
import { toast } from "react-hot-toast";

export default function PaymentReceivedModal({ open, onClose, pengajuanId }) {
  const [loading, setLoading] = React.useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      await axios.post(`/api/pengajuan/${pengajuanId}/resend-payment-received`);
      toast.success("Email pembayaran diterima berhasil dikirim!");
      onClose();
    } catch {
      toast.error("Gagal mengirim email pembayaran diterima!");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi Pembayaran Diterima</DialogTitle>
        </DialogHeader>
        <div>
          Pastikan Anda telah memeriksa bukti pembayaran dengan teliti sebelum
          mengubah status menjadi <b>Pembayaran Diterima</b>. Tindakan ini akan
          mengirimkan email konfirmasi kepada customer.
          <br />
          <br />
          Apakah Anda yakin ingin melanjutkan?
        </div>
        <DialogFooter>
          <Button
            onClick={handleSend}
            disabled={loading}
            className="bg-green-600 text-white"
          >
            {loading ? "Mengirim..." : "Ya, Kirim Email"}
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}