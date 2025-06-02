"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

export function useBooking() {
  const queryClient = useQueryClient();
  const [error, setError] = useState(null);

  // Get all bookings
  const { data: bookings, isLoading: loading, error: fetchError } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/bookings");
        console.log("Raw API Response:", response);
        
        // Validasi struktur data
        const bookings = response.data.data;
        if (Array.isArray(bookings)) {
          bookings.forEach((booking, index) => {
            console.log(`Booking ${index} structure:`, {
              hasPackage: !!booking.package,
              hasPackageId: !!booking.package_id,
              hasPayment: !!booking.payment,
              hasVehicle: !!booking.vehicle,
              hasUser: !!booking.user,
              fullBooking: booking
            });
          });
        }
        
        return response.data.data;
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.response?.data?.message || "Failed to fetch bookings");
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Create new booking mutation
  const { mutate: createBooking, isLoading: creating } = useMutation({
    mutationFn: async (bookingData) => {
      const response = await axios.post("/api/bookings", bookingData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error) => {
      setError(error.response?.data?.message || "Failed to create booking");
      throw error;
    },
  });

  // Update booking status mutation
  const { mutate: updateBookingStatus, isLoading: updating } = useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await axios.put(`/api/bookings/${id}`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error) => {
      setError(error.response?.data?.message || "Failed to update status");
      throw error;
    },
  });

  // Delete booking mutation
  const { mutate: deleteBooking, isLoading: deleting } = useMutation({
    mutationFn: async (id) => {
      const response = await axios.delete(`/api/bookings/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error) => {
      setError(error.response?.data?.message || "Failed to delete booking");
      throw error;
    },
  });

  // Get single booking
  const getBooking = async (id) => {
    try {
      // Tambahkan include agar relasi ikut di-fetch
      const response = await axios.get(`/api/bookings/${id}?include=payment,user,package,vehicle,transaction`);
      console.log("Single booking data:", response.data.data);
      // Validasi struktur data booking tunggal
      const booking = response.data.data;
      console.log("Booking structure validation:", {
        hasPackage: !!booking.package,
        packageDetails: booking.package ? {
          id: booking.package.id,
          name: booking.package.name
        } : null,
        hasPayment: !!booking.payment,
        paymentDetails: booking.payment ? {
          method: booking.payment.payment_method,
          status: booking.payment.status
        } : null,
        hasVehicle: !!booking.vehicle,
        vehicleDetails: booking.vehicle ? {
          name: booking.vehicle.name
        } : null,
        hasUser: !!booking.user,
        userDetails: booking.user ? {
          name: booking.user.name,
          email: booking.user.email
        } : null,
        hasTransaction: !!booking.transaction,
        transactionDetails: booking.transaction ? {
          kode_transaksi: booking.transaction.kode_transaksi,
          tanggal: booking.transaction.tanggal,
          jumlah: booking.transaction.jumlah
        } : null
      });
      return booking;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch booking");
      throw error;
    }
  };

  return {
    bookings,
    loading,
    creating,
    updating,
    deleting,
    error: error || fetchError?.message,
    createBooking: (data) => createBooking(data),
    updateBookingStatus: (id, status) => updateBookingStatus({ id, status }),
    deleteBooking: (id) => deleteBooking(id),
    getBooking,
  };
}