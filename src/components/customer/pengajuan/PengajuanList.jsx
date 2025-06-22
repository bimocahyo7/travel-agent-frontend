import React from "react";
import PengajuanItem from "./PengajuanItem";

export default function PengajuanList({ pengajuans, onApprove, loadingId }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-5xl mx-auto">
      {pengajuans.map((pengajuan) => (
        <PengajuanItem
          key={pengajuan.id}
          pengajuan={pengajuan}
          onApprove={onApprove}
          loadingId={loadingId}
        />
      ))}
    </div>
  );
} 