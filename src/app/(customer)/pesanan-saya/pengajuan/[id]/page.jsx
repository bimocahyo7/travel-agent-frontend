"use client";
import React from "react";
import { useRouter, useParams } from "next/navigation";
import Step from "@/components/customer/pengajuan/Step";
import InvoiceCustomer from "@/components/customer/pengajuan/InvoiceCustomer";
import { useInvoice } from "@/hooks/invoice";
import { usePengajuan } from "@/hooks/pengajuan";
import { exportPengajuanPdf } from "@/lib/exportPdf";

const STATUS_LABELS = {
  menunggu_konfirmasi: "Menunggu Konfirmasi",
  menunggu_persetujuan: "Menunggu Persetujuan",
  disetujui: "Disetujui",
  dalam_perjalanan: "Dalam Perjalanan",
  menunggu_pembayaran: "Pembayaran",
  lunas: "Lunas",
  ditolak: "Ditolak",
};

export default function PengajuanDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { pengajuans, loading, error, updatePengajuan } = usePengajuan();
  const [loadingId, setLoadingId] = React.useState(null);
  const { invoice, loading: invoiceLoading } = useInvoice(id);

  const pengajuan = pengajuans.find((p) => String(p.id) === String(id));

  // Function to handle PDF export (placeholder)
  const handleExportPdf = () => {
    if (!pengajuan) return;
    exportPengajuanPdf({ pengajuan, invoice });
  };

  // Fungsi untuk menentukan status selanjutnya
  const getNextStatus = (status) => {
    switch (status) {
      case "menunggu_persetujuan":
        return "disetujui";
      case "menunggu_pembayaran":
        return "lunas";
      default:
        return null;
    }
  };

  // Fungsi approve (bisa disesuaikan dengan kebutuhan project)
  const handleApprove = async () => {
    if (!pengajuan) return;
    const nextStatus = getNextStatus(pengajuan.status);
    if (!nextStatus) return;
    setLoadingId(pengajuan.id);
    // TODO: Ganti dengan API update status pengajuan
    await updatePengajuan(pengajuan.id, { status: nextStatus });
    setLoadingId(null);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!pengajuan) return <div className="p-8 text-center text-red-500">Pengajuan tidak ditemukan</div>;

  const showInvoice = [
    "menunggu_persetujuan",
    "disetujui",
    "dalam_perjalanan",
    "menunggu_pembayaran",
    "lunas",
    "ditolak",
  ].includes(pengajuan.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 flex flex-col items-center">
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-blue-700 mb-2">Detail Pengajuan</h1>
          <div className="flex space-x-2">
            <button
              onClick={handleExportPdf}
              className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white text-sm"
            >
              Export PDF
            </button>
            <button onClick={() => router.back()} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm">Kembali</button>
          </div>
        </div>
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
          />
        </div>
        <hr className="mb-4" />
        {/* Invoice */}
        {showInvoice && (
          invoiceLoading ? (
            <div>Loading invoice...</div>
          ) : (
            invoice && <InvoiceCustomer invoice={invoice} pengajuan={pengajuan} onNextStep={handleApprove} disabled={loadingId === pengajuan.id} />
          )
        )}
      </div>
    </div>
  );
} 