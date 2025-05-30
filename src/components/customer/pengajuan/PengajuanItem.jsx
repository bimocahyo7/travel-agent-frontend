import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
const STATUS_LABELS = {
  menunggu_konfirmasi: "Menunggu Konfirmasi",
  menunggu_persetujuan: "Menunggu Persetujuan",
  disetujui: "Disetujui",
  dalam_perjalanan: "Dalam Perjalanan",
  menunggu_pembayaran: "Menunggu Pembayaran",
  lunas: "Lunas",
  ditolak: "Ditolak",
};

export default function PengajuanItem({ pengajuan, loadingId }) {
  const router = useRouter();
  const isLoading = loadingId === pengajuan.id;
  // Badge color by status
  const statusColor = {
    menunggu_konfirmasi: "bg-gray-100 text-gray-600",
    menunggu_persetujuan: "bg-yellow-100 text-yellow-700",
    disetujui: "bg-green-100 text-green-700",
    dalam_perjalanan: "bg-blue-100 text-blue-700",
    menunggu_pembayaran: "bg-orange-100 text-orange-700",
    lunas: "bg-green-200 text-green-800",
    ditolak: "bg-red-100 text-red-700",
  }[pengajuan.status] || "bg-gray-100 text-gray-600";

  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 min-w-[270px] flex flex-col justify-between border border-gray-100 transition hover:shadow-xl">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="font-extrabold text-xl text-blue-700">ID: {pengajuan.id}</div>
        </div>
        <hr className="mb-3" />
        <div className="mb-2">
          <span className="font-semibold text-gray-700">Destinasi:</span>
          <span className="ml-1 text-gray-900">{pengajuan.destination}</span>
        </div>
        <div className="mb-2">
          <span className="font-semibold text-gray-700">Status:</span>{" "}
          <span className={`capitalize inline-block px-2 py-1 rounded text-sm font-medium ${statusColor}`}>{STATUS_LABELS[pengajuan.status] || pengajuan.status}</span>
        </div>
      </div>
      <Button
        variant="default"
        className="mt-6 w-full font-semibold text-base"
        onClick={() => router.push(`/pesanan-saya/pengajuan/${pengajuan.id}`)}
        disabled={isLoading}
      >
        Detail
      </Button>
    </div>
  );
} 