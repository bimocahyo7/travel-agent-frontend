import useSWR from "swr";
import axios from "@/lib/axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function usePayment() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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
        setError("Failed to fetch payments");
        console.error("Error fetching payments:", error);
        return [];
      })
  );

  // Add a new payment
  const addPayment = async (paymentData) => {
    try {
      setLoading(true);
      let dataToSend = paymentData;
      let headers = {};
      if (paymentData.bukti_pembayaran instanceof File) {
        dataToSend = new FormData();
        Object.entries(paymentData).forEach(([key, value]) => {
          dataToSend.append(key, value);
        });
        headers['Content-Type'] = 'multipart/form-data';
      }
      const response = await axios.post("/api/payments", dataToSend, { headers });
      await mutate();
      setSuccess("Payment added successfully");
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        router.push("/login");
        return false;
      }
      setError(error.response?.data?.message || "Failed to add payment");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing payment
  const updatePayment = async (id, paymentData) => {
    try {
      setLoading(true);
      let dataToSend = paymentData;
      let headers = {};
      if (paymentData.bukti_pembayaran instanceof File) {
        dataToSend = new FormData();
        Object.entries(paymentData).forEach(([key, value]) => {
          dataToSend.append(key, value);
        });
        headers['Content-Type'] = 'multipart/form-data';
      }
      const response = await axios.put(`/api/payments/${id}`, dataToSend, { headers });
      await mutate();
      setSuccess("Payment updated successfully");
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        router.push("/login");
        return false;
      }
      setError(error.response?.data?.message || "Failed to update payment");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete a payment
  const deletePayment = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/api/payments/${id}`);
      await mutate();
      setSuccess("Payment deleted successfully");
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        router.push("/login");
        return false;
      }
      setError(error.response?.data?.message || "Failed to delete payment");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get a single payment by id
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
      setError("Failed to fetch payment details");
      setLoading(false);
      return null;
    }
  };

  // Clear messages
  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  return {
    payments,
    loading,
    error,
    success,
    addPayment,
    updatePayment,
    deletePayment,
    getPaymentById,
    clearMessages,
    mutate,
  };
}

// Alias for compatibility with existing code
export const usePayments = usePayment;
