"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePayments } from "@/hooks/payment";
import { toast } from "sonner";

const statusOptions = [
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
  { value: "completed", label: "Completed", color: "bg-green-500" },
  { value: "failed", label: "Failed", color: "bg-red-500" },
];

const EditPaymentDialog = ({ isOpen, onClose, payment }) => {
  const { updatePayment } = usePayments();
  const [status, setStatus] = useState(payment?.status || "pending");
  const [loading, setLoading] = useState(false);
  const [buktiPembayaran, setBuktiPembayaran] = useState(null);

  useEffect(() => {
    setStatus(payment?.status || "pending");
  }, [payment, payment?.status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === payment?.status && !buktiPembayaran) {
      toast.error("Tidak ada perubahan yang disimpan!");
      return;
    }
    try {
      setLoading(true);
      const updateData = { status };
      if (buktiPembayaran) {
        updateData.bukti_pembayaran = buktiPembayaran;
      }
      await updatePayment(payment.id, updateData);
      toast.success("Status pembayaran berhasil diperbarui!");
      onClose();
    } catch (error) {
      console.error("Failed to update payment:", error);
      toast.error(
        error?.response?.data?.message || "Gagal memperbarui status pembayaran!"
      );
    } finally {
      setLoading(false);
    }
  };

  const currentStatus = statusOptions.find(
    (option) => option.value === payment?.status
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Payment Status</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Current Status:</span>
              <span
                className={`px-2 py-1 rounded-md text-white text-sm ${currentStatus?.color}`}
              >
                {payment?.status?.toUpperCase()}
              </span>
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    disabled={option.value === payment?.status}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${option.color}`} />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="px-3 py-2 border rounded-md bg-gray-100 text-gray-700">
              {payment?.amount || "-"}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoice_number">Invoice Number</Label>
            <div className="px-3 py-2 border rounded-md bg-gray-100 text-gray-700">
              {payment?.invoice_number || "-"}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bukti_pembayaran">Bukti Pembayaran (jpg, png, pdf)</Label>
            <Input
              id="bukti_pembayaran"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={e => setBuktiPembayaran(e.target.files[0])}
            />
            {payment?.bukti_pembayaran && (
              <a
                href={
                  payment.bukti_pembayaran.startsWith('http')
                    ? payment.bukti_pembayaran
                    : `/storage/${payment.bukti_pembayaran}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
              >
                Lihat Bukti Pembayaran Saat Ini
              </a>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || status === payment?.status}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPaymentDialog;
