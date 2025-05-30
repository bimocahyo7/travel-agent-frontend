"use client";
import React, { useState } from "react";
import { usePengajuan } from "@/hooks/pengajuan";
import PengajuanList from "@/components/customer/pengajuan/PengajuanList";

const STATUS_LABELS = {
  menunggu_konfirmasi: "Menunggu Konfirmasi",
  menunggu_persetujuan: "Menunggu Persetujuan",
  disetujui: "Disetujui",
  dalam_perjalanan: "Dalam Perjalanan",
  menunggu_pembayaran: "Pembayaran",
  lunas: "Lunas",
  ditolak: "Ditolak",
};

export default function PengajuanPage() {
  const { pengajuans, loading, error, updatePengajuan } = usePengajuan();
  const [loadingId, setLoadingId] = useState(null);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!pengajuans.length) return <div>Tidak ada pengajuan.</div>;

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

  const handleApprove = async (pengajuan) => {
    const nextStatus = getNextStatus(pengajuan.status);
    if (!nextStatus) return;
    setLoadingId(pengajuan.id);
    await updatePengajuan(pengajuan.id, { status: nextStatus });
    setLoadingId(null);
  };

  return (
    <>
      <PengajuanList
        pengajuans={pengajuans}
        onApprove={handleApprove}
        loadingId={loadingId}
      />
    </>
  );
}

function Step({ active, label }) {
  return (
    <div className="flex items-center">
      <span
        className={`rounded-full border-2 w-6 h-6 flex items-center justify-center ${
          active ? "border-green-500 bg-green-100" : "border-gray-300 bg-white"
        }`}
      >
        {active ? (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
        )}
      </span>
      <span className={`ml-2 font-semibold ${active ? "text-green-600" : "text-gray-500"}`}>{label}</span>
      <span className="mx-2 text-gray-400">{label !== "Dalam Perjalanan" && "→"}</span>
    </div>
  );
}
