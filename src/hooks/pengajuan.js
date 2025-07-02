import useSWR from "swr";
import axios from "@/lib/axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const usePengajuan = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { data, mutate, isLoading } = useSWR("/api/pengajuan", async () => {
    try {
      const res = await axios.get("/api/pengajuan");
      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data?.data)) return res.data.data;
      return [];
    } catch (error) {
      if (error.response?.status === 401) {
        router.push("/login");
        return [];
      }
      setError("Failed to fetch pengajuan");
      return [];
    }
  });

  const pengajuans = Array.isArray(data) ? data : [];

  const addPengajuan = async (data) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const form = new FormData();
      form.append("user_id", data.user_id);
      form.append("institution", data.institution);
      form.append("applicant", data.applicant);
      form.append("email", data.email);
      form.append("destination_id", data.destination_id);
      form.append("vehicle_id", data.vehicle_id);
      form.append("departure_date", data.departure_date);
      form.append("return_date", data.return_date);
      form.append("participants", data.participants);
      if (data.notes) form.append("notes", data.notes);

      const res = await axios.post("/api/pengajuan", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await mutate();
      setSuccess(res.data.message || "Pengajuan berhasil ditambahkan");
      return res.data.pengajuan;
    } catch (error) {
      setError(error.response?.data?.message || "Gagal menambahkan pengajuan");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePengajuan = async (id, data) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const res = await axios.put(`/api/pengajuan/${id}`, data);
      await mutate();
      setSuccess("Pengajuan berhasil diperbarui");
      return res.data;
    } catch (error) {
      setError(error.response?.data?.message || "Gagal memperbarui pengajuan");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deletePengajuan = async (id) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      await axios.delete(`/api/pengajuan/${id}`);
      await mutate();
      setSuccess("Pengajuan berhasil dihapus");
      return true;
    } catch (error) {
      setError(error.response?.data?.message || "Gagal menghapus pengajuan");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleApprove = async (pengajuan) => {
    const nextStatus = getNextStatus(pengajuan.status);
    if (!nextStatus) return;
    setLoadingId(pengajuan.id);
    await updatePengajuan(pengajuan.id, { status: nextStatus });
    setLoadingId(null);
  };

  return {
    pengajuans,
    loading: loading || isLoading,
    error,
    success,
    addPengajuan,
    updatePengajuan,
    deletePengajuan,
    clearMessages,
    handleApprove,
  };
};

export const useVehicles = () => {
  const { data, error, isLoading } = useSWR("/api/vehicles", async () => {
    const res = await axios.get("/api/vehicles");
    return res.data;
  });

  return {
    vehicles: data,
    loading: isLoading,
    error,
  };
};

export const useDestinations = () => {
  const { data, error, isLoading } = useSWR("/api/destinations", async () => {
    const res = await axios.get("/api/destinations");
    return res.data;
  });

  // Debug: log data untuk memastikan strukturnya
  // console.log("Destinations API response:", data);

  // Handle berbagai kemungkinan struktur data
  let destinations = [];
  if (Array.isArray(data)) {
    destinations = data;
  } else if (Array.isArray(data?.data)) {
    destinations = data.data;
  } else if (Array.isArray(data?.destinations)) {
    destinations = data.destinations;
  }

  return {
    destinations,
    loading: isLoading,
    error,
  };
};
