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
  const statusLabel = (status) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option ? option.label : status || "-";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detail Pengajuan</DialogTitle>
        </DialogHeader>
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
          <div>
            <span className="text-gray-500 text-xs">ID Pengajuan</span>
            <div className="font-semibold text-lg">{pengajuanData?.id}</div>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Instansi</span>
            <div className="font-medium">{pengajuanData?.institution}</div>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Pemohon</span>
            <div className="font-medium">{pengajuanData?.applicant}</div>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Email</span>
            <div className="font-medium">{pengajuanData?.email}</div>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Tujuan</span>
            <div className="font-medium">{pengajuanData?.destination}</div>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Kendaraan</span>
            <div className="font-medium">{pengajuanData?.vehicle_type}</div>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Tanggal Berangkat</span>
            <div className="font-medium">{pengajuanData?.departure_date}</div>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Tanggal Kembali</span>
            <div className="font-medium">{pengajuanData?.return_date}</div>
          </div>
          <div className="sm:col-span-2">
            <span className="text-gray-500 text-xs">Peserta</span>
            <div className="font-medium">{pengajuanData?.participants}</div>
          </div>
          <div className="sm:col-span-2">
            <span className="text-gray-500 text-xs">Catatan</span>
            <div className="font-medium">{pengajuanData?.notes}</div>
          </div>
          <div className="sm:col-span-2 flex items-center gap-2 mt-2">
            <span className="text-gray-500 text-xs">Status</span>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${pengajuanData?.status === 'ditolak' ? 'bg-red-100 text-red-700' : pengajuanData?.status === 'lunas' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{statusLabel(pengajuanData?.status)}</span>
          </div>
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