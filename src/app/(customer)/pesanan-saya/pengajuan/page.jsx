"use client";
import React, { useState } from "react";
import { usePengajuan } from "@/hooks/pengajuan";
import PengajuanList from "@/components/customer/pengajuan/PengajuanList";

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
