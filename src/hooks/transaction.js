import useSWR from "swr";
import axios from "@/lib/axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const useTransaction = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch transactions with relationships (user and payment)
  const { data: transactions, mutate } = useSWR("/api/transactions", () =>
    axios
      .get("/api/transactions?include=user,payment") // Tambahkan query parameter include
      .then((res) => res.data)
      .catch((error) => {
        if (error.response?.status === 401) {
          router.push("/login");
          return [];
        }
        setError("Failed to fetch transactions");
        console.error("Error fetching transactions:", error);
        return [];
      })
  );

  // Only handle status updates
  const updateTransactionStatus = async (id, status) => {
    try {
      setLoading(true);
      await axios.put(`/api/transactions/${id}`, { status });
      await mutate(); // Refresh data after update
      setSuccess("Status transaksi berhasil diperbarui");
      return true;
    } catch (error) {
      const message = error.response?.data?.message || "Gagal memperbarui status transaksi";
      setError(message);
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
    transactions,
    loading,
    error,
    success,
    updateTransactionStatus,
    clearMessages,
  };
};