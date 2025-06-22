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
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-2 border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{pengajuan.destination}</h3>
            <p className="text-sm text-gray-600 mt-1">Pemohon: {pengajuan.applicant}</p>
            <p className="text-sm text-gray-600 mt-1">Instansi: {pengajuan.institution}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColor}`}>
            {STATUS_LABELS[pengajuan.status] || pengajuan.status}
          </span>
        </div>
        <div className="space-y-2 text-gray-600 mb-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{pengajuan.departure_date} - {pengajuan.return_date}</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{pengajuan.participants} Peserta</span>
          </div>
        </div>
        <Button
          variant="default"
          className="mt-4 w-full font-semibold text-base"
          onClick={() => router.push(`/pesanan-saya/pengajuan/${pengajuan.id}`)}
          disabled={isLoading}
        >
          Detail
        </Button>
      </div>
    </div>
  );
} 