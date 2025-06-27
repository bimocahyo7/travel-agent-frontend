import { useState, useEffect } from "react";
import axios from "@/lib/axios";

export function usePaymentsub() {
  const [notifications, setNotifications] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [barcodeDetails, setBarcodeDetails] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Fetch all payment subs
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/paymentsub");
      setPayments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get("/api/notifications/paymentsub");
      setNotifications(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Store payment sub
  const storePayment = async (formData) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/paymentsub", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchPayments();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get single payment details by pengajuan_id
  const getPaymentDetails = async (pengajuanId) => {
    try {
      setLoading(true);
      // Change the endpoint to get by pengajuan_id
      const { data } = await axios.get(
        `/api/paymentsub/by-pengajuan/${pengajuanId}`,
      );
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update payment
  const updatePayment = async (id, payload) => {
    try {
      setLoading(true);
      const { data } = await axios.put(`/api/paymentsub/${id}`, payload);
      await fetchPayments();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete payment
  const deletePayment = async (id) => {
    try {
      await axios.delete(`/api/paymentsub/${id}`);
      await fetchPayments();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Generate barcode
  const generateBarcode = async (payload) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/paymentsub/generate-barcode",
        payload,
      );
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get barcode by pengajuan ID
  const getBarcodeByPengajuan = async (pengajuanId) => {
    try {
      const { data } = await axios.get(
        `/api/paymentsub/barcode/${pengajuanId}`,
      );
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Verify payment
  const verifyPayment = async (id, payload) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `/api/paymentsub/verify/${id}`,
        payload,
      );
      await fetchPayments();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get payment status
  const getPaymentStatus = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/paymentsub/${id}`);
      setPaymentStatus({
        status: data.status || "belum_lunas",
        verifiedBy: data.verified_by,
        verifiedAt: data.verified_at,
        amountPaid: data.amount_paid,
      });
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get barcode details
  const getBarcodeDetails = async (pengajuanId) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/paymentsub/barcode/${pengajuanId}`,
      );
      setBarcodeDetails(data.barcode);
      return data;
    } catch (err) {
      setError(err.message);
      setBarcodeDetails(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear barcode details
  const clearBarcodeDetails = () => {
    setBarcodeDetails(null);
  };

  // Check payment status by pengajuan ID
  const checkPaymentStatus = async (pengajuanId) => {
    try {
      const { data } = await axios.get(`/api/paymentsub/status/${pengajuanId}`);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchNotifications();
  }, []);

  return {
    payments,
    notifications,
    loading,
    error,
    barcodeDetails,
    paymentStatus,
    fetchPayments,
    fetchNotifications,
    storePayment,
    getPaymentDetails,
    updatePayment,
    deletePayment,
    generateBarcode,
    getBarcodeByPengajuan,
    verifyPayment,
    getPaymentStatus,
    getBarcodeDetails,
    clearBarcodeDetails,
    checkPaymentStatus,
  };
}
