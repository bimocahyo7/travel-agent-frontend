import React, { useState } from "react";
import { usePengajuan } from "@/hooks/pengajuan";
import { toast } from "react-hot-toast";

export default function UpdateStatusPengajuan({ id, status, onStatusChange }) {
  const { updatePengajuan, loading } = usePengajuan();
  const [localStatus, setLocalStatus] = useState(status);

  const handleChange = async (newStatus) => {
    setLocalStatus(newStatus);
    const result = await updatePengajuan(id, { status: newStatus });
    if (result && onStatusChange) {
      onStatusChange(newStatus);
      toast.success("Status berhasil diupdate");
    }
  };

  return null; // UI will be handled in the table cell, this is just a handler
}
