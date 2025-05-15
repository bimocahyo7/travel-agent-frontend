import useSWR from "swr";
import axios from "@/lib/axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const usePayment = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Payment status enum
  const PAYMENT_STATUS = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed'
  };

  // Fetch all payments
  const { data: payments, mutate } = useSWR("/api/payments", () =>
    axios
      .get("/api/payments")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response?.status === 401) {
          router.push("/login");
          return [];
        }
        setError("Gagal mengambil data pembayaran");
        console.error("Error fetching payments:", error);
        return [];
      })
  );

  // Update an existing payment
  const updatePayment = async (id, paymentData) => {
    try {
      setLoading(true);
      // Ensure status matches enum
      const updatedData = {
        ...paymentData,
        status: paymentData.status === 'completed' ? PAYMENT_STATUS.COMPLETED : paymentData.status
      };
      
      const response = await axios.put(`/api/payments/${id}`, updatedData);
      mutate(); // Refresh the payments data
      setLoading(false);
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        router.push("/login");
        return false;
      }
      setError(error.response?.data?.message || "Gagal memperbarui pembayaran");
      setLoading(false);
      return false;
    }
  };

  // Get a single payment by ID
  const getPaymentById = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/payments/${id}`);
      setLoading(false);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        router.push("/login");
        return null;
      }
      setError(error.response?.data?.message || "Gagal mengambil data pembayaran");
      setLoading(false);
      return null;
    }
  };

  return {
    payments,
    error,
    success,
    loading,
    updatePayment,
    getPaymentById,
    PAYMENT_STATUS,
    setError,
    setSuccess
  };
};

export default usePayment;
