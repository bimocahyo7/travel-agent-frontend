import React from "react";
import Step from "./Step";
import InvoiceCustomer from "./InvoiceCustomer";
import { useInvoice } from "@/hooks/invoice";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const STATUS_LABELS = {
  menunggu_konfirmasi: "Menunggu Konfirmasi",
  menunggu_persetujuan: "Menunggu Persetujuan",
  disetujui: "Disetujui",
  dalam_perjalanan: "Dalam Perjalanan",
  menunggu_pembayaran: "Menunggu Pembayaran",
  lunas: "Lunas",
  ditolak: "Ditolak",
};

export default function PengajuanDetailModal({ pengajuan, onClose, onApprove, loadingId }) {
  const open = !!pengajuan;
  const { invoice, loading: invoiceLoading } = useInvoice(pengajuan?.id);
  if (!open) return null;
  const showInvoice = [
    "menunggu_persetujuan",
    "disetujui",
    "dalam_perjalanan",
    "menunggu_pembayaran",
    "lunas",
    "ditolak",
  ].includes(pengajuan.status);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-none w-screen sm:w-[98vw] bg-white/95 border border-gray-200 shadow-2xl p-4 sm:p-8 overflow-x-auto max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-2xl font-bold text-blue-700 mb-2">Detail Pengajuan</DialogTitle>
        <div className="text-gray-500 text-sm mb-4">ID: {pengajuan.id}</div>
        <hr className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-6">
          <div>
            <div className="font-semibold">Destinasi:</div>
            <div>{pengajuan.destination}</div>
          </div>
          <div>
            <div className="font-semibold">Tanggal Berangkat:</div>
            <div>{pengajuan.departure_date}</div>
          </div>
          <div>
            <div className="font-semibold">Tanggal Pulang:</div>
            <div>{pengajuan.return_date}</div>
          </div>
          <div>
            <div className="font-semibold">Peserta:</div>
            <div>{pengajuan.participants}</div>
          </div>
          <div className="md:col-span-2">
            <div className="font-semibold">Status:</div>
            <div className="capitalize inline-block px-2 py-1 rounded bg-blue-50 text-blue-700 font-medium">{STATUS_LABELS[pengajuan.status] || pengajuan.status}</div>
          </div>
          <div className="md:col-span-2 text-xs text-gray-400 mt-2">Diajukan pada: {pengajuan.created_at}</div>
        </div>
        <hr className="mb-4" />
        {/* Stepper */}
        <div className="flex items-center space-x-2 mb-6 overflow-x-auto px-2 pb-2">
          <Step active label="Diajukan" />
          <Step
            active={[
              "menunggu_persetujuan",
              "disetujui",
              "dalam_perjalanan",
              "menunggu_pembayaran",
              "lunas",
              "ditolak",
            ].includes(pengajuan.status)}
            label="Invoice Dikirim"
          />
          <Step
            active={[
              "disetujui",
              "dalam_perjalanan",
              "menunggu_pembayaran",
              "lunas",
              "ditolak",
            ].includes(pengajuan.status)}
            label="Disetujui"
          />
          <Step
            active={[
              "dalam_perjalanan",
              "menunggu_pembayaran",
              "lunas",
              "ditolak",
            ].includes(pengajuan.status)}
            label="Dalam Perjalanan"
          />
          <Step
            active={[
              "menunggu_pembayaran",
              "lunas",
              "ditolak",
            ].includes(pengajuan.status)}
            label="Menunggu Pembayaran"
          />
          <Step
            active={pengajuan.status === "lunas"}
            label="Lunas"
          />
          <Step
            active={pengajuan.status === "ditolak"}
            label="Ditolak"
            rejected={pengajuan.status === "ditolak"}
            disabled={pengajuan.status === "lunas"}
          />
        </div>
        <hr className="mb-4" />
        {/* Invoice */}
        {showInvoice && (
          invoiceLoading ? (
            <div>Loading invoice...</div>
          ) : (
            invoice && <InvoiceCustomer invoice={invoice} pengajuan={pengajuan} onNextStep={() => onApprove(pengajuan)} disabled={loadingId === pengajuan.id} />
          )
        )}
      </DialogContent>
    </Dialog>
  );
} 