import useSWR from "swr";
import axios from "@/lib/axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Hook role customer - mendapatkan invoice berdasarkan pengajuan_id
export const useInvoice = (pengajuanId) => {
  const shouldFetch = !!pengajuanId;
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `/api/invoice/by-pengajuan/${pengajuanId}` : null,
    async (url) => {
      const res = await axios.get(url);
      // Handle kemungkinan struktur data
      if (res.data?.invoice) return res.data.invoice;
      if (res.data?.data) return res.data.data;
      return res.data;
    },
  );

  return {
    invoice: data,
    isLoading,
    isError: error,
    mutate,
  };
};

// Hook role admin - mendapatkan semua invoice dan aksi CRUD
export const useInvoices = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    data: invoices,
    mutate,
    isLoading,
  } = useSWR("/api/invoices", () =>
    axios
      .get("/api/invoices")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response?.status === 401) {
          router.push("/login");
          return [];
        }
        setError("Failed to fetch invoices");
        console.error("Error fetching invoices:", error);
        return [];
      }),
  );

  // Delete invoice (Fitur Opsional)
  const deleteInvoice = async (id) => {
    try {
      await axios.delete(`/api/invoices/${id}`);
      setSuccess("Invoice deleted successfully");
      mutate();
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        router.push("/login");
        return false;
      }
      setError(error.response?.data?.message || "Failed to delete invoice");
      return false;
    }
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  return {
    invoices,
    loading: isLoading,
    error,
    success,
    deleteInvoice,
    clearMessages,
  };
};
