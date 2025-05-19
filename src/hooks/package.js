import useSWR from "swr";
import axios from "@/lib/axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const usePackages = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: packages, mutate } = useSWR("/api/packages", () =>
    axios
      .get("/api/packages")
      .then((res) => res.data.packages)
      .catch((error) => {
        if (error.response?.status === 401) {
          router.push("/login");
          return [];
        }
        setError("Failed to fetch packages");
        console.error("Error fetching packages:", error);
        return [];
      }),
  );

  const addPackages = async (data) => {
    try {
      setLoading(true);
      const form = new FormData();
      form.append("name", data.name);
      form.append("destination_id", data.destination_id);
      form.append("asal", data.asal);
      form.append("keberangkatan_date", data.keberangkatan_date);
      form.append("description", data.description);
      form.append("price", data.price);
      form.append("duration", data.duration);
      if (data.image) form.append("image", data.image);

      await axios.post("/api/packages", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      mutate();
      setSuccess("Paket berhasil ditambahkan");
      return true;
    } catch (error) {
      setError(error.response?.data?.message || "Gagal menambahkan Paket");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePackage = async (id, data) => {
    try {
      setLoading(true);
      const form = new FormData();
      form.append("_method", "PUT");
      form.append("name", data.name);
      form.append("destination_id", data.destination_id);
      form.append("asal", data.asal);
      form.append("keberangkatan_date", data.keberangkatan_date);
      form.append("description", data.description);
      form.append("price", data.price);
      form.append("duration", data.duration);
      if (data.image) form.append("image", data.image);

      await axios.post(`/api/packages/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      mutate();
      setSuccess("Paket berhasil diperbarui");
      return true;
    } catch (error) {
      setError(error.response?.data?.message || "Gagal memperbarui Paket");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deletePackage = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/api/packages/${id}`);
      mutate();
      setSuccess("paket berhasil dihapus");
      return true;
    } catch (error) {
      setError(error.response?.data?.message || "Gagal menghapus paket");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const searchPackages = async (searchData) => {
    try {
      setLoading(true);
      const response = await axios.get("/api/search-packages", {
        params: {
          destination_id: searchData.destination_id,
        },
      });
      return response.data;
    } catch (error) {
      setError("Gagal mencari paket");
      console.error("Search error:", error);
      return { active: false, packages: [] };
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  return {
    packages,
    searchPackages,
    loading,
    error,
    success,
    addPackages,
    updatePackage,
    deletePackage,
    clearMessages,
  };
};
