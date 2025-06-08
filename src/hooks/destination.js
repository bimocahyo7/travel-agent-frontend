import useSWR from "swr";
import axios from "@/lib/axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const useDestination = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: destinations, mutate } = useSWR("/api/destinations", () =>
    axios
      .get("/api/destinations")
      .then((res) => res.data.destinations)
      .catch((error) => {
        if (error.response?.status === 401) {
          router.push("/login");
          return [];
        }
        setError("Failed to fetch destinations");
        console.error("Error fetching destinations:", error);
        return [];
      })
  );

  const addDestination = async (data) => {
    try {
      setLoading(true);
      const form = new FormData();
      form.append("name", data.name);
      form.append("location", data.location);
      form.append("description", data.description);
      form.append("price", data.price);
      if (data.image) form.append("image", data.image);

      await axios.post("/api/destinations", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      mutate();
      setSuccess("Destinasi berhasil ditambahkan");
      return true;
    } catch (error) {
      setError(error.response?.data?.message || "Gagal menambahkan destinasi");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateDestination = async (id, data) => {
    try {
      setLoading(true);
      const form = new FormData();
      form.append("_method", "PUT");
      form.append("name", data.name);
      form.append("location", data.location);
      form.append("description", data.description);
      form.append("price", data.price);
      if (data.image) form.append("image", data.image);

      await axios.post(`/api/destinations/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      mutate();
      setSuccess("Destinasi berhasil diperbarui");
      return true;
    } catch (error) {
      setError(error.response?.data?.message || "Gagal memperbarui destinasi");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteDestination = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/api/destinations/${id}`);
      mutate();
      setSuccess("Destinasi berhasil dihapus");
      return true;
    } catch (error) {
      setError(error.response?.data?.message || "Gagal menghapus destinasi");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  return {
    destinations,
    loading,
    error,
    success,
    addDestination,
    updateDestination,
    deleteDestination,
    clearMessages,
  };
};