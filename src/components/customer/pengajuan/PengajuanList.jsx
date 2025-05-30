import React from "react";
import PengajuanItem from "./PengajuanItem";

export default function PengajuanList({ pengajuans, onApprove, loadingId }) {
  return (
    <div className="flex flex-row space-x-6 overflow-x-auto p-6 max-w-full">
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