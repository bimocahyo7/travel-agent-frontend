"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useSWR from "swr";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

export function useBooking() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // SWR for simple auto-updated bookings list
  const { data: bookings, mutate } = useSWR("/api/bookings", async () => {
    try {
      const res = await axios.get("/api/bookings");
      return res.data.data;
    } catch (error) {
      if (error.response?.status === 401) {
        router.push("/login");
        return [];
      }
      setError("Failed to fetch bookings");
      console.error("Error fetching bookings:", error);
      return [];
    }
  });

  // Get single booking (manually)
  const getBooking = async (id) => {
    try {
      const response = await axios.get(
        `/api/bookings/${id}?include=payment,user,package,vehicle,transaction`,
      );
      const booking = response.data.data;

      console.log("Booking detail structure:", {
        hasPackage: !!booking.package,
        hasPayment: !!booking.payment,
        hasVehicle: !!booking.vehicle,
        hasUser: !!booking.user,
        hasTransaction: !!booking.transaction,
      });

      return booking;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch booking");
      throw error;
    }
  };

  // Add booking
  const addBooking = async (data) => {
    try {
      setLoading(true);
      const form = new FormData();
      form.append("user_id", data.user_id);
      form.append("package_id", data.package_id);
      form.append("vehicle_id", data.vehicle_id);
      form.append("booking_date", data.booking_date);
      form.append("jumlah_penumpang", data.jumlah_penumpang);
      form.append("total_price", data.total_price);

      await axios.post("/api/bookings", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      mutate(); // revalidate list
      setSuccess("Booking berhasil ditambahkan");
      return true;
    } catch (error) {
      setError(error.response?.data?.message || "Gagal menambahkan booking");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update booking
  const updateBooking = async (id, data) => {
    try {
      setLoading(true);
      await axios.put(`/api/bookings/${id}`, data);
      await mutate();
      setSuccess("Booking berhasil diperbarui");
      return true;
    } catch (error) {
      setError(error.response?.data?.message || "Gagal memperbarui booking");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete booking
  const deleteBooking = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/api/bookings/${id}`);
      mutate();
      setSuccess("Booking berhasil dihapus");
      return true;
    } catch (error) {
      setError(error.response?.data?.message || "Gagal menghapus booking");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      setLoading(true);
      await axios.put(`/api/bookings/${id}`, { status });
      mutate();
      setSuccess("Status booking berhasil diperbarui");
      return true;
    } catch (error) {
      setError(error.response?.data?.message || "Gagal memperbarui status");
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
    bookings,
    loading,
    error,
    success,
    addBooking,
    updateBooking,
    deleteBooking,
    updateBookingStatus,
    getBooking,
    clearMessages,
  };
}
