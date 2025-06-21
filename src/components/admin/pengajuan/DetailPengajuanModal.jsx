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

// Daftar status dan label sesuai dengan columns.jsx
const statusOptions = [
  { value: "menunggu_konfirmasi", label: "Menunggu Konfirmasi Admin" },
  { value: "menunggu_persetujuan", label: "Invoice Dikirim ke Customer" },
  { value: "disetujui", label: "Disetujui" },
  { value: "dalam_perjalanan", label: "Dalam Perjalanan Dinas" },
  { value: "menunggu_pembayaran", label: "Pembayaran Dikirim ke Customer" },
  { value: "lunas", label: "Pembayaran Diterima Admin" },
  { value: "ditolak", label: "Pengajuan Ditolak" },
];

export default function DetailPengajuanModal({ open, onClose, pengajuanData }) {
  // Mapping status ke label
  const statusLabel = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : status || '-';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detail Pengajuan</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <div><b>ID Pengajuan:</b> {pengajuanData?.id}</div>
          <div><b>Instansi:</b> {pengajuanData?.institution}</div>
          <div><b>Pemohon:</b> {pengajuanData?.applicant}</div>
          <div><b>Email:</b> {pengajuanData?.email}</div>
          <div><b>Tujuan:</b> {pengajuanData?.destination}</div>
          <div><b>Kendaraan:</b> {pengajuanData?.vehicle_type}</div>
          <div><b>Tanggal Berangkat:</b> {pengajuanData?.departure_date}</div>
          <div><b>Tanggal Kembali:</b> {pengajuanData?.return_date}</div>
          <div><b>Peserta:</b> {pengajuanData?.participants}</div>
          <div><b>Catatan:</b> {pengajuanData?.notes}</div>
          <div><b>Status:</b> {statusLabel(pengajuanData?.status)}</div>
          <div><b>Bukti Pembayaran:</b> {pengajuanData?.payment_proof}</div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => alert('Export PDF belum diimplementasikan')}>Export PDF</Button>
          <DialogClose asChild>
            <Button variant="outline">Tutup</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 